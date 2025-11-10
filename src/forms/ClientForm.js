import StorageManager from '../storage/StorageManager.js';
import FormValidationService from '../services/FormValidationService.js';

/**
 * ClientForm - Client creation and editing form
 */
class ClientForm {
  constructor(existingClientId = null) {
    this.storageManager = new StorageManager();
    this.existingClientId = existingClientId;
    this.formData = this.initializeFormData();
    this.validationErrors = {};
    this.isDirty = false;
    this.listeners = new Map();

    if (existingClientId) {
      this.loadExistingClient(existingClientId);
    }
  }

  /**
   * Initialize form data
   */
  initializeFormData() {
    return {
      id: null,
      name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      isOwn: false,
      notes: '',
      createdAt: null,
      updatedAt: null,
    };
  }

  /**
   * Load existing client
   */
  loadExistingClient(clientId) {
    const existingClient = this.storageManager.getClient(clientId);
    if (existingClient) {
      this.formData = { ...existingClient };
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
    const validation = FormValidationService.validateClientForm(this.formData);
    this.validationErrors = validation.errors;
    return validation;
  }

  /**
   * Save client
   */
  save() {
    const validation = this.validateForm();
    if (!validation.isValid) {
      throw new Error(`Cannot save: ${Object.values(validation.errors).join(', ')}`);
    }

    try {
      const savedClient = this.storageManager.saveClient(this.formData);
      this.formData = savedClient;
      this.isDirty = false;
      this.notifyListeners('clientSaved', savedClient);
      return savedClient;
    } catch (error) {
      this.notifyListeners('saveError', { error: error.message });
      throw error;
    }
  }

  /**
   * Cancel editing
   */
  cancel() {
    if (this.existingClientId) {
      this.loadExistingClient(this.existingClientId);
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

export default ClientForm;
