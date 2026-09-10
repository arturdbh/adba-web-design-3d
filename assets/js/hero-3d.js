/**
 * ADBA DESIGN 3D - RESPONSIVE MICRO GLASS ORBS ENGINE (THREE.JS)
 * Elegant micro-scaled 3D glass spheres floating deep in the background.
 * Optimized for 100% typography legibility and perfect mobile responsiveness.
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
        start3DResponsiveOrbsScene(canvas);
      } else if (attempts > 30) {
        clearInterval(interval);
      }
    }, 100);
    return;
  }

  start3DResponsiveOrbsScene(canvas);
}

function start3DResponsiveOrbsScene(canvas) {
  const isMobile = window.innerWidth < 768;

  // 1. Scene Setup
  const scene = new THREE.Scene();

  // 2. Camera Setup (Pushed back for typography clearance)
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = isMobile ? 32 : 28;

  // 3. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  // 4. Soft Dynamic Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 5.0, 80);
  cyanLight.position.set(16, 16, 10);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 5.0, 80);
  purpleLight.position.set(-16, -16, 10);
  scene.add(purpleLight);

  const goldLight = new THREE.PointLight(0xfbbf24, 3.5, 60);
  goldLight.position.set(0, 18, -10);
  scene.add(goldLight);

  const group = new THREE.Group();
  scene.add(group);

  // 5. Elegant Micro Glass Materials
  const cyanGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.85,
    transparent: true,
    opacity: 0.8,
    reflectivity: 0.9,
    clearcoat: 1.0
  });

  const purpleGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    roughness: 0.1,
    metalness: 0.2,
    transmission: 0.85,
    transparent: true,
    opacity: 0.8,
    reflectivity: 0.9,
    clearcoat: 1.0
  });

  const goldCrystalMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    metalness: 0.8,
    emissive: 0xd97706,
    emissiveIntensity: 0.3
  });

  const magentaNeonMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    wireframe: true,
    emissive: 0xec4899,
    emissiveIntensity: 0.6
  });

  // 6. Micro 3D Floating Orbs (Small scale, pushed deep to the background)
  const glassOrbs = [];
  const materials = [cyanGlassMat, purpleGlassMat, goldCrystalMat, magentaNeonMat];
  const orbCount = isMobile ? 8 : 14;

  for (let i = 0; i < orbCount; i++) {
    // Micro radius (0.25 to 0.55 max) to NEVER interfere with typography
    const radius = isMobile ? (0.2 + Math.random() * 0.25) : (0.35 + Math.random() * 0.35);
    const geo = new THREE.SphereGeometry(radius, 24, 24);
    const mat = materials[i % materials.length];

    const orb = new THREE.Mesh(geo, mat);

    // On mobile, keep orbs towards the side margins so center text is 100% clean
    let posX = (Math.random() - 0.5) * (isMobile ? 32 : 48);
    if (isMobile && Math.abs(posX) < 8) {
      posX = posX >= 0 ? posX + 8 : posX - 8;
    }

    orb.position.set(
      posX,
      (Math.random() - 0.5) * (isMobile ? 40 : 34),
      (Math.random() - 0.5) * 20 - 10 // Pushed back behind text layer
    );

    orb.userData = {
      rotX: (Math.random() - 0.5) * 0.015,
      rotY: (Math.random() - 0.5) * 0.015,
      floatSpeed: Math.random() * 0.008 + 0.004,
      initialY: orb.position.y,
      initialX: orb.position.x
    };

    group.add(orb);
    glassOrbs.push(orb);
  }

  // 7. Micro Particle Constellation Field
  const particleCount = isMobile ? 450 : 800;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 90;
    particlePositions[i + 1] = (Math.random() - 0.5) * 60;
    particlePositions[i + 2] = (Math.random() - 0.5) * 45 - 8;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: isMobile ? 0.22 : 0.28,
    transparent: true,
    opacity: 0.7,
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
    mouseX = (e.clientX - windowHalfX) * 0.0008;
    mouseY = (e.clientY - windowHalfY) * 0.0008;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    glassOrbs.forEach(orb => {
      orb.rotation.x += orb.userData.rotX;
      orb.rotation.y += orb.userData.rotY;
      orb.position.y = orb.userData.initialY + Math.sin(elapsedTime * 1.4 + orb.position.x) * 0.35;
      orb.position.x = orb.userData.initialX + Math.cos(elapsedTime * 1.0 + orb.position.y) * 0.25;
    });

    particleSystem.rotation.y = elapsedTime * 0.012;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.01) * 0.015;

    cyanLight.position.x = Math.sin(elapsedTime * 0.4) * 18;
    cyanLight.position.y = Math.cos(elapsedTime * 0.3) * 14;

    purpleLight.position.x = -Math.sin(elapsedTime * 0.3) * 18;
    purpleLight.position.y = -Math.cos(elapsedTime * 0.4) * 14;

    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 8;
    camera.position.y = -targetY * 8;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const mobileResize = window.innerWidth < 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = mobileResize ? 32 : 28;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3D);
} else {
  initHero3D();
}
