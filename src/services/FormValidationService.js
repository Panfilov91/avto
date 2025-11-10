/**
 * FormValidationService - Handles form validation
 */
class FormValidationService {
  /**
   * Validate order form
   */
  static validateOrderForm(formData) {
    const errors = {};

    // Client validation
    if (!formData.clientId) {
      errors.clientId = 'Client selection is required';
    }

    // Vehicle validation
    if (!formData.vehicleId) {
      errors.vehicleId = 'Vehicle selection is required';
    }

    // Status validation
    if (!formData.status) {
      errors.status = 'Status is required';
    }

    // Mechanic assignment validation (required for non-draft status)
    if (formData.status && formData.status !== 'draft' && !formData.mechanicId) {
      errors.mechanicId = 'Mechanic assignment is required for this status';
    }

    // Planned dates validation
    if (formData.status === 'scheduled' && !formData.plannedStartDate) {
      errors.plannedStartDate = 'Planned start date is required for scheduled orders';
    }

    // At least one line item is required (for non-draft orders)
    if (formData.status !== 'draft' && (!formData.lineItems || formData.lineItems.length === 0)) {
      errors.lineItems = 'At least one service line item is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate client form
   */
  static validateClientForm(clientData) {
    const errors = {};

    if (!clientData.name || clientData.name.trim() === '') {
      errors.name = 'Client name is required';
    }

    if (!clientData.email || clientData.email.trim() === '') {
      errors.email = 'Email is required';
    } else if (!this.isValidEmail(clientData.email)) {
      errors.email = 'Email format is invalid';
    }

    if (!clientData.phone || clientData.phone.trim() === '') {
      errors.phone = 'Phone number is required';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate vehicle form
   */
  static validateVehicleForm(vehicleData) {
    const errors = {};

    if (!vehicleData.licensePlate || vehicleData.licensePlate.trim() === '') {
      errors.licensePlate = 'License plate is required';
    }

    if (!vehicleData.make || vehicleData.make.trim() === '') {
      errors.make = 'Make is required';
    }

    if (!vehicleData.model || vehicleData.model.trim() === '') {
      errors.model = 'Model is required';
    }

    if (!vehicleData.year || vehicleData.year < 1900 || vehicleData.year > new Date().getFullYear() + 1) {
      errors.year = 'Year is required and must be valid';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }

  /**
   * Validate email format
   */
  static isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  /**
   * Validate line item
   */
  static validateLineItem(item) {
    const errors = [];

    if (!item.serviceId) {
      errors.push('Service is required');
    }

    if (!item.quantity || item.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (!item.unitPrice || item.unitPrice < 0) {
      errors.push('Unit price must be non-negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Validate labor entry
   */
  static validateLaborEntry(labor) {
    const errors = {};

    if (!labor.description || labor.description.trim() === '') {
      errors.description = 'Labor description is required';
    }

    if (!labor.hours || labor.hours <= 0) {
      errors.hours = 'Hours must be greater than 0';
    }

    if (!labor.hourlyRate || labor.hourlyRate < 0) {
      errors.hourlyRate = 'Hourly rate must be non-negative';
    }

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  }
}

export default FormValidationService;
