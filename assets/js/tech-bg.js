/**
 * ADBA DESIGN - STANDALONE CYBER IT DATA NETWORK & MATRIX ENGINE
 * 100% Standalone Canvas animation of glowing cybersecurity nodes, moving binary streams,
 * pulsing tech grid circuits, and floating micro-orbs.
 * Runs locally on all web hosts (including Hostinger) with 0 network requests.
 */

function initTechHeroCanvas() {
  const wrapper = document.querySelector('.hero-video-wrapper');
  if (!wrapper) return;

  let canvas = document.getElementById('tech-hero-canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.id = 'tech-hero-canvas';
    canvas.style.cssText = 'position:absolute; top:0; left:0; width:100%; height:100%; z-index:1; pointer-events:none;';
    wrapper.insertBefore(canvas, wrapper.firstChild);
  }

  const ctx = canvas.getContext('2d');
  let width, height;

  function resize() {
    width = canvas.width = wrapper.clientWidth || window.innerWidth;
    height = canvas.height = wrapper.clientHeight || 500;
  }

  resize();
  window.addEventListener('resize', resize);

  // 1. Nodes & Cyber Network Data
  const nodes = [];
  const nodeCount = Math.min(Math.floor(width / 18), 55);

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.9,
      vy: (Math.random() - 0.5) * 0.9,
      radius: Math.random() * 3.5 + 1.8,
      color: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6',
      pulse: Math.random() * Math.PI
    });
  }

  // 2. Binary Streams (0s and 1s)
  const columns = Math.floor(width / 24);
  const binaryDrops = new Array(columns).fill(0).map(() => Math.random() * -100);

  // 3. Floating Glowing Orbs (Cyber Energy Balls)
  const orbs = [];
  for (let i = 0; i < 8; i++) {
    orbs.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 40 + 20,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      color: i % 2 === 0 ? 'rgba(139, 92, 246, 0.18)' : 'rgba(6, 182, 212, 0.18)'
    });
  }

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // A. Draw Soft Ambient Floating Orbs
    orbs.forEach(orb => {
      orb.x += orb.vx;
      orb.y += orb.vy;

      if (orb.x < -50 || orb.x > width + 50) orb.vx *= -1;
      if (orb.y < -50 || orb.y > height + 50) orb.vy *= -1;

      const grad = ctx.createRadialGradient(orb.x, orb.y, 0, orb.x, orb.y, orb.radius);
      grad.addColorStop(0, orb.color);
      grad.addColorStop(1, 'rgba(0, 0, 0, 0)');

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(orb.x, orb.y, orb.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    // B. Draw Binary Data Streams (Matrix Data Effect)
    ctx.font = 'bold 13px "Courier New", monospace';
    for (let i = 0; i < binaryDrops.length; i++) {
      const char = Math.random() > 0.45 ? '1' : '0';
      const x = i * 24 + 6;
      const y = binaryDrops[i];

      ctx.fillStyle = i % 2 === 0 ? 'rgba(6, 182, 212, 0.65)' : 'rgba(139, 92, 246, 0.60)';
      ctx.shadowColor = i % 2 === 0 ? '#06b6d4' : '#8b5cf6';
      ctx.shadowBlur = 8;
      ctx.fillText(char, x, y);
      ctx.shadowBlur = 0;

      if (y > height + 25) {
        binaryDrops[i] = Math.random() * -50;
      } else {
        binaryDrops[i] += 1.8;
      }
    }

    // C. Draw Connecting Cyber Circuit Lines
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 140) {
          const alpha = (1 - dist / 140) * 0.55;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = i % 2 === 0 ? `rgba(6, 182, 212, ${alpha})` : `rgba(139, 92, 246, ${alpha})`;
          ctx.lineWidth = 1.2;
          ctx.stroke();
        }
      }
    }

    // D. Draw Glowing Cyber Nodes with Pulsing Aura
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;
      node.pulse += 0.05;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      const currentRadius = node.radius + Math.sin(node.pulse) * 0.8;

      ctx.beginPath();
      ctx.arc(node.x, node.y, currentRadius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 14;
      ctx.fill();
      ctx.shadowBlur = 0;
    });

    requestAnimationFrame(animate);
  }

  animate();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initTechHeroCanvas);
} else {
  initTechHeroCanvas();
}
