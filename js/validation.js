/**
 * Form Validation Module
 * Provides validation helpers for required fields, numeric ranges, and error messaging
 */

const FormValidation = {
  /**
   * Validate required field
   * @param {string} value
   * @param {string} fieldName
   * @returns {Object} { valid: boolean, message: string }
   */
  validateRequired(value, fieldName) {
    if (!value || value.trim() === '') {
      return {
        valid: false,
        message: `${fieldName} is required.`
      };
    }
    return { valid: true, message: '' };
  },

  /**
   * Validate phone number
   * @param {string} phone
   * @returns {Object} { valid: boolean, message: string }
   */
  validatePhone(phone) {
    const requiredCheck = this.validateRequired(phone, 'Phone number');
    if (!requiredCheck.valid) {
      return requiredCheck;
    }

    if (!InputMask.isValidPhone(phone)) {
      return {
        valid: false,
        message: 'Phone number must be in format +7 (XXX) XXX-XX-XX'
      };
    }

    return { valid: true, message: '' };
  },

  /**
   * Validate vehicle plate
   * @param {string} plate
   * @returns {Object} { valid: boolean, message: string }
   */
  validatePlate(plate) {
    const requiredCheck = this.validateRequired(plate, 'Vehicle plate');
    if (!requiredCheck.valid) {
      return requiredCheck;
    }

    if (!InputMask.isValidPlate(plate)) {
      return {
        valid: false,
        message: 'Plate must be in format A000AA00 (letter, 3 digits, 2 letters, 2 digits)'
      };
    }

    return { valid: true, message: '' };
  },

  /**
   * Validate select/dropdown (not empty)
   * @param {string} value
   * @param {string} fieldName
   * @returns {Object} { valid: boolean, message: string }
   */
  validateSelect(value, fieldName) {
    if (!value || value === '') {
      return {
        valid: false,
        message: `Please select a ${fieldName}.`
      };
    }
    return { valid: true, message: '' };
  },

  /**
   * Validate numeric range
   * @param {string|number} value
   * @param {number} min
   * @param {number} max
   * @param {string} fieldName
   * @returns {Object} { valid: boolean, message: string }
   */
  validateNumericRange(value, min, max, fieldName) {
    const requiredCheck = this.validateRequired(value, fieldName);
    if (!requiredCheck.valid) {
      return requiredCheck;
    }

    const num = parseInt(value, 10);
    if (isNaN(num)) {
      return {
        valid: false,
        message: `${fieldName} must be a number.`
      };
    }

    if (num < min || num > max) {
      return {
        valid: false,
        message: `${fieldName} must be between ${min} and ${max}.`
      };
    }

    return { valid: true, message: '' };
  },

  /**
   * Validate entire form
   * @param {HTMLFormElement} form
   * @returns {Object} { valid: boolean, errors: Object }
   */
  validateForm(form) {
    const errors = {};
    let isValid = true;

    const plate = form.querySelector('#plate');
    const phone = form.querySelector('#phone');
    const status = form.querySelector('#status');
    const workload = form.querySelector('#workload');

    if (plate) {
      const plateError = this.validatePlate(plate.value);
      if (!plateError.valid) {
        errors.plate = plateError.message;
        isValid = false;
      }
    }

    if (phone) {
      const phoneError = this.validatePhone(phone.value);
      if (!phoneError.valid) {
        errors.phone = phoneError.message;
        isValid = false;
      }
    }

    if (status) {
      const statusError = this.validateSelect(status.value, 'status');
      if (!statusError.valid) {
        errors.status = statusError.message;
        isValid = false;
      }
    }

    if (workload) {
      const workloadError = this.validateSelect(workload.value, 'workload');
      if (!workloadError.valid) {
        errors.workload = workloadError.message;
        isValid = false;
      }
    }

    return {
      valid: isValid,
      errors
    };
  },

  /**
   * Display form errors
   * @param {HTMLFormElement} form
   * @param {Object} errors
   */
  displayErrors(form, errors) {
    // Clear all previous errors
    form.querySelectorAll('.form-error').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.classList.remove('error');
    });

    // Display new errors
    Object.keys(errors).forEach(fieldName => {
      const errorMessage = errors[fieldName];
      const field = form.querySelector(`#${fieldName}`);
      const errorElement = form.querySelector(`#${fieldName}-error`);

      if (field && errorElement) {
        field.classList.add('error');
        errorElement.textContent = errorMessage;
        errorElement.classList.add('show');
      }
    });
  },

  /**
   * Clear form errors
   * @param {HTMLFormElement} form
   */
  clearErrors(form) {
    form.querySelectorAll('.form-error').forEach(el => {
      el.classList.remove('show');
      el.textContent = '';
    });
    form.querySelectorAll('input, select, textarea').forEach(el => {
      el.classList.remove('error');
    });
  }
};
