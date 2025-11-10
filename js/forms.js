/**
 * Forms Module
 * Manages form handling, validation, and submission
 */

const Forms = {
  /**
   * Initialize forms
   */
  init() {
    const vehicleForm = document.getElementById('vehicle-form');

    if (vehicleForm) {
      // Apply input masks
      const plateInput = vehicleForm.querySelector('#plate');
      const phoneInput = vehicleForm.querySelector('#phone');

      if (plateInput) {
        InputMask.applyPlateMask(plateInput);
      }

      if (phoneInput) {
        InputMask.applyPhoneMask(phoneInput);
      }

      // Handle form submission
      vehicleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        this.handleSubmit(vehicleForm);
      });

      // Handle form reset
      vehicleForm.addEventListener('reset', () => {
        FormValidation.clearErrors(vehicleForm);
        vehicleForm.dataset.editingId = '';
      });

      // Clear errors on input
      vehicleForm.querySelectorAll('input, select, textarea').forEach(field => {
        field.addEventListener('change', () => {
          const errorEl = field.parentElement.querySelector('.form-error');
          if (errorEl) {
            errorEl.classList.remove('show');
            errorEl.textContent = '';
          }
          field.classList.remove('error');
        });
      });
    }
  },

  /**
   * Handle form submission
   * @param {HTMLFormElement} form
   */
  handleSubmit(form) {
    // Validate form
    const validation = FormValidation.validateForm(form);

    if (!validation.valid) {
      FormValidation.displayErrors(form, validation.errors);
      Notification.show('Please fix the errors in the form', 'error');
      return;
    }

    // Collect form data
    const formData = {
      plate: form.querySelector('#plate').value,
      phone: form.querySelector('#phone').value,
      status: form.querySelector('#status').value,
      workload: form.querySelector('#workload').value,
      notes: form.querySelector('#notes').value
    };

    // Check if editing
    const editingId = form.dataset.editingId;

    if (editingId) {
      // Update existing vehicle
      Storage.updateVehicle(parseInt(editingId, 10), formData);
      Notification.show('Vehicle updated successfully', 'success');
      form.dataset.editingId = '';
    } else {
      // Add new vehicle
      Storage.addVehicle(formData);
      Notification.show('Vehicle added successfully', 'success');
    }

    // Reset form
    form.reset();
    FormValidation.clearErrors(form);

    // Refresh registry
    Registry.render();

    // Optionally switch to registry view
    const navBtns = document.querySelectorAll('.nav-btn');
    Registry.switchSection('registry', navBtns);
  }
};
