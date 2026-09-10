/**
 * ADBA DESIGN 3D - PASSWORD PROTECTED VISUAL TEXT & POSITION ADMIN EDITOR
 * Requires password authentication ('adba2026') to access admin functions.
 * Allows editing all texts including top cintillo promotions and terms & conditions.
 */

class ADBAVisualAdmin {
  constructor() {
    this.isAdminActive = false;
    this.isDragModeActive = false;
    this.isAuthenticated = false;
    this.correctPassword = 'adba2026';
    this.storageKey = 'adba_3d_text_backup_v1';
    this.authSessionKey = 'adba_admin_auth_v1';
    this.draggedElement = null;

    this.init();
  }

  init() {
    this.createPasswordModal();
    this.createFloatingTriggerButton();
    this.createToolbar();
    this.loadSavedText();
    this.setupEditableNodes();
    this.bindGlobalEvents();

    if (sessionStorage.getItem(this.authSessionKey) === 'true') {
      this.isAuthenticated = true;
    }
  }

  createFloatingTriggerButton() {
    if (document.getElementById('btn-admin-floating-trigger')) return;
    const btn = document.createElement('button');
    btn.id = 'btn-admin-floating-trigger';
    btn.className = 'btn-admin-bottom-trigger';
    btn.type = 'button';
    btn.innerHTML = '<i class="fas fa-shield-alt"></i> <span>Panel Admin (adba2026)</span>';
    btn.onclick = () => this.requestAccess();
    document.body.appendChild(btn);
  }

  createPasswordModal() {
    if (document.getElementById('modal-admin-auth')) return;

    const modalHtml = `
      <div id="modal-admin-auth" class="admin-auth-overlay" style="display:none;">
        <div class="admin-auth-card">
          <div class="auth-icon" style="background:rgba(16,185,129,0.2); color:#10b981;"><i class="fas fa-shield-alt"></i></div>
          <h3>Panel de Mantenimiento & Control</h3>
          <p>Ingresa la contraseña maestra <strong>adba2026</strong> para desbloquear el estado del servidor, monitoreo de seguridad y edición del sitio.</p>
          
          <form id="admin-auth-form" onsubmit="event.preventDefault(); window.adbaAdmin.verifyPassword();">
            <div class="auth-input-group">
              <i class="fas fa-key"></i>
              <input type="password" id="admin-pass-input" placeholder="Contraseña (adba2026)..." required autocomplete="off">
            </div>
            <div style="display:flex; gap:12px; margin-top:20px;">
              <button type="submit" class="btn-primary" style="flex:1; justify-content:center; background:linear-gradient(135deg,#10b981,#06b6d4);">
                <i class="fas fa-unlock"></i> Desbloquear Panel
              </button>
              <button type="button" class="btn-secondary" onclick="window.adbaAdmin.closeAuthModal()">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
  }

  createToolbar() {
    if (document.getElementById('admin-toolbar')) return;

    const toolbarHtml = `
      <div id="admin-toolbar" class="admin-toolbar hidden">
        <div class="admin-status">
          <span class="admin-status-dot" id="admin-dot" style="background:#10b981; box-shadow:0 0 10px #10b981;"></span>
          <span id="admin-status-text">🛡️ PANEL DE MANTENIMIENTO: ACTIVO | SSD OK | SSL 256 bits | 100/100 Speed</span>
        </div>
        
        <button type="button" class="admin-btn" id="btn-toggle-admin" title="Activar/Desactivar Edición directa">
          <i class="fas fa-edit"></i> <span id="label-toggle-admin">Finalizar Edición</span>
        </button>

        <button type="button" class="admin-btn" id="btn-toggle-drag" title="Activar modo arrastrar y reordenar elementos">
          <i class="fas fa-arrows-alt"></i> <span>Reordenar Bloques</span>
        </button>

        <button type="button" class="admin-btn admin-btn-save" id="btn-save-admin" title="Guardar todos los cambios en el navegador">
          <i class="fas fa-save"></i> <span>Guardar Cambios</span>
        </button>

        <button type="button" class="admin-btn" id="btn-export-admin" title="Descargar copia de seguridad en JSON">
          <i class="fas fa-download"></i> <span>Exportar JSON</span>
        </button>

        <button type="button" class="admin-btn admin-btn-reset" id="btn-reset-admin" title="Restaurar textos originales">
          <i class="fas fa-undo"></i> <span>Restablecer</span>
        </button>

        <button type="button" class="admin-btn" id="btn-logout-admin" style="background:rgba(239,68,68,0.3); border-color:#ef4444; color:#fff;" title="Cerrar Sesión de Administrador">
          <i class="fas fa-lock"></i> <span>Salir Admin</span>
        </button>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', toolbarHtml);

    document.getElementById('btn-toggle-admin').addEventListener('click', () => this.toggleAdminMode());
    document.getElementById('btn-toggle-drag').addEventListener('click', () => this.toggleDragMode());
    document.getElementById('btn-save-admin').addEventListener('click', () => this.saveAllChanges());
    document.getElementById('btn-export-admin').addEventListener('click', () => this.exportJSON());
    document.getElementById('btn-reset-admin').addEventListener('click', () => this.resetOriginalText());
    document.getElementById('btn-logout-admin').addEventListener('click', () => this.logout());
  }

  requestAccess() {
    if (this.isAuthenticated) {
      this.toggleAdminMode();
    } else {
      this.openAuthModal();
    }
  }

  openAuthModal() {
    const modal = document.getElementById('modal-admin-auth');
    const passInput = document.getElementById('admin-pass-input');
    if (modal && passInput) {
      modal.style.display = 'flex';
      passInput.value = '';
      setTimeout(() => passInput.focus(), 100);
    }
  }

  closeAuthModal() {
    const modal = document.getElementById('modal-admin-auth');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  verifyPassword() {
    const passInput = document.getElementById('admin-pass-input');
    const entered = passInput ? passInput.value.trim() : '';

    if (entered === this.correctPassword) {
      this.isAuthenticated = true;
      sessionStorage.setItem(this.authSessionKey, 'true');
      this.closeAuthModal();
      this.showToast('🔓 Acceso Concedido. Puedes editar textos y el cintillo de promociones.', 'success');
      this.enableAdmin();
    } else {
      this.showToast('❌ Contraseña Incorrecta. Intenta nuevamente.', 'warning');
      if (passInput) {
        passInput.style.borderColor = '#ef4444';
        passInput.value = '';
        passInput.focus();
      }
    }
  }

  enableAdmin() {
    this.isAdminActive = true;
    document.body.classList.add('admin-mode-active');
    
    const toolbar = document.getElementById('admin-toolbar');
    if (toolbar) toolbar.classList.remove('hidden');

    const nodes = document.querySelectorAll('[data-cms-key]');
    nodes.forEach(node => {
      node.setAttribute('contenteditable', 'true');
      node.setAttribute('spellcheck', 'false');
    });

    const toggleLabel = document.getElementById('label-toggle-admin');
    if (toggleLabel) toggleLabel.innerText = 'Finalizar Edición';
  }

  disableAdmin() {
    this.isAdminActive = false;
    document.body.classList.remove('admin-mode-active');

    const nodes = document.querySelectorAll('[data-cms-key]');
    nodes.forEach(node => {
      node.removeAttribute('contenteditable');
    });

    const toggleLabel = document.getElementById('label-toggle-admin');
    if (toggleLabel) toggleLabel.innerText = 'Activar Edición';
  }

  toggleAdminMode() {
    if (!this.isAuthenticated) {
      this.openAuthModal();
      return;
    }

    if (this.isAdminActive) {
      this.disableAdmin();
      this.showToast('🔒 Modo Edición Pausado.', 'info');
    } else {
      this.enableAdmin();
      this.showToast('✏️ Modo Edición Activado. ¡Haz clic en cualquier texto o promociones del cintillo!', 'info');
    }
  }

  logout() {
    this.disableAdmin();
    this.isAuthenticated = false;
    sessionStorage.removeItem(this.authSessionKey);

    const toolbar = document.getElementById('admin-toolbar');
    if (toolbar) toolbar.classList.add('hidden');

    this.showToast('🔒 Sesión de Administrador Cerrada.', 'info');
  }

  toggleDragMode() {
    if (!this.isAuthenticated) return;
    this.isDragModeActive = !this.isDragModeActive;
    const cards = document.querySelectorAll('.price-card, .comp-card, .faq-item, .term-card');

    cards.forEach(card => {
      if (this.isDragModeActive) {
        card.setAttribute('draggable', 'true');
        card.style.cursor = 'move';
        card.addEventListener('dragstart', this.handleDragStart.bind(this));
        card.addEventListener('dragover', this.handleDragOver.bind(this));
        card.addEventListener('drop', this.handleDrop.bind(this));
      } else {
        card.removeAttribute('draggable');
        card.style.cursor = 'default';
      }
    });

    if (this.isDragModeActive) {
      this.showToast('🔀 Modo Mover Activado. Arrastra los bloques para reordenarlos.', 'info');
    } else {
      this.showToast('🔒 Modo Mover Desactivado.', 'info');
    }
  }

  handleDragStart(e) {
    this.draggedElement = e.currentTarget;
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

  handleDrop(e) {
    e.preventDefault();
    const targetCard = e.currentTarget;
    if (this.draggedElement && targetCard && this.draggedElement !== targetCard) {
      const parent = targetCard.parentNode;
      const allCards = Array.from(parent.children);
      const draggedIndex = allCards.indexOf(this.draggedElement);
      const targetIndex = allCards.indexOf(targetCard);

      if (draggedIndex < targetIndex) {
        parent.insertBefore(this.draggedElement, targetCard.nextSibling);
      } else {
        parent.insertBefore(this.draggedElement, targetCard);
      }
      this.showToast('👌 Elemento reordenado.', 'success');
    }
  }

  saveAllChanges() {
    if (!this.isAuthenticated) return;
    const data = {};
    const nodes = document.querySelectorAll('[data-cms-key]');

    nodes.forEach(node => {
      const key = node.getAttribute('data-cms-key');
      if (key) {
        data[key] = node.innerHTML;
      }
    });

    localStorage.setItem(this.storageKey, JSON.stringify(data));
    this.showToast('💾 ¡Cambios guardados con éxito en la memoria local!', 'success');
  }

  loadSavedText() {
    const saved = localStorage.getItem(this.storageKey);
    if (!saved) return;

    try {
      const data = JSON.parse(saved);
      Object.keys(data).forEach(key => {
        const node = document.querySelector(`[data-cms-key="${key}"]`);
        if (node) {
          node.innerHTML = data[key];
        }
      });
    } catch (err) {
      console.error('Error al cargar datos guardados:', err);
    }
  }

  exportJSON() {
    if (!this.isAuthenticated) return;
    const data = {};
    const nodes = document.querySelectorAll('[data-cms-key]');
    nodes.forEach(node => {
      const key = node.getAttribute('data-cms-key');
      if (key) {
        data[key] = node.innerHTML;
      }
    });

    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `adba-textos-cintillo-respaldo-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);

    this.showToast('📥 Respaldo JSON descargado.', 'success');
  }

  resetOriginalText() {
    if (!this.isAuthenticated) return;
    if (confirm('¿Restablecer los textos originales de fábrica? Se borrarán tus ediciones del cintillo y promociones.')) {
      localStorage.removeItem(this.storageKey);
      this.showToast('🔄 Textos restaurados. Recargando página...', 'warning');
      setTimeout(() => location.reload(), 1000);
    }
  }

  setupEditableNodes() {
    const targets = document.querySelectorAll(
      '[data-cms-key], .cintillo-item span, .cintillo-badge, h1, h2, h3, h4, .hero-desc, .section-subtitle, .package-name, .price-amount, .comp-title, .comp-item span, .price-features li, .term-card h4, .term-card p, .faq-question, .faq-answer, p'
    );

    let keyCounter = 1;
    targets.forEach(node => {
      if (node.closest('#admin-toolbar') || node.closest('#modal-admin-auth') || node.closest('.cintillo-close')) return;

      if (!node.hasAttribute('data-cms-key')) {
        node.setAttribute('data-cms-key', `node_key_${keyCounter++}`);
      }
    });
  }

  bindGlobalEvents() {
    document.addEventListener('click', (e) => {
      if (this.isAdminActive) {
        const anchor = e.target.closest('a');
        if (anchor && !anchor.closest('#admin-toolbar') && !anchor.closest('#modal-admin-auth')) {
          e.preventDefault();
        }
      }
    });

    // Keyboard shortcut Ctrl+Shift+A or Alt+A to trigger Admin Login
    document.addEventListener('keydown', (e) => {
      if ((e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') || (e.altKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        this.requestAccess();
      }
    });

    // Check URL hash #admin
    if (window.location.hash === '#admin') {
      setTimeout(() => this.requestAccess(), 300);
    }
  }

  showToast(message, type = 'info') {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let icon = '<i class="fas fa-info-circle" style="color:var(--adba-cyan);"></i>';
    if (type === 'success') icon = '<i class="fas fa-check-circle" style="color:#10b981;"></i>';
    if (type === 'warning') icon = '<i class="fas fa-exclamation-triangle" style="color:var(--adba-gold);"></i>';

    toast.innerHTML = `${icon} <span>${message}</span>`;
    container.appendChild(toast);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 0.3s ease';
      setTimeout(() => toast.remove(), 300);
    }, 3500);
  }
}

// Instantiate Protected Admin System
document.addEventListener('DOMContentLoaded', () => {
  window.adbaAdmin = new ADBAVisualAdmin();
});
