/**
 * ADBA DESIGN 3D - SUBTLE NEON OBSIDIAN PARTICLE & CONSTELLATION ENGINE (THREE.JS)
 * Pure obsidian deep black background (#000000) with subtle floating 3D luminescent
 * particles, constellation lines, orbiting glow lights, and mouse parallax.
 * Designed specifically to NEVER overlap or obscure typography.
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
        startSubtle3DScene(canvas);
      } else if (attempts > 30) {
        clearInterval(interval);
      }
    }, 100);
    return;
  }

  startSubtle3DScene(canvas);
}

function startSubtle3DScene(canvas) {
  // 1. Scene Setup
  const scene = new THREE.Scene();

  // 2. Camera Setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 28;

  // 3. Renderer Setup with Pure Black Background
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 4. Soft Dynamic Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 5.0, 80);
  cyanLight.position.set(20, 20, 10);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 5.0, 80);
  purpleLight.position.set(-20, -20, 10);
  scene.add(purpleLight);

  const goldLight = new THREE.PointLight(0xfbbf24, 3.5, 60);
  goldLight.position.set(0, 15, -10);
  scene.add(goldLight);

  // 5. High-Contrast Constellation Particle Network on Pure Black
  const particleCount = 1200;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 95;
    particlePositions[i + 1] = (Math.random() - 0.5) * 65;
    particlePositions[i + 2] = (Math.random() - 0.5) * 50 - 5;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: 0.35,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Connecting Constellation Lines
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.25
  });

  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];
  const posArr = particleGeo.attributes.position.array;

  for (let i = 0; i < particleCount; i += 6) {
    const x1 = posArr[i * 3];
    const y1 = posArr[i * 3 + 1];
    const z1 = posArr[i * 3 + 2];

    for (let j = i + 1; j < i + 6; j++) {
      const x2 = posArr[j * 3];
      const y2 = posArr[j * 3 + 1];
      const z2 = posArr[j * 3 + 2];

      const dist = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
      if (dist < 13) {
        linePositions.push(x1, y1, z1, x2, y2, z2);
      }
    }
  }

  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineSystem = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSystem);

  // 6. Smooth Mouse Parallax
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

  // 7. Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Gentle rotation of the particle constellation
    particleSystem.rotation.y = elapsedTime * 0.015;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.01) * 0.02;
    lineSystem.rotation.y = elapsedTime * 0.015;
    lineSystem.rotation.x = Math.sin(elapsedTime * 0.01) * 0.02;

    // Orbiting point lights
    cyanLight.position.x = Math.sin(elapsedTime * 0.5) * 22;
    cyanLight.position.y = Math.cos(elapsedTime * 0.4) * 16;

    purpleLight.position.x = -Math.sin(elapsedTime * 0.4) * 22;
    purpleLight.position.y = -Math.cos(elapsedTime * 0.5) * 16;

    // Parallax motion
    targetX += (mouseX - targetX) * 0.04;
    targetY += (mouseY - targetY) * 0.04;

    camera.position.x = targetX * 10;
    camera.position.y = -targetY * 10;
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

// Run immediately or on DOMContentLoaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initHero3D);
} else {
  initHero3D();
}
