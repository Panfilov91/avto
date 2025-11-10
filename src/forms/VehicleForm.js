import StorageManager from '../storage/StorageManager.js';
import FormValidationService from '../services/FormValidationService.js';

/**
 * VehicleForm - Vehicle creation and editing form
 */
class VehicleForm {
  constructor(clientId, existingVehicleId = null) {
    this.storageManager = new StorageManager();
    this.clientId = clientId;
    this.existingVehicleId = existingVehicleId;
    this.formData = this.initializeFormData();
    this.validationErrors = {};
    this.isDirty = false;
    this.listeners = new Map();

    if (existingVehicleId) {
      this.loadExistingVehicle(existingVehicleId);
    }
  }

  /**
   * Initialize form data
   */
  initializeFormData() {
    return {
      id: null,
      clientId: this.clientId,
      licensePlate: '',
      make: '',
      model: '',
      year: new Date().getFullYear(),
      color: '',
      vin: '',
      mileage: 0,
      fuelType: '',
      transmissionType: '',
      notes: '',
      createdAt: null,
      updatedAt: null,
    };
  }

  /**
   * Load existing vehicle
   */
  loadExistingVehicle(vehicleId) {
    const existingVehicle = this.storageManager.getVehicle(vehicleId);
    if (existingVehicle) {
      this.formData = { ...existingVehicle };
    }
  }

  /**
   * Set field value
   */
  setFieldValue(fieldName, value) {
    this.formData[fieldName] = value;
    this.isDirty = true;
    this.notifyListeners('fieldChanged', { fieldName, value });
  }

  /**
   * Validate form
   */
  validateForm() {
    const validation = FormValidationService.validateVehicleForm(this.formData);
    this.validationErrors = validation.errors;
    return validation;
  }

  /**
   * Save vehicle
   */
  save() {
    const validation = this.validateForm();
    if (!validation.isValid) {
      throw new Error(`Cannot save: ${Object.values(validation.errors).join(', ')}`);
    }

    try {
      const savedVehicle = this.storageManager.saveVehicle(this.formData);
      this.formData = savedVehicle;
      this.isDirty = false;
      this.notifyListeners('vehicleSaved', savedVehicle);
      return savedVehicle;
    } catch (error) {
      this.notifyListeners('saveError', { error: error.message });
      throw error;
    }
  }

  /**
   * Cancel editing
   */
  cancel() {
    if (this.existingVehicleId) {
      this.loadExistingVehicle(this.existingVehicleId);
    } else {
      this.formData = this.initializeFormData();
    }
    this.isDirty = false;
    this.validationErrors = {};
    this.notifyListeners('formCancelled', null);
  }

  /**
   * Get form data
   */
  getFormData() {
    return { ...this.formData };
  }

  /**
   * Get validation errors
   */
  getValidationErrors() {
    return { ...this.validationErrors };
  }

  /**
   * Check if form is dirty
   */
  isDirtyForm() {
    return this.isDirty;
  }

  /**
   * Add event listener
   */
  addEventListener(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  /**
   * Remove event listener
   */
  removeEventListener(eventType, callback) {
    if (this.listeners.has(eventType)) {
      const callbacks = this.listeners.get(eventType);
      const index = callbacks.indexOf(callback);
      if (index !== -1) {
        callbacks.splice(index, 1);
      }
    }
  }

  /**
   * Notify listeners
   */
  notifyListeners(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          // Silently handle listener errors
        }
      });
    }
  }
}

export default VehicleForm;
