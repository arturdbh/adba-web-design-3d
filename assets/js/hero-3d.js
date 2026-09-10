/**
 * ADBA DESIGN 3D - RESPONSIVE 3D GLASS ORBS & CONSTELLATION ENGINE (THREE.JS)
 * Glowing 3D physical glass spheres floating deep in background with touch & tilt parallax.
 * Fully visible and optimized on mobile phones and desktop displays.
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

  // 2. Camera Setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = isMobile ? 20 : 22;

  // 3. WebGL Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));

  // 4. Dynamic Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 6.0, 90);
  cyanLight.position.set(16, 16, 12);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 6.0, 90);
  purpleLight.position.set(-16, -16, 12);
  scene.add(purpleLight);

  const goldLight = new THREE.PointLight(0xfbbf24, 4.0, 70);
  goldLight.position.set(0, 18, -8);
  scene.add(goldLight);

  const group = new THREE.Group();
  scene.add(group);

  // 5. 3D Glass Materials
  const cyanGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    roughness: 0.1,
    metalness: 0.25,
    transmission: 0.85,
    transparent: true,
    opacity: 0.85,
    reflectivity: 0.9,
    clearcoat: 1.0
  });

  const purpleGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    roughness: 0.1,
    metalness: 0.25,
    transmission: 0.85,
    transparent: true,
    opacity: 0.85,
    reflectivity: 0.9,
    clearcoat: 1.0
  });

  const goldCrystalMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    roughness: 0.2,
    metalness: 0.85,
    emissive: 0xd97706,
    emissiveIntensity: 0.4
  });

  const magentaNeonMat = new THREE.MeshStandardMaterial({
    color: 0xec4899,
    wireframe: true,
    emissive: 0xec4899,
    emissiveIntensity: 0.7
  });

  // 6. 3D Floating Glass Orbs (Vivid & Scaled for Mobile Visibility)
  const glassOrbs = [];
  const materials = [cyanGlassMat, purpleGlassMat, goldCrystalMat, magentaNeonMat];
  const orbCount = isMobile ? 12 : 18;

  for (let i = 0; i < orbCount; i++) {
    const radius = isMobile ? (0.95 + Math.random() * 1.25) : (1.4 + Math.random() * 1.8);
    const geo = new THREE.SphereGeometry(radius, 32, 32);
    const mat = materials[i % materials.length];

    const orb = new THREE.Mesh(geo, mat);

    orb.position.set(
      (Math.random() - 0.5) * (isMobile ? 22 : 36),
      (Math.random() - 0.5) * (isMobile ? 28 : 24),
      (Math.random() - 0.5) * 14 - 4
    );

    orb.userData = {
      rotX: (Math.random() - 0.5) * 0.018,
      rotY: (Math.random() - 0.5) * 0.018,
      floatSpeed: Math.random() * 0.009 + 0.005,
      initialY: orb.position.y,
      initialX: orb.position.x
    };

    group.add(orb);
    glassOrbs.push(orb);
  }

  // 7. Particle Constellation Field
  const particleCount = isMobile ? 500 : 900;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 90;
    particlePositions[i + 1] = (Math.random() - 0.5) * 60;
    particlePositions[i + 2] = (Math.random() - 0.5) * 45 - 6;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: isMobile ? 0.42 : 0.35,
    transparent: true,
    opacity: 0.75,
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
    mouseX = (clientX - windowHalfX) * 0.001;
    mouseY = (clientY - windowHalfY) * 0.001;
  }

  document.addEventListener('mousemove', onPointerMove, { passive: true });
  document.addEventListener('touchmove', onPointerMove, { passive: true });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    glassOrbs.forEach(orb => {
      orb.rotation.x += orb.userData.rotX;
      orb.rotation.y += orb.userData.rotY;
      orb.position.y = orb.userData.initialY + Math.sin(elapsedTime * 1.4 + orb.position.x) * 0.5;
      orb.position.x = orb.userData.initialX + Math.cos(elapsedTime * 1.0 + orb.position.y) * 0.3;
    });

    particleSystem.rotation.y = elapsedTime * 0.015;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.012) * 0.02;

    cyanLight.position.x = Math.sin(elapsedTime * 0.4) * 18;
    cyanLight.position.y = Math.cos(elapsedTime * 0.3) * 14;

    purpleLight.position.x = -Math.sin(elapsedTime * 0.3) * 18;
    purpleLight.position.y = -Math.cos(elapsedTime * 0.4) * 14;

    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 10;
    camera.position.y = -targetY * 10;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  window.addEventListener('resize', () => {
    const mobileResize = window.innerWidth < 768;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.position.z = mobileResize ? 20 : 22;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3D);
} else {
  initHero3D();
}
