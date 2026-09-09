/**
 * ADBA DESIGN 3D - FLOATING CUBES & PARTICLE ENGINE (THREE.JS)
 * Fixed WebGL 3D canvas positioned on top of the pure black background.
 * Renders Floating Cubes (4), Glowing Particles (5), and Dynamic Orbiting Lights & Parallax (6).
 */

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('bg-3d-canvas') || document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  // 1. Scene Setup
  const scene = new THREE.Scene();

  // 2. Camera Setup
  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.z = 22;

  // 3. Renderer Setup
  const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    alpha: true,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 4. Dynamic Lighting System (Punto 6)
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
  scene.add(ambientLight);

  const cyanLight = new THREE.PointLight(0x06b6d4, 4, 70);
  cyanLight.position.set(15, 15, 10);
  scene.add(cyanLight);

  const purpleLight = new THREE.PointLight(0x8b5cf6, 4, 70);
  purpleLight.position.set(-15, -15, 10);
  scene.add(purpleLight);

  const goldLight = new THREE.PointLight(0xfbbf24, 3, 50);
  goldLight.position.set(0, 15, -5);
  scene.add(goldLight);

  // Group for 3D elements
  const group = new THREE.Group();
  scene.add(group);

  // Materials
  const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0x06b6d4,
    metalness: 0.2,
    roughness: 0.15,
    transmission: 0.7,
    transparent: true,
    opacity: 0.85,
    reflectivity: 0.9,
    clearcoat: 1.0
  });

  const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xfbbf24,
    metalness: 0.85,
    roughness: 0.2,
    emissive: 0xd97706,
    emissiveIntensity: 0.25
  });

  const purpleGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x8b5cf6,
    metalness: 0.3,
    roughness: 0.2,
    transparent: true,
    opacity: 0.8,
    emissive: 0x8b5cf6,
    emissiveIntensity: 0.3
  });

  // PUNTO 4: Campo de Cubos Flotantes Glassmorphism & Dorados
  const cubes = [];
  const cubeGeo = new THREE.BoxGeometry(0.85, 0.85, 0.85);

  for (let i = 0; i < 30; i++) {
    let mat;
    if (i % 3 === 0) mat = glassMaterial;
    else if (i % 3 === 1) mat = goldMaterial;
    else mat = purpleGlassMat;

    const mesh = new THREE.Mesh(cubeGeo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 45,
      (Math.random() - 0.5) * 32,
      (Math.random() - 0.5) * 25
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      rotX: (Math.random() - 0.5) * 0.02,
      rotY: (Math.random() - 0.5) * 0.02,
      floatSpeed: Math.random() * 0.01 + 0.005,
      initialY: mesh.position.y
    };
    group.add(mesh);
    cubes.push(mesh);
  }

  // INTERACTIVE 3D FLOATING GEMS & SYMBOLS
  const interactiveGems = [];
  const gemGeometries = [
    new THREE.OctahedronGeometry(1.2, 0),
    new THREE.DodecahedronGeometry(1.1, 0),
    new THREE.IcosahedronGeometry(1.3, 0),
    new THREE.TetrahedronGeometry(1.4, 0)
  ];

  for (let i = 0; i < 6; i++) {
    const geo = gemGeometries[i % gemGeometries.length];
    const mat = i % 2 === 0 ? glassMaterial.clone() : goldMaterial.clone();
    mat.wireframe = (i % 3 === 2);
    
    const gem = new THREE.Mesh(geo, mat);
    gem.position.set(
      (Math.random() - 0.5) * 36,
      (Math.random() - 0.5) * 22,
      (Math.random() - 0.5) * 15
    );
    gem.userData = {
      baseX: gem.position.x,
      baseY: gem.position.y,
      rotXSpeed: (Math.random() - 0.5) * 0.03,
      rotYSpeed: (Math.random() - 0.5) * 0.03,
      interactiveBoost: 0
    };
    group.add(gem);
    interactiveGems.push(gem);
  }

  // Click on canvas or window boosts 3D spin
  window.addEventListener('click', () => {
    interactiveGems.forEach(g => {
      g.userData.interactiveBoost = 0.4;
    });
  });

  // PUNTO 5: Constelación de Partículas Lumínicas
  const particleCount = 700;
  const particleGeo = new THREE.BufferGeometry();
  const particlePositions = new Float32Array(particleCount * 3);

  for (let i = 0; i < particleCount * 3; i += 3) {
    particlePositions[i] = (Math.random() - 0.5) * 85;
    particlePositions[i + 1] = (Math.random() - 0.5) * 55;
    particlePositions[i + 2] = (Math.random() - 0.5) * 40;
  }

  particleGeo.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

  const particleMat = new THREE.PointsMaterial({
    color: 0x06b6d4,
    size: 0.18,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  scene.add(particleSystem);

  // Line segments connecting nearby particles softly
  const lineMat = new THREE.LineBasicMaterial({
    color: 0x8b5cf6,
    transparent: true,
    opacity: 0.15
  });

  const lineGeo = new THREE.BufferGeometry();
  const linePositions = [];
  const posArr = particleGeo.attributes.position.array;

  for (let i = 0; i < particleCount; i += 4) {
    const x1 = posArr[i * 3];
    const y1 = posArr[i * 3 + 1];
    const z1 = posArr[i * 3 + 2];

    for (let j = i + 1; j < i + 4; j++) {
      const x2 = posArr[j * 3];
      const y2 = posArr[j * 3 + 1];
      const z2 = posArr[j * 3 + 2];

      const dist = Math.hypot(x1 - x2, y1 - y2, z1 - z2);
      if (dist < 12) {
        linePositions.push(x1, y1, z1, x2, y2, z2);
      }
    }
  }

  lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
  const lineSystem = new THREE.LineSegments(lineGeo, lineMat);
  scene.add(lineSystem);

  // PUNTO 6: Luces y Cámaras Dinámicas con Paralaje al mover el mouse
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

  // 8. Animation Loop
  const clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);
    const elapsedTime = clock.getElapsedTime();

    // Rotate cubes gently & gentle floating motion
    cubes.forEach(c => {
      c.rotation.x += c.userData.rotX;
      c.rotation.y += c.userData.rotY;
      c.position.y = c.userData.initialY + Math.sin(elapsedTime * 1.5 + c.position.x) * 0.4;
    });

    // Animate interactive gems with mouse momentum & spin boosts
    interactiveGems.forEach(g => {
      const speedX = g.userData.rotXSpeed + g.userData.interactiveBoost;
      const speedY = g.userData.rotYSpeed + g.userData.interactiveBoost;
      g.rotation.x += speedX;
      g.rotation.y += speedY;
      g.position.y = g.userData.baseY + Math.sin(elapsedTime * 2.0 + g.position.x) * 0.6;
      g.position.x = g.userData.baseX + Math.cos(elapsedTime * 1.2 + g.position.y) * 0.4;
      g.userData.interactiveBoost *= 0.95; // Decay boost smoothly
    });

    // Rotate particle field
    particleSystem.rotation.y = elapsedTime * 0.02;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.03;
    lineSystem.rotation.y = elapsedTime * 0.02;
    lineSystem.rotation.x = Math.sin(elapsedTime * 0.015) * 0.03;

    // Orbit point lights dynamically
    cyanLight.position.x = Math.sin(elapsedTime * 0.6) * 18;
    cyanLight.position.y = Math.cos(elapsedTime * 0.5) * 14;

    purpleLight.position.x = -Math.sin(elapsedTime * 0.5) * 18;
    purpleLight.position.y = -Math.cos(elapsedTime * 0.6) * 14;

    // Camera mouse lerp parallax
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    camera.position.x = targetX * 12;
    camera.position.y = -targetY * 12;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }

  animate();

  // 9. Window Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
});
