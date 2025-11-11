/**
 * Main Application Module
 * Coordinates initialization of all modules
 */

const Notification = {
  timeoutId: null,

  show(message, type = 'info', duration = 3000) {
    const notification = document.getElementById('notification');
    if (!notification) return;

    notification.textContent = message;
    notification.className = `notification show ${type}`;

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }

    this.timeoutId = setTimeout(() => {
      notification.classList.remove('show');
    }, duration);
  }
};

const Confirmation = {
  show(title, message, onConfirm, onCancel = null) {
    const modal = document.getElementById('confirmation-modal');
    const titleEl = modal.querySelector('#confirm-title');
    const messageEl = modal.querySelector('#confirm-message');
    const cancelBtn = modal.querySelector('#confirm-cancel');
    const okBtn = modal.querySelector('#confirm-ok');

    titleEl.textContent = title;
    messageEl.textContent = message;

    const newCancelBtn = cancelBtn.cloneNode(true);
    const newOkBtn = okBtn.cloneNode(true);
    cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
    okBtn.parentNode.replaceChild(newOkBtn, okBtn);

    newCancelBtn.addEventListener('click', () => {
      if (onCancel) onCancel();
      this.close(modal);
    });

    newOkBtn.addEventListener('click', () => {
      onConfirm();
      this.close(modal);
    });

    modal.removeAttribute('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';
    newOkBtn.focus();

    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escapeHandler);
        if (onCancel) onCancel();
        this.close(modal);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  },

  close(modal) {
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

const ModalManager = {
  open(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';
    document.body.style.overflow = 'hidden';

    const closeBtn = modal.querySelector('.modal-close');
    const overlay = modal.querySelector('.modal-overlay');

    const closeHandler = () => this.close(modalId);
    
    if (closeBtn) {
      closeBtn.addEventListener('click', closeHandler);
    }
    
    if (overlay) {
      overlay.addEventListener('click', closeHandler);
    }

    const escapeHandler = (e) => {
      if (e.key === 'Escape') {
        document.removeEventListener('keydown', escapeHandler);
        this.close(modalId);
      }
    };
    document.addEventListener('keydown', escapeHandler);
  },

  close(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  }
};

const App = {
  currentSection: 'directories',
  currentTab: 'clients',

  init() {
    console.log('Initializing Avto Management System...');

    try {
      if (typeof StorageManager !== 'undefined' && StorageManager.initialize) {
        StorageManager.initialize();
      }
    } catch (e) {
      console.warn('StorageManager not available:', e.message);
    }

    this.setupNavigation();
    this.setupSubNavigation();
    this.setupSettings();
    this.setupModals();
    
    try {
      if (typeof DirectoriesModule !== 'undefined') {
        DirectoriesModule.init();
      }
    } catch (e) {
      console.warn('DirectoriesModule not available:', e.message);
    }

    try {
      if (typeof OrderFormModule !== 'undefined') {
        OrderFormModule.init();
      }
    } catch (e) {
      console.warn('OrderFormModule not available:', e.message);
    }

    try {
      if (typeof OrdersRegistryModule !== 'undefined') {
        OrdersRegistryModule.init();
      }
    } catch (e) {
      console.warn('OrdersRegistryModule not available:', e.message);
    }

    try {
      if (typeof LiftCalendarModule !== 'undefined') {
        LiftCalendarModule.init();
      }
    } catch (e) {
      console.warn('LiftCalendarModule not available:', e.message);
    }

    try {
      if (typeof ExportModule !== 'undefined') {
        ExportModule.init();
      }
    } catch (e) {
      console.warn('ExportModule not available:', e.message);
    }

    console.log('Application initialized successfully');
    Notification.show('Application loaded successfully', 'success', 2000);
  },

  setupNavigation() {
    const navBtns = document.querySelectorAll('.nav-btn');
    
    navBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const sectionId = btn.dataset.section;
        this.switchSection(sectionId);
        
        navBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
      });
    });
  },

  setupSubNavigation() {
    const subNavBtns = document.querySelectorAll('.sub-nav-btn');
    
    subNavBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const tabId = btn.dataset.tab;
        this.switchTab(tabId);
        
        subNavBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
  },

  switchSection(sectionId) {
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
      section.classList.remove('active');
      section.style.display = 'none';
    });

    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
      targetSection.classList.add('active');
      targetSection.style.display = 'block';
      this.currentSection = sectionId;
    }
  },

  switchTab(tabId) {
    const tabs = document.querySelectorAll('#directories .tab-content');
    tabs.forEach(tab => {
      tab.classList.remove('active');
      tab.style.display = 'none';
    });

    const targetTab = document.getElementById(`${tabId}-tab`);
    if (targetTab) {
      targetTab.classList.add('active');
      targetTab.style.display = 'block';
      this.currentTab = tabId;
    }
  },

  setupSettings() {
    const settingsBtn = document.querySelector('.settings-btn');
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        ModalManager.open('settings-modal');
      });
    }

    const clearStorageBtn = document.getElementById('clear-storage-btn');
    if (clearStorageBtn) {
      clearStorageBtn.addEventListener('click', () => {
        Confirmation.show(
          'Clear Storage',
          'Are you sure you want to clear all data? This action cannot be undone.',
          () => {
            localStorage.clear();
            Notification.show('Storage cleared successfully', 'success');
            setTimeout(() => location.reload(), 1000);
          }
        );
      });
    }

    const reseedBtn = document.getElementById('reseed-data-btn');
    if (reseedBtn) {
      reseedBtn.addEventListener('click', () => {
        Confirmation.show(
          'Reseed Data',
          'This will reset all data with sample data. Continue?',
          () => {
            if (typeof StorageManager !== 'undefined' && StorageManager.seedData) {
              StorageManager.seedData();
              Notification.show('Data reseeded successfully', 'success');
              setTimeout(() => location.reload(), 1000);
            }
          }
        );
      });
    }
  },

  setupModals() {
    const modalCloseButtons = document.querySelectorAll('.modal-close');
    modalCloseButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        if (modal) {
          modal.setAttribute('hidden', '');
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    });

    const modalOverlays = document.querySelectorAll('.modal-overlay');
    modalOverlays.forEach(overlay => {
      overlay.addEventListener('click', () => {
        const modal = overlay.closest('.modal');
        if (modal) {
          modal.setAttribute('hidden', '');
          modal.style.display = 'none';
          document.body.style.overflow = '';
        }
      });
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => App.init());
} else {
  App.init();
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { App, Notification, Confirmation, ModalManager };
}
