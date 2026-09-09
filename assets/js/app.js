/**
 * ADBA DESIGN 3D - MAIN APPLICATION CONTROLLER
 * Controls Cintillo, 3D card tilt effects, FAQ accordion, smooth scrolling, and WhatsApp interactions with updated phone number (5574562812).
 */

document.addEventListener('DOMContentLoaded', () => {

  // 1. CINTILLO / TICKER RIBBON BANNER CONTROLLER
  const cintilloWrapper = document.getElementById('cintillo-banner');
  const btnCloseCintillo = document.getElementById('btn-close-cintillo');

  if (btnCloseCintillo && cintilloWrapper) {
    btnCloseCintillo.addEventListener('click', () => {
      cintilloWrapper.classList.add('hidden');
      document.body.classList.add('cintillo-dismissed');
      localStorage.setItem('adba_cintillo_dismissed', 'true');
    });

    if (localStorage.getItem('adba_cintillo_dismissed') === 'true') {
      cintilloWrapper.classList.add('hidden');
      document.body.classList.add('cintillo-dismissed');
    }
  }

  // 2. 3D CARD & MAP TILT EFFECT (VANILLA 3D MATH)
  const tiltCards = document.querySelectorAll('.tilt-card, .price-card, .comp-card, .map-3d-container');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = ((y - centerY) / centerY) * -8;
      const rotateY = ((x - centerX) / centerX) * 8;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale(1)';
    });
  });

  // 2b. INTERACTIVE 3D ICON PARALLAX TILT & SPIN ON CLICK
  const icon3dBoxes = document.querySelectorAll('.icon-3d-box');

  icon3dBoxes.forEach(iconBox => {
    iconBox.addEventListener('mousemove', (e) => {
      const rect = iconBox.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = ((y - centerY) / centerY) * -22;
      const rotY = ((x - centerX) / centerX) * 22;

      iconBox.style.transform = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.18, 1.18, 1.18)`;
    });

    iconBox.addEventListener('mouseleave', () => {
      if (!iconBox.classList.contains('spinning')) {
        iconBox.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }
    });

    iconBox.addEventListener('click', () => {
      iconBox.classList.add('spinning');
      setTimeout(() => {
        iconBox.classList.remove('spinning');
        iconBox.style.transform = 'perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }, 750);
    });
  });

  // 3. FAQ ACCORDION CONTROLLER
  const faqItems = document.querySelectorAll('.faq-item');

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
      });

      if (!isActive) {
        item.classList.add('active');
      }
    });
  });

  // 4. WHATSAPP DIRECT ACTION HANDLER (NEW NUMBER: 5574562812)
  const waButtons = document.querySelectorAll('[data-wa-package]');

  waButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (document.body.classList.contains('admin-mode-active')) return;

      const packageName = btn.getAttribute('data-wa-package') || 'Servicio de Desarrollo Web';
      const packagePrice = btn.getAttribute('data-wa-price') || '';

      const text = encodeURIComponent(
        `Hola ADBA Diseños, me interesa contratar el *${packageName}* (${packagePrice}). Deseo más información sobre el proceso y tiempos de desarrollo.`
      );

      const waUrl = `https://wa.me/525574562812?text=${text}`;
      window.open(waUrl, '_blank');
    });
  });

  // 5. SMOOTH SCROLL NAVIGATION & MOBILE MENU TOGGLE
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isVisible = navMenu.style.display === 'flex';
      navMenu.style.display = isVisible ? 'none' : 'flex';
      if (!isVisible) {
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.background = 'rgba(5, 5, 8, 0.98)';
        navMenu.style.backdropFilter = 'blur(20px)';
        navMenu.style.padding = '20px';
        navMenu.style.borderRadius = '16px';
        navMenu.style.border = '1px solid var(--border-glass)';
      }
    });
  }

});
