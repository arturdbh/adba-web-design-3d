/**
 * ADBA DESIGN 3D - REAL GLASSMORPHISM ORBS ENGINE (THREE.JS)
 * Floating Glass Crystal Orbs (Sphere Geometries) with WebGL transmission refraction,
 * specular clearcoat highlights, constellation particles, and mouse parallax.
 */

function initHero3D() {
  const canvas = document.getElementById('bg-3d-canvas') || document.getElementById('hero-canvas');
  if (!canvas) return;

  if (typeof THREE === 'undefined') {
    let attempts = 0;
    const interval = setInterval(() => {
      attempts++;
      if (typeof THREE !== 'undefined') {
        clearInterval(interval);
        start3DGlassOrbsScene(canvas);
      } else if (attempts > 30) {
        clearInterval(interval);
      }
    }, 100);
    return;
  }

  start3DGlassOrbsScene(canvas);
}

function start3DGlassOrbsScene(canvas) {
  // 1. Scene Setup
  const scene = new THREE.Scene();

  // 2. Camera Setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 24;

  // 3. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 4. Dynamic Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 6.0, 80);
  cyanLight.position.set(16, 16, 12);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 6.0, 80);
  purpleLight.position.set(-16, -16, 12);
  scene.add(purpleLight);

  const goldLight = new THREE.PointLight(0xfbbf24, 4.0, 60);
  goldLight.position.set(0, 18, -8);
  scene.add(goldLight);

  const group = new THREE.Group();
  scene.add(group);

  // 5. Glassmorphism Materials for 3D Orbs
  const cyanGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.8,
    transparent: true,
    opacity: 0.85,
    reflectivity: 0.95,
    clearcoat: 1.0
  });

  const purpleGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.8,
    transparent: true,
    opacity: 0.85,
    reflectivity: 0.95,
    clearcoat: 1.0
  });

  const goldCrystalMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    metalness: 0.85,
    emissive: 0xd97706,
    emissiveIntensity: 0.35
  });

  const magentaNeonMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    wireframe: true,
    emissive: 0xec4899,
    emissiveIntensity: 0.65
  });

  // 6. 3D Floating Orbs / Spheres
  const glassOrbs = [];
  const materials = [cyanGlassMat, purpleGlassMat, goldCrystalMat, magentaNeonMat];

  for (let i = 0; i < 18; i++) {
    // Sphere Geometry (radius 0.8 to 2.2)
    const radius = 0.8 + Math.random() * 1.4;
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = materials[i % materials.length];

    const orb = new THREE.Mesh(geo, mat);
    orb.position.set(
      (Math.random() - 0.5) * 48,
      (Math.random() - 0.5) * 34,
      (Math.random() - 0.5) * 26
    );

    orb.userData = {
      rotX: (Math.random() - 0.5) * 0.015,
      rotY: (Math.random() - 0.5) * 0.015,
      floatSpeed: Math.random() * 0.01 + 0.005,
      initialY: orb.position.y,
      initialX: orb.position.x
    };

    group.add(orb);
    glassOrbs.push(orb);
  }

  // 7. Constellation Particles (Micro-stars)
  const particleCount = 800;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 90;
    particlePositions[i + 1] = (Math.random() - 0.5) * 60;
    particlePositions[i + 2] = (Math.random() - 0.5) * 45;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: 0.3,
    transparent: true,
    opacity: 0.75,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Mouse Parallax Lerp
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.001;
    mouseY = (e.clientY - windowHalfY) * 0.001;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate and float 3D Glass Orbs
    glassOrbs.forEach(orb => {
      orb.rotation.x += orb.userData.rotX;
      orb.rotation.y += orb.userData.rotY;
      orb.position.y = orb.userData.initialY + Math.sin(elapsedTime * 1.6 + orb.position.x) * 0.45;
      orb.position.x = orb.userData.initialX + Math.cos(elapsedTime * 1.1 + orb.position.y) * 0.3;
    });

    particleSystem.rotation.y = elapsedTime * 0.015;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.01) * 0.02;

    cyanLight.position.x = Math.sin(elapsedTime * 0.5) * 20;
    cyanLight.position.y = Math.cos(elapsedTime * 0.4) * 15;

    purpleLight.position.x = -Math.sin(elapsedTime * 0.4) * 20;
    purpleLight.position.y = -Math.cos(elapsedTime * 0.5) * 15;

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 12;
    camera.position.y = -targetY * 12;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3D);
} else {
  initHero3D();
}
