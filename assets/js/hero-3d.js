/**
 * ADBA DESIGN 3D - NEON OBSIDIAN 3D ENGINE (THREE.JS)
 * Pure obsidian deep black canvas overlay with floating glowing neon geometries,
 * icosahedrons, orbiting lights, constellation particles, and fluid parallax.
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
        startHero3DScene(canvas);
      } else if (attempts > 30) {
        clearInterval(interval);
      }
    }, 100);
    return;
  }

  startHero3DScene(canvas);
}

function startHero3DScene(canvas) {
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

  // 4. Dynamic High-Contrast Lighting System
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.9);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 8.0, 90);
  cyanLight.position.set(18, 18, 12);
  scene.add(cyanLight);

  const magentaLight = new THREE.PointLight(0xec4899, 8.0, 90);
  magentaLight.position.set(-18, -18, 12);
  scene.add(magentaLight);

  const goldLight = new THREE.PointLight(0xfbbf24, 6.0, 70);
  goldLight.position.set(0, 20, -5);
  scene.add(goldLight);

  const group = new THREE.Group();
  scene.add(group);

  // Vibrant Neon Materials
  const cyanNeonMat = new THREE.MeshStandardMaterial({
    color: 0x06b6d4,
    wireframe: true,
    emissive: 0x06b6d4,
    emissiveIntensity: 0.6,
    roughness: 0.2,
    metalness: 0.8
  });

  const goldNeonMat = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    emissive: 0xd97706,
    emissiveIntensity: 0.5,
    roughness: 0.3,
    metalness: 0.9
  });

  const purpleNeonMat = new THREE.MeshStandardMaterial({
    color: 0x8b5cf6,
    wireframe: true,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.7,
    roughness: 0.2,
    metalness: 0.8
  });

  const emeraldNeonMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x10b981,
    emissiveIntensity: 0.5,
    roughness: 0.2,
    metalness: 0.8
  });

  // 5. Floating Geometries (Cubes, Icosahedrons, Octahedrons, Torus)
  const floatingObjects = [];
  const geometries = [
    new THREE.BoxGeometry(1.2, 1.2, 1.2),
    new THREE.IcosahedronGeometry(1.3, 0),
    new THREE.OctahedronGeometry(1.4, 0),
    new THREE.DodecahedronGeometry(1.1, 0),
    new THREE.TorusGeometry(1.2, 0.4, 16, 50)
  ];

  const materials = [cyanNeonMat, goldNeonMat, purpleNeonMat, emeraldNeonMat];

  for (let i = 0; i < 35; i++) {
    const geo = geometries[i % geometries.length];
    const mat = materials[i % materials.length];

    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 28
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.025,
      rotY: (Math.random() - 0.5) * 0.025,
      floatSpeed: Math.random() * 0.012 + 0.006,
      initialY: mesh.position.y,
      initialX: mesh.position.x
    };
    group.add(mesh);
    floatingObjects.push(mesh);
  }

  // Spin Acceleration on Click
  window.addEventListener('click', () => {
    floatingObjects.forEach(obj => {
      obj.userData.rotX += 0.08;
      obj.userData.rotY += 0.08;
    });
  });

  // 6. Constellation of High-Visibility Particles
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
    size: 0.45,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Line Constellations
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.35
  });

  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];
  const posArr = particleGeo.attributes.position.array;

  for (let i = 0; i < particleCount; i += 5) {
    const x1 = posArr[i * 3];
    const y1 = posArr[i * 3 + 1];
    const z1 = posArr[i * 3 + 2];

    for (let j = i + 1; j < i + 5; j++) {
      const x2 = posArr[j * 3];
      const y2 = posArr[j * 3 + 1];
      const z2 = posArr[j * 3 + 2];

      const dist = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
      if (dist < 14) {
        linePositions.push(x1, y1, z1, x2, y2, z2);
      }
    }
  }

  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineSystem = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSystem);

  // Mouse Parallax Lerp
  let mouseX = 0;
  let mouseY = 0;
  let targetX = 0;
  let targetY = 0;

  const windowHalfX = window.innerWidth / 2;
  const windowHalfY = window.innerHeight / 2;

  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX - windowHalfX) * 0.0012;
    mouseY = (e.clientY - windowHalfY) * 0.0012;
  });

  // Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    floatingObjects.forEach(obj => {
      obj.rotation.x += obj.userData.rotX;
      obj.rotation.y += obj.userData.rotY;
      obj.position.y = obj.userData.initialY + Math.sin(elapsedTime * 1.8 + obj.position.x) * 0.5;
      obj.position.x = obj.userData.initialX + Math.cos(elapsedTime * 1.2 + obj.position.y) * 0.3;
    });

    particleSystem.rotation.y = elapsedTime * 0.03;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.04;
    lineSystem.rotation.y = elapsedTime * 0.03;
    lineSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.04;

    cyanLight.position.x = Math.sin(elapsedTime * 0.7) * 22;
    cyanLight.position.y = Math.cos(elapsedTime * 0.6) * 16;

    magentaLight.position.x = -Math.sin(elapsedTime * 0.6) * 22;
    magentaLight.position.y = -Math.cos(elapsedTime * 0.7) * 16;

    targetX += (mouseX - targetX) * 0.06;
    targetY += (mouseY - targetY) * 0.06;

    camera.position.x = targetX * 14;
    camera.position.y = -targetY * 14;
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
