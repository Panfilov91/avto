import StorageManager from '../storage/StorageManager.js';
import OrderCalculationService from '../services/OrderCalculationService.js';
import FormValidationService from '../services/FormValidationService.js';

/**
 * OrderForm - Comprehensive order creation/editing interface
 */
class OrderForm {
  constructor(existingOrderId = null) {
    this.storageManager = new StorageManager();
    this.existingOrderId = existingOrderId;
    this.formData = this.initializeFormData();
    this.validationErrors = {};
    this.isDirty = false;
    this.listeners = new Map();

    // Load existing order if editing
    if (existingOrderId) {
      this.loadExistingOrder(existingOrderId);
    }
  }

  /**
   * Initialize form data structure
   */
  initializeFormData() {
    return {
      // Order metadata
      id: null,
      number: null,
      status: 'draft', // draft, scheduled, in-progress, completed
      createdAt: null,
      updatedAt: null,

      // Client & Vehicle
      clientId: null,
      client: null,
      vehicleId: null,
      vehicle: null,
      liftReference: null,

      // Line items
      lineItems: [], // Service line items with quantity, unitPrice, discounts
      laborEntries: [], // Labor entries with hours and rates
      partEntries: [], // Parts entries

      // Scheduling
      plannedStartDate: null,
      plannedEndDate: null,
      completionDate: null,

      // Mechanic assignment
      mechanicId: null,
      mechanicName: null,

      // Notes
      notes: null,
      internalNotes: null,

      // Discount
      manualDiscount: 0,
      discountPercent: 0,

      // Totals (calculated)
      subtotal: 0,
      discount: 0,
      subtotalAfterDiscount: 0,
      vat: 0,
      grandTotal: 0,
    };
  }

  /**
   * Load existing order for editing
   */
  loadExistingOrder(orderId) {
    const existingOrder = this.storageManager.getOrder(orderId);
    if (existingOrder) {
      // Deep copy to avoid mutating storage data
      this.formData = {
        ...existingOrder,
        lineItems: existingOrder.lineItems ? [...existingOrder.lineItems] : [],
        laborEntries: existingOrder.laborEntries ? [...existingOrder.laborEntries] : [],
        partEntries: existingOrder.partEntries ? [...existingOrder.partEntries] : [],
      };
      this.formData.client = this.storageManager.getClient(existingOrder.clientId);
      this.formData.vehicle = this.storageManager.getVehicle(existingOrder.vehicleId);
      this.recalculateTotals();
    }
  }

  /**
   * Set form field value and mark as dirty
   */
  setFieldValue(fieldName, value) {
    // Special handling for nested fields
    if (fieldName.includes('.')) {
      const [parent, child] = fieldName.split('.');
      if (this.formData[parent]) {
        this.formData[parent][child] = value;
      }
    } else {
      this.formData[fieldName] = value;
    }

    this.isDirty = true;

    // Recalculate totals if this affects pricing
    if (['lineItems', 'laborEntries', 'partEntries', 'clientId', 'manualDiscount', 'discountPercent'].includes(fieldName)) {
      this.recalculateTotals();
    }

    this.notifyListeners('fieldChanged', { fieldName, value });
  }

  /**
   * Set client
   */
  setClient(clientId) {
    const client = this.storageManager.getClient(clientId);
    if (client) {
      this.formData.clientId = clientId;
      this.formData.client = client;
      this.isDirty = true;
      this.recalculateTotals();
      this.notifyListeners('clientChanged', client);
    }
  }

  /**
   * Add or update line item
   */
  addLineItem(serviceId, quantity, unitPrice, itemDiscount = 0) {
    const service = this.storageManager.getService(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    const lineItem = {
      id: `item-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      serviceId,
      serviceName: service.name,
      quantity,
      unitPrice: unitPrice || service.unitPrice,
      discount: itemDiscount,
      total: quantity * (unitPrice || service.unitPrice),
    };

    // Validate line item
    const validation = FormValidationService.validateLineItem(lineItem);
    if (!validation.isValid) {
      throw new Error(`Invalid line item: ${validation.errors.join(', ')}`);
    }

    this.formData.lineItems.push(lineItem);
    this.isDirty = true;
    this.recalculateTotals();
    this.notifyListeners('lineItemAdded', lineItem);
    return lineItem;
  }

  /**
   * Update line item
   */
  updateLineItem(itemId, updates) {
    const index = this.formData.lineItems.findIndex(item => item.id === itemId);
    if (index === -1) {
      throw new Error(`Line item ${itemId} not found`);
    }

    const lineItem = { ...this.formData.lineItems[index], ...updates };
    lineItem.total = lineItem.quantity * lineItem.unitPrice;

    // Validate
    const validation = FormValidationService.validateLineItem(lineItem);
    if (!validation.isValid) {
      throw new Error(`Invalid line item: ${validation.errors.join(', ')}`);
    }

    this.formData.lineItems[index] = lineItem;
    this.isDirty = true;
    this.recalculateTotals();
    this.notifyListeners('lineItemUpdated', lineItem);
  }

  /**
   * Remove line item
   */
  removeLineItem(itemId) {
    const index = this.formData.lineItems.findIndex(item => item.id === itemId);
    if (index !== -1) {
      const removed = this.formData.lineItems.splice(index, 1)[0];
      this.isDirty = true;
      this.recalculateTotals();
      this.notifyListeners('lineItemRemoved', removed);
    }
  }

  /**
   * Add labor entry
   */
  addLaborEntry(description, hours, hourlyRate) {
    const labor = {
      id: `labor-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      description,
      hours,
      hourlyRate,
      total: hours * hourlyRate,
    };

    // Validate
    const validation = FormValidationService.validateLaborEntry(labor);
    if (!validation.isValid) {
      throw new Error(`Invalid labor entry: ${Object.values(validation.errors).join(', ')}`);
    }

    this.formData.laborEntries.push(labor);
    this.isDirty = true;
    this.recalculateTotals();
    this.notifyListeners('laborEntryAdded', labor);
    return labor;
  }

  /**
   * Update labor entry
   */
  updateLaborEntry(laborId, updates) {
    const index = this.formData.laborEntries.findIndex(labor => labor.id === laborId);
    if (index === -1) {
      throw new Error(`Labor entry ${laborId} not found`);
    }

    const labor = { ...this.formData.laborEntries[index], ...updates };
    labor.total = labor.hours * labor.hourlyRate;

    // Validate
    const validation = FormValidationService.validateLaborEntry(labor);
    if (!validation.isValid) {
      throw new Error(`Invalid labor entry: ${Object.values(validation.errors).join(', ')}`);
    }

    this.formData.laborEntries[index] = labor;
    this.isDirty = true;
    this.recalculateTotals();
    this.notifyListeners('laborEntryUpdated', labor);
  }

  /**
   * Remove labor entry
   */
  removeLaborEntry(laborId) {
    const index = this.formData.laborEntries.findIndex(labor => labor.id === laborId);
    if (index !== -1) {
      const removed = this.formData.laborEntries.splice(index, 1)[0];
      this.isDirty = true;
      this.recalculateTotals();
      this.notifyListeners('laborEntryRemoved', removed);
    }
  }

  /**
   * Add part entry
   */
  addPartEntry(partName, quantity, unitPrice) {
    const part = {
      id: `part-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      partName,
      quantity,
      unitPrice,
      total: quantity * unitPrice,
    };

    this.formData.partEntries.push(part);
    this.isDirty = true;
    this.recalculateTotals();
    this.notifyListeners('partEntryAdded', part);
    return part;
  }

  /**
   * Update part entry
   */
  updatePartEntry(partId, updates) {
    const index = this.formData.partEntries.findIndex(part => part.id === partId);
    if (index === -1) {
      throw new Error(`Part entry ${partId} not found`);
    }

    const part = { ...this.formData.partEntries[index], ...updates };
    part.total = part.quantity * part.unitPrice;

    this.formData.partEntries[index] = part;
    this.isDirty = true;
    this.recalculateTotals();
    this.notifyListeners('partEntryUpdated', part);
  }

  /**
   * Remove part entry
   */
  removePartEntry(partId) {
    const index = this.formData.partEntries.findIndex(part => part.id === partId);
    if (index !== -1) {
      const removed = this.formData.partEntries.splice(index, 1)[0];
      this.isDirty = true;
      this.recalculateTotals();
      this.notifyListeners('partEntryRemoved', removed);
    }
  }

  /**
   * Recalculate order totals
   */
  recalculateTotals() {
    // Combine all line items for calculation
    const allItems = [
      ...this.formData.lineItems,
      ...this.formData.laborEntries.map(l => ({ quantity: l.hours, unitPrice: l.hourlyRate })),
      ...this.formData.partEntries.map(p => ({ quantity: p.quantity, unitPrice: p.unitPrice })),
    ];

    const totals = OrderCalculationService.calculateTotals(
      this.formData,
      allItems,
      this.formData.client
    );

    this.formData.subtotal = totals.subtotal;
    this.formData.discount = totals.discount;
    this.formData.subtotalAfterDiscount = totals.subtotalAfterDiscount;
    this.formData.vat = totals.vat;
    this.formData.grandTotal = totals.grandTotal;
    this.formData.discountPercent = totals.discountPercent;

    this.notifyListeners('totalsChanged', totals);
  }

  /**
   * Validate form for saving
   */
  validateForm() {
    const validation = FormValidationService.validateOrderForm(this.formData);
    this.validationErrors = validation.errors;
    return validation;
  }

  /**
   * Save as draft
   */
  saveDraft() {
    this.formData.status = 'draft';
    return this.save();
  }

  /**
   * Finalize order
   */
  finalize() {
    const validation = this.validateForm();
    if (!validation.isValid) {
      throw new Error(`Cannot finalize: ${Object.values(validation.errors).join(', ')}`);
    }

    this.formData.status = 'scheduled';
    return this.save();
  }

  /**
   * Save order
   */
  save() {
    try {
      const orderData = {
        ...this.formData,
        client: this.formData.clientId ? this.storageManager.getClient(this.formData.clientId) : null,
        vehicle: this.formData.vehicleId ? this.storageManager.getVehicle(this.formData.vehicleId) : null,
      };

      const savedOrder = this.storageManager.saveOrder(orderData);
      this.formData = savedOrder;
      this.isDirty = false;
      this.notifyListeners('orderSaved', savedOrder);
      return savedOrder;
    } catch (error) {
      this.notifyListeners('saveError', { error: error.message });
      throw error;
    }
  }

  /**
   * Cancel editing
   */
  cancel() {
    if (this.existingOrderId) {
      this.loadExistingOrder(this.existingOrderId);
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
   * Get line items
   */
  getLineItems() {
    return [...this.formData.lineItems];
  }

  /**
   * Get labor entries
   */
  getLaborEntries() {
    return [...this.formData.laborEntries];
  }

  /**
   * Get part entries
   */
  getPartEntries() {
    return [...this.formData.partEntries];
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
   * Get all clients
   */
  getClients() {
    return this.storageManager.getAllClients();
  }

  /**
   * Get all vehicles
   */
  getVehicles() {
    return this.storageManager.getAllVehicles();
  }

  /**
   * Get vehicles for current client
   */
  getVehiclesForCurrentClient() {
    if (!this.formData.clientId) {
      return [];
    }
    return this.storageManager.getVehiclesByClient(this.formData.clientId);
  }

  /**
   * Get all services
   */
  getServices() {
    return this.storageManager.getAllServices();
  }

  /**
   * Add listener for form changes
   */
  addEventListener(eventType, callback) {
    if (!this.listeners.has(eventType)) {
      this.listeners.set(eventType, []);
    }
    this.listeners.get(eventType).push(callback);
  }

  /**
   * Remove listener
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
   * Notify listeners of changes
   */
  notifyListeners(eventType, data) {
    if (this.listeners.has(eventType)) {
      this.listeners.get(eventType).forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          // Silently handle listener errors to avoid console pollution
        }
      });
    }
  }
}

export default OrderForm;
