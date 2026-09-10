/**
 * ADBA DESIGN - NEON ORB CURSOR FOLLOWER ENGINE
 * Smoothly moves an interactive luminescent glowing neon orb behind the user's cursor
 * over the pure obsidian deep black background (#000000).
 */

function initNeonOrbFollower() {
  let cursorGlow = document.getElementById('cursor-glow');
  if (!cursorGlow) {
    cursorGlow = document.createElement('div');
    cursorGlow.id = 'cursor-glow';
    cursorGlow.className = 'glow-cursor';
    document.body.appendChild(cursorGlow);
  }

  let mouseX = window.innerWidth / 2;
  let mouseY = window.innerHeight / 2;
  let currentX = mouseX;
  let currentY = mouseY;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function renderOrb() {
    // Smooth lerp movement (0.08 interpolation)
    currentX += (mouseX - currentX) * 0.08;
    currentY += (mouseY - currentY) * 0.08;

    cursorGlow.style.left = `${currentX}px`;
    cursorGlow.style.top = `${currentY}px`;

    requestAnimationFrame(renderOrb);
  }

  renderOrb();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initNeonOrbFollower);
} else {
  initNeonOrbFollower();
}
