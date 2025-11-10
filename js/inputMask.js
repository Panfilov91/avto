/**
 * Input Mask Module
 * Provides vanilla JavaScript input masks for phone numbers and vehicle plates
 */

const InputMask = {
  /**
   * Apply phone number mask: +7 (XXX) XXX-XX-XX
   * @param {HTMLInputElement} input
   */
  applyPhoneMask(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.replace(/\D/g, '');

      // Ensure starts with 7
      if (value && !value.startsWith('7')) {
        value = '7' + value;
      }

      // Limit to 11 digits (7 + 10 digits)
      value = value.substring(0, 11);

      // Format
      let formatted = '';
      if (value.length > 0) {
        formatted = '+' + value.charAt(0);
      }
      if (value.length > 1) {
        formatted += ' (' + value.substring(1, 4);
      }
      if (value.length > 4) {
        formatted += ') ' + value.substring(4, 7);
      }
      if (value.length > 7) {
        formatted += '-' + value.substring(7, 9);
      }
      if (value.length > 9) {
        formatted += '-' + value.substring(9, 11);
      }

      e.target.value = formatted;
    });
  },

  /**
   * Apply vehicle plate mask: A000AA00
   * Format: Letter, 3 digits, 2 letters, 2 digits
   * @param {HTMLInputElement} input
   */
  applyPlateMask(input) {
    input.addEventListener('input', (e) => {
      let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '');

      let formatted = '';
      let charIndex = 0;
      const pattern = ['L', 'D', 'D', 'D', 'L', 'L', 'D', 'D'];

      for (let i = 0; i < pattern.length && charIndex < value.length; i++) {
        const patternChar = pattern[i];
        const inputChar = value[charIndex];

        if (patternChar === 'L' && /[A-Z]/.test(inputChar)) {
          formatted += inputChar;
          charIndex++;
        } else if (patternChar === 'D' && /[0-9]/.test(inputChar)) {
          formatted += inputChar;
          charIndex++;
        } else if (patternChar === 'L' && /[0-9]/.test(inputChar)) {
          // User entered a digit when a letter was expected, skip it
          continue;
        } else if (patternChar === 'D' && /[A-Z]/.test(inputChar)) {
          // User entered a letter when a digit was expected, skip it
          continue;
        }
      }

      e.target.value = formatted;
    });

    // Add validation to ensure correct format on blur
    input.addEventListener('blur', (e) => {
      const value = e.target.value;
      if (value && !InputMask.isValidPlate(value)) {
        // Don't clear, just leave it as is - validation will catch it
      }
    });
  },

  /**
   * Check if phone number is valid
   * Valid: +7 (XXX) XXX-XX-XX where X is digit
   * @param {string} phone
   * @returns {boolean}
   */
  isValidPhone(phone) {
    const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;
    return phonePattern.test(phone);
  },

  /**
   * Extract raw phone number (digits only)
   * @param {string} phone
   * @returns {string}
   */
  getRawPhone(phone) {
    return phone.replace(/\D/g, '');
  },

  /**
   * Check if plate is valid
   * Valid: A000AA00 (Letter, 3 digits, 2 letters, 2 digits)
   * @param {string} plate
   * @returns {boolean}
   */
  isValidPlate(plate) {
    const platePattern = /^[A-Z]\d{3}[A-Z]{2}\d{2}$/;
    return platePattern.test(plate);
  },

  /**
   * Format a phone number into masked format
   * @param {string} rawPhone - Raw phone number (digits only or with +)
   * @returns {string}
   */
  formatPhone(rawPhone) {
    let value = rawPhone.replace(/\D/g, '');

    if (!value.startsWith('7')) {
      value = '7' + value;
    }

    value = value.substring(0, 11);

    let formatted = '';
    if (value.length > 0) {
      formatted = '+' + value.charAt(0);
    }
    if (value.length > 1) {
      formatted += ' (' + value.substring(1, 4);
    }
    if (value.length > 4) {
      formatted += ') ' + value.substring(4, 7);
    }
    if (value.length > 7) {
      formatted += '-' + value.substring(7, 9);
    }
    if (value.length > 9) {
      formatted += '-' + value.substring(9, 11);
    }

    return formatted;
  },

  /**
   * Format a plate to uppercase
   * @param {string} plate
   * @returns {string}
   */
  formatPlate(plate) {
    return plate.toUpperCase().replace(/[^A-Z0-9]/g, '').substring(0, 8);
  }
};
