/**
 * Settings Module
 * Manages the settings panel and data management options
 */

const Settings = {
  /**
   * Initialize settings
   */
  init() {
    const settingsBtn = document.querySelector('.settings-btn');
    const settingsModal = document.getElementById('settings-modal');
    const modalClose = settingsModal.querySelector('.modal-close');
    const clearStorageBtn = document.getElementById('clear-storage-btn');
    const reseedDataBtn = document.getElementById('reseed-data-btn');
    const modalOverlay = settingsModal.querySelector('.modal-overlay');

    // Open settings
    if (settingsBtn) {
      settingsBtn.addEventListener('click', () => {
        this.openModal(settingsModal);
      });
    }

    // Close settings
    if (modalClose) {
      modalClose.addEventListener('click', () => {
        this.closeModal(settingsModal);
      });
    }

    if (modalOverlay) {
      modalOverlay.addEventListener('click', () => {
        this.closeModal(settingsModal);
      });
    }

    // Clear storage
    if (clearStorageBtn) {
      clearStorageBtn.addEventListener('click', () => {
        this.confirmClearStorage();
      });
    }

    // Reseed data
    if (reseedDataBtn) {
      reseedDataBtn.addEventListener('click', () => {
        this.confirmReseedData();
      });
    }

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !settingsModal.hasAttribute('hidden')) {
        this.closeModal(settingsModal);
      }
    });
  },

  /**
   * Open settings modal
   * @param {HTMLElement} modal
   */
  openModal(modal) {
    modal.removeAttribute('hidden');
    modal.style.display = 'flex';

    // Focus on modal
    const closeBtn = modal.querySelector('.modal-close');
    if (closeBtn) {
      closeBtn.focus();
    }

    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  },

  /**
   * Close settings modal
   * @param {HTMLElement} modal
   */
  closeModal(modal) {
    modal.setAttribute('hidden', '');
    modal.style.display = 'none';
    document.body.style.overflow = '';
  },

  /**
   * Confirm clear storage
   */
  confirmClearStorage() {
    Confirmation.show(
      'Clear all data?',
      'This will delete all vehicles and reset the application. This action cannot be undone.',
      () => {
        Storage.clear();
        Notification.show('All data cleared', 'success');

        // Close settings modal
        const settingsModal = document.getElementById('settings-modal');
        this.closeModal(settingsModal);

        // Reset UI
        setTimeout(() => {
          location.reload();
        }, 500);
      }
    );
  },

  /**
   * Confirm reseed data
   */
  confirmReseedData() {
    Confirmation.show(
      'Reseed sample data?',
      'This will clear existing data and regenerate sample vehicles. This action cannot be undone.',
      () => {
        Storage.clearAndReseed();
        Notification.show('Sample data regenerated', 'success');

        // Close settings modal
        const settingsModal = document.getElementById('settings-modal');
        this.closeModal(settingsModal);

        // Refresh UI
        Registry.render();
        Calendar.resetToCurrentMonth();
      }
    );
  }
};
