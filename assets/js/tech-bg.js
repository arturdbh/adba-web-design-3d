/**
 * ADBA DESIGN - STANDALONE CYBER IT DATA NETWORK & MATRIX ENGINE
 * 100% Standalone Canvas animation of glowing cybersecurity nodes, moving binary streams,
 * and tech grid circuits that runs locally on all web hosts (including Hostinger).
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

  // Nodes & Binary Stream Data
  const nodes = [];
  const nodeCount = Math.min(Math.floor(width / 22), 40);

  for (let i = 0; i < nodeCount; i++) {
    nodes.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.7,
      vy: (Math.random() - 0.5) * 0.7,
      radius: Math.random() * 2.5 + 1.2,
      color: Math.random() > 0.4 ? '#06b6d4' : '#8b5cf6'
    });
  }

  // Binary Streams (0s and 1s)
  const columns = Math.floor(width / 28);
  const binaryDrops = new Array(columns).fill(0).map(() => Math.random() * -60);

  function animate() {
    ctx.clearRect(0, 0, width, height);

    // 1. Draw Binary Streams (Matrix Data Effect)
    ctx.font = '12px "Courier New", monospace';
    for (let i = 0; i < binaryDrops.length; i++) {
      const text = Math.random() > 0.5 ? '1' : '0';
      const x = i * 28 + 8;
      const y = binaryDrops[i];

      ctx.fillStyle = i % 2 === 0 ? 'rgba(6, 182, 212, 0.3)' : 'rgba(139, 92, 246, 0.25)';
      ctx.fillText(text, x, y);

      if (y > height + 20) {
        binaryDrops[i] = Math.random() * -30;
      } else {
        binaryDrops[i] += 1.4;
      }
    }

    // 2. Draw Connecting Circuit Lines between Nodes
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        const dist = Math.hypot(dx, dy);

        if (dist < 125) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(139, 92, 246, ${0.35 * (1 - dist / 125)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    // 3. Draw Nodes with Glowing Aura
    nodes.forEach(node => {
      node.x += node.vx;
      node.y += node.vy;

      if (node.x < 0 || node.x > width) node.vx *= -1;
      if (node.y < 0 || node.y > height) node.vy *= -1;

      ctx.beginPath();
      ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
      ctx.fillStyle = node.color;
      ctx.shadowColor = node.color;
      ctx.shadowBlur = 10;
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
