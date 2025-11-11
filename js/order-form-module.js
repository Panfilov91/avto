const OrderFormModule = {
  serviceLines: [],

  init() {
    console.log('Initializing Order Form Module...');
    this.setupEventListeners();
    this.populateSelects();
  },

  setupEventListeners() {
    const orderForm = document.getElementById('order-entry-form');
    if (orderForm) {
      orderForm.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    const addServiceBtn = document.getElementById('add-service-line-btn');
    if (addServiceBtn) {
      addServiceBtn.addEventListener('click', () => this.openServiceLineModal());
    }

    const serviceLineForm = document.getElementById('service-line-form');
    if (serviceLineForm) {
      serviceLineForm.addEventListener('submit', (e) => this.handleServiceLineSubmit(e));
    }

    const serviceLineCancelBtn = document.getElementById('service-line-cancel-btn');
    if (serviceLineCancelBtn) {
      serviceLineCancelBtn.addEventListener('click', () => ModalManager.close('service-line-modal'));
    }

    const serviceLineServiceSelect = document.getElementById('service-line-service');
    if (serviceLineServiceSelect) {
      serviceLineServiceSelect.addEventListener('change', () => this.updateServiceLinePrice());
    }

    const orderDiscountInput = document.getElementById('order-discount');
    if (orderDiscountInput) {
      orderDiscountInput.addEventListener('input', () => this.calculateTotals());
    }

    const orderClientSelect = document.getElementById('order-client');
    if (orderClientSelect) {
      orderClientSelect.addEventListener('change', () => this.updateVehicleOptions());
    }
  },

  populateSelects() {
    const clients = StorageManager.getAllClients();
    const clientSelect = document.getElementById('order-client');
    if (clientSelect) {
      clientSelect.innerHTML = '<option value="">Select Client</option>' +
        clients.map(c => `<option value="${c.id}">${this.escapeHtml(c.name)}</option>`).join('');
    }

    this.populateServiceLineServiceSelect();
  },

  populateServiceLineServiceSelect() {
    const services = StorageManager.getAllServices();
    const serviceSelect = document.getElementById('service-line-service');
    if (serviceSelect) {
      serviceSelect.innerHTML = '<option value="">Select Service</option>' +
        services.map(s => `<option value="${s.id}" data-price="${s.basePrice}">${this.escapeHtml(s.name)} - $${s.basePrice.toFixed(2)}</option>`).join('');
    }
  },

  updateVehicleOptions() {
    const clientId = document.getElementById('order-client').value;
    const vehicleSelect = document.getElementById('order-vehicle');
    if (!vehicleSelect) return;

    if (!clientId) {
      vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>';
      return;
    }

    const vehicles = StorageManager.getVehiclesByClientId(clientId);
    vehicleSelect.innerHTML = '<option value="">Select Vehicle</option>' +
      vehicles.map(v => `<option value="${v.id}">${this.escapeHtml(v.make)} ${this.escapeHtml(v.model)} (${v.licensePlate})</option>`).join('');
  },

  openServiceLineModal() {
    this.populateServiceLineServiceSelect();
    document.getElementById('service-line-quantity').value = 1;
    document.getElementById('service-line-price').value = '';
    ModalManager.open('service-line-modal');
  },

  updateServiceLinePrice() {
    const serviceSelect = document.getElementById('service-line-service');
    const priceInput = document.getElementById('service-line-price');
    if (!serviceSelect || !priceInput) return;

    const selectedOption = serviceSelect.options[serviceSelect.selectedIndex];
    if (selectedOption && selectedOption.dataset.price) {
      priceInput.value = parseFloat(selectedOption.dataset.price).toFixed(2);
    }
  },

  handleServiceLineSubmit(e) {
    e.preventDefault();
    
    const serviceId = document.getElementById('service-line-service').value;
    const quantity = parseInt(document.getElementById('service-line-quantity').value);
    const price = parseFloat(document.getElementById('service-line-price').value);

    if (!serviceId) {
      Notification.show('Please select a service', 'error');
      return;
    }

    const service = StorageManager.getServiceById(serviceId);
    if (!service) return;

    this.serviceLines.push({
      serviceId,
      serviceName: service.name,
      quantity,
      unitPrice: price,
      total: quantity * price
    });

    this.renderServiceLines();
    this.calculateTotals();
    ModalManager.close('service-line-modal');
  },

  renderServiceLines() {
    const container = document.getElementById('order-services-list');
    if (!container) return;

    if (this.serviceLines.length === 0) {
      container.innerHTML = '<p class="empty-message">No services added yet.</p>';
      return;
    }

    container.innerHTML = this.serviceLines.map((line, index) => `
      <div class="service-line-item">
        <div class="service-line-info">
          <strong>${this.escapeHtml(line.serviceName)}</strong>
          <span>Qty: ${line.quantity} × $${line.unitPrice.toFixed(2)} = $${line.total.toFixed(2)}</span>
        </div>
        <button type="button" class="btn btn-sm btn-danger" onclick="OrderFormModule.removeServiceLine(${index})">Remove</button>
      </div>
    `).join('');
  },

  removeServiceLine(index) {
    this.serviceLines.splice(index, 1);
    this.renderServiceLines();
    this.calculateTotals();
  },

  calculateTotals() {
    const subtotal = this.serviceLines.reduce((sum, line) => sum + line.total, 0);
    const discountPercent = parseFloat(document.getElementById('order-discount').value) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const vat = subtotalAfterDiscount * 0.2;
    const total = subtotalAfterDiscount + vat;

    document.getElementById('order-subtotal').textContent = subtotal.toFixed(2);
    document.getElementById('order-discount-amount').textContent = discountAmount.toFixed(2);
    document.getElementById('order-subtotal-after-discount').textContent = subtotalAfterDiscount.toFixed(2);
    document.getElementById('order-vat').textContent = vat.toFixed(2);
    document.getElementById('order-total').textContent = total.toFixed(2);
  },

  handleSubmit(e) {
    e.preventDefault();

    const clientId = document.getElementById('order-client').value;
    const vehicleId = document.getElementById('order-vehicle').value;
    const scheduledDate = document.getElementById('order-date').value;
    const liftReference = document.getElementById('order-lift').value;
    const notes = document.getElementById('order-notes').value;

    if (!clientId || !vehicleId || !scheduledDate) {
      Notification.show('Please fill in all required fields', 'error');
      return;
    }

    if (this.serviceLines.length === 0) {
      Notification.show('Please add at least one service', 'error');
      return;
    }

    const subtotal = this.serviceLines.reduce((sum, line) => sum + line.total, 0);
    const discountPercent = parseFloat(document.getElementById('order-discount').value) || 0;
    const discountAmount = subtotal * (discountPercent / 100);
    const subtotalAfterDiscount = subtotal - discountAmount;
    const vat = subtotalAfterDiscount * 0.2;
    const total = subtotalAfterDiscount + vat;

    const orderData = {
      clientId,
      vehicleId,
      scheduledDate,
      liftReference,
      notes,
      serviceIds: this.serviceLines.map(l => l.serviceId),
      lineItems: this.serviceLines,
      subtotal,
      discount: discountAmount,
      vat,
      totalAmount: total,
      status: 'draft'
    };

    StorageManager.addOrder(orderData);
    Notification.show('Order created successfully!', 'success');
    
    e.target.reset();
    this.serviceLines = [];
    this.renderServiceLines();
    this.calculateTotals();
    this.populateSelects();
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

if (typeof window !== 'undefined') {
  window.OrderFormModule = OrderFormModule;
}
