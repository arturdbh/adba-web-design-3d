/**
 * ADBA DESIGN 3D - ULTRA-RESPONSIVE 3D GLASS ORBS ENGINE (THREE.JS)
 * 3D physical glass spheres floating in background with touch & tilt parallax.
 * Dynamically calculated frustum positioning so 3D orbs are 100% visible on mobile phones & desktop.
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

  // 2. Camera Setup (Adjust Z for viewport aspect ratio)
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = isMobile ? 14 : 22;

  // 3. WebGL Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2.0));

  // 4. Vibrant Lighting for Deep Black Backgrounds
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.0);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 8.0, 100);
  cyanLight.position.set(12, 14, 15);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 8.0, 100);
  purpleLight.position.set(-12, -14, 15);
  scene.add(purpleLight);

  const goldLight = new THREE.PointLight(0xfbbf24, 6.0, 80);
  goldLight.position.set(0, 16, 5);
  scene.add(goldLight);

  const group = new THREE.Group();
  scene.add(group);

  // 5. High-Shine 3D Glass & Neon Materials
  const cyanGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    roughness: 0.05,
    metalness: 0.3,
    transmission: 0.9,
    transparent: true,
    opacity: 0.92,
    reflectivity: 1.0,
    clearcoat: 1.0
  });

  const purpleGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    roughness: 0.05,
    metalness: 0.3,
    transmission: 0.9,
    transparent: true,
    opacity: 0.92,
    reflectivity: 1.0,
    clearcoat: 1.0
  });

  const goldCrystalMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.15,
    metalness: 0.9,
    emissive: 0xd97706,
    emissiveIntensity: 0.6
  });

  const magentaNeonMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    wireframe: true,
    emissive: 0xec4899,
    emissiveIntensity: 0.9
  });

  // 6. 3D Floating Glass Orbs (Centering on Mobile Frustum)
  const glassOrbs = [];
  const materials = [cyanGlassMat, purpleGlassMat, goldCrystalMat, magentaNeonMat];
  const orbCount = isMobile ? 14 : 18;

  // Calculate dynamic visible bounds based on aspect ratio
  const aspect = window.innerWidth / window.innerHeight;
  const visibleWidthAtZ = 2 * Math.tan((60 * Math.PI / 180) / 2) * (camera.position.z - 2) * aspect;

  for (let i = 0; i < orbCount; i++) {
    const radius = isMobile ? (0.85 + Math.random() * 1.1) : (1.3 + Math.random() * 1.7);
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = materials[i % materials.length];

    const orb = new THREE.Mesh(geo, mat);

    // Keep X strictly within visible screen width frustum
    const boundX = isMobile ? (visibleWidthAtZ * 0.42) : 16;
    const boundY = isMobile ? 12 : 14;

    orb.position.set(
      (Math.random() - 0.5) * boundX * 2,
      (Math.random() - 0.5) * boundY * 2,
      (Math.random() - 0.5) * 8 + (isMobile ? 1 : -2)
    );

    orb.userData = {
      rotX: (Math.random() - 0.5) * 0.02,
      rotY: (Math.random() - 0.5) * 0.02,
      floatSpeed: Math.random() * 0.01 + 0.006,
      initialY: orb.position.y,
      initialX: orb.position.x
    };

    group.add(orb);
    glassOrbs.push(orb);
  }

  // 7. Glowing Particle Constellation Field
  const particleCount = isMobile ? 600 : 950;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * (isMobile ? 35 : 85);
    particlePositions[i + 1] = (Math.random() - 0.5) * (isMobile ? 45 : 60);
    particlePositions[i + 2] = (Math.random() - 0.5) * 30 + 2;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: isMobile ? 0.48 : 0.35,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Parallax Interaction (Mouse & Mobile Touch)
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  function onPointerMove(e) {
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    mouseX = (clientX - windowHalfX) * 0.0012;
    mouseY = (clientY - windowHalfY) * 0.0012;
  }

  document.addEventListener('mousemove', onPointerMove, { passive: true });
  document.addEventListener('touchmove', onPointerMove, { passive: true });

  // Device Orientation (Gyroscope for mobile tilt effect if supported)
  window.addEventListener('deviceorientation', (e) => {
    if (e.gamma !== null && e.beta !== null) {
      mouseX = (e.gamma / 45) * 0.5;
      mouseY = (e.beta / 45) * 0.5;
    }
  }, { passive: true });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    glassOrbs.forEach(orb => {
      orb.rotation.x += orb.userData.rotX;
      orb.rotation.y += orb.userData.rotY;
      orb.position.y = orb.userData.initialY + Math.sin(elapsedTime * 1.5 + orb.position.x) * 0.45;
      orb.position.x = orb.userData.initialX + Math.cos(elapsedTime * 1.1 + orb.position.y) * 0.28;
    });

    particleSystem.rotation.y = elapsedTime * 0.018;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.025;

    cyanLight.position.x = Math.sin(elapsedTime * 0.4) * 16;
    cyanLight.position.y = Math.cos(elapsedTime * 0.3) * 12;

    purpleLight.position.x = -Math.sin(elapsedTime * 0.3) * 16;
    purpleLight.position.y = -Math.cos(elapsedTime * 0.4) * 12;

    targetX += (mouseX - targetX) * 0.06;
    targetY += (mouseY - targetY) * 0.06;

    camera.position.x = targetX * (isMobile ? 4 : 8);
    camera.position.y = -targetY * (isMobile ? 4 : 8);
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const mobileResize = window.innerWidth < 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = mobileResize ? 14 : 22;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3D);
} else {
  initHero3D();
}
