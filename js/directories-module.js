const DirectoriesModule = {
  currentEditId: null,
  currentEditType: null,

  init() {
    console.log('Initializing Directories Module...');
    this.setupEventListeners();
    this.render();
  },

  setupEventListeners() {
    const addClientBtn = document.getElementById('add-client-btn');
    if (addClientBtn) {
      addClientBtn.addEventListener('click', () => this.openClientModal());
    }

    const addVehicleBtn = document.getElementById('add-vehicle-btn');
    if (addVehicleBtn) {
      addVehicleBtn.addEventListener('click', () => this.openVehicleModal());
    }

    const addServiceBtn = document.getElementById('add-service-btn');
    if (addServiceBtn) {
      addServiceBtn.addEventListener('click', () => this.openServiceModal());
    }

    const clientForm = document.getElementById('client-form');
    if (clientForm) {
      clientForm.addEventListener('submit', (e) => this.handleClientSubmit(e));
    }

    const vehicleForm = document.getElementById('vehicle-form');
    if (vehicleForm) {
      vehicleForm.addEventListener('submit', (e) => this.handleVehicleSubmit(e));
    }

    const serviceForm = document.getElementById('service-form');
    if (serviceForm) {
      serviceForm.addEventListener('submit', (e) => this.handleServiceSubmit(e));
    }

    const clientSearch = document.getElementById('client-search');
    if (clientSearch) {
      clientSearch.addEventListener('input', () => this.filterClients());
    }

    const vehicleSearch = document.getElementById('vehicle-search');
    if (vehicleSearch) {
      vehicleSearch.addEventListener('input', () => this.filterVehicles());
    }

    const serviceSearch = document.getElementById('service-search');
    if (serviceSearch) {
      serviceSearch.addEventListener('input', () => this.filterServices());
    }

    const clientCancelBtn = document.getElementById('client-cancel-btn');
    if (clientCancelBtn) {
      clientCancelBtn.addEventListener('click', () => ModalManager.close('client-modal'));
    }

    const vehicleCancelBtn = document.getElementById('vehicle-cancel-btn');
    if (vehicleCancelBtn) {
      vehicleCancelBtn.addEventListener('click', () => ModalManager.close('vehicle-modal'));
    }

    const serviceCancelBtn = document.getElementById('service-cancel-btn');
    if (serviceCancelBtn) {
      serviceCancelBtn.addEventListener('click', () => ModalManager.close('service-modal'));
    }
  },

  render() {
    this.renderClients();
    this.renderVehicles();
    this.renderServices();
    this.populateVehicleClientSelect();
  },

  renderClients() {
    const clients = StorageManager.getAllClients();
    const container = document.getElementById('clients-list');
    if (!container) return;

    if (clients.length === 0) {
      container.innerHTML = '<p class="empty-message">No clients found. Add your first client to get started.</p>';
      return;
    }

    container.innerHTML = clients.map(client => `
      <div class="card" data-id="${client.id}">
        <div class="card-header">
          <h3>${this.escapeHtml(client.name)}</h3>
          <span class="badge ${client.type === 'corporate' ? 'badge-corporate' : 'badge-individual'}">
            ${client.type === 'corporate' ? 'Corporate' : 'Individual'}
          </span>
        </div>
        <div class="card-body">
          ${client.phone ? `<p><strong>Phone:</strong> ${this.escapeHtml(client.phone)}</p>` : ''}
          ${client.email ? `<p><strong>Email:</strong> ${this.escapeHtml(client.email)}</p>` : ''}
          ${client.address ? `<p><strong>Address:</strong> ${this.escapeHtml(client.address)}</p>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn btn-sm btn-secondary" onclick="DirectoriesModule.editClient('${client.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="DirectoriesModule.deleteClient('${client.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  },

  renderVehicles() {
    const vehicles = StorageManager.getAllVehicles();
    const clients = StorageManager.getAllClients();
    const container = document.getElementById('vehicles-list');
    if (!container) return;

    if (vehicles.length === 0) {
      container.innerHTML = '<p class="empty-message">No vehicles found. Add your first vehicle to get started.</p>';
      return;
    }

    container.innerHTML = vehicles.map(vehicle => {
      const client = clients.find(c => c.id === vehicle.clientId);
      const clientName = client ? client.name : 'Unknown Client';

      return `
        <div class="card" data-id="${vehicle.id}">
          <div class="card-header">
            <h3>${this.escapeHtml(vehicle.make)} ${this.escapeHtml(vehicle.model)}</h3>
            <span class="badge badge-info">${vehicle.year}</span>
          </div>
          <div class="card-body">
            <p><strong>Client:</strong> ${this.escapeHtml(clientName)}</p>
            <p><strong>License Plate:</strong> ${this.escapeHtml(vehicle.licensePlate)}</p>
            ${vehicle.vin ? `<p><strong>VIN:</strong> ${this.escapeHtml(vehicle.vin)}</p>` : ''}
            ${vehicle.color ? `<p><strong>Color:</strong> ${this.escapeHtml(vehicle.color)}</p>` : ''}
          </div>
          <div class="card-actions">
            <button class="btn btn-sm btn-secondary" onclick="DirectoriesModule.editVehicle('${vehicle.id}')">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="DirectoriesModule.deleteVehicle('${vehicle.id}')">Delete</button>
          </div>
        </div>
      `;
    }).join('');
  },

  renderServices() {
    const services = StorageManager.getAllServices();
    const container = document.getElementById('services-list');
    if (!container) return;

    if (services.length === 0) {
      container.innerHTML = '<p class="empty-message">No services found. Add your first service to get started.</p>';
      return;
    }

    container.innerHTML = services.map(service => `
      <div class="card" data-id="${service.id}">
        <div class="card-header">
          <h3>${this.escapeHtml(service.name)}</h3>
          <span class="badge badge-category">${this.escapeHtml(service.category)}</span>
        </div>
        <div class="card-body">
          <p><strong>Price:</strong> $${service.basePrice.toFixed(2)}</p>
          ${service.duration ? `<p><strong>Duration:</strong> ${service.duration} min</p>` : ''}
          ${service.description ? `<p>${this.escapeHtml(service.description)}</p>` : ''}
        </div>
        <div class="card-actions">
          <button class="btn btn-sm btn-secondary" onclick="DirectoriesModule.editService('${service.id}')">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="DirectoriesModule.deleteService('${service.id}')">Delete</button>
        </div>
      </div>
    `).join('');
  },

  openClientModal() {
    this.currentEditId = null;
    document.getElementById('client-modal-title').textContent = 'Add Client';
    document.getElementById('client-form').reset();
    ModalManager.open('client-modal');
  },

  openVehicleModal() {
    this.currentEditId = null;
    document.getElementById('vehicle-modal-title').textContent = 'Add Vehicle';
    document.getElementById('vehicle-form').reset();
    this.populateVehicleClientSelect();
    ModalManager.open('vehicle-modal');
  },

  openServiceModal() {
    this.currentEditId = null;
    document.getElementById('service-modal-title').textContent = 'Add Service';
    document.getElementById('service-form').reset();
    ModalManager.open('service-modal');
  },

  handleClientSubmit(e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById('client-name').value,
      phone: document.getElementById('client-phone').value,
      email: document.getElementById('client-email').value,
      address: document.getElementById('client-address').value,
      type: document.getElementById('client-type').value
    };

    if (this.currentEditId) {
      StorageManager.updateClient(this.currentEditId, formData);
      Notification.show('Client updated successfully', 'success');
    } else {
      StorageManager.addClient(formData);
      Notification.show('Client added successfully', 'success');
    }

    ModalManager.close('client-modal');
    this.render();
  },

  handleVehicleSubmit(e) {
    e.preventDefault();
    const formData = {
      clientId: document.getElementById('vehicle-client').value,
      make: document.getElementById('vehicle-make').value,
      model: document.getElementById('vehicle-model').value,
      year: parseInt(document.getElementById('vehicle-year').value),
      licensePlate: document.getElementById('vehicle-license').value,
      vin: document.getElementById('vehicle-vin').value,
      color: document.getElementById('vehicle-color').value
    };

    if (this.currentEditId) {
      StorageManager.updateVehicle(this.currentEditId, formData);
      Notification.show('Vehicle updated successfully', 'success');
    } else {
      StorageManager.addVehicle(formData);
      Notification.show('Vehicle added successfully', 'success');
    }

    ModalManager.close('vehicle-modal');
    this.render();
  },

  handleServiceSubmit(e) {
    e.preventDefault();
    const formData = {
      name: document.getElementById('service-name').value,
      category: document.getElementById('service-category').value,
      basePrice: parseFloat(document.getElementById('service-price').value),
      duration: parseInt(document.getElementById('service-duration').value) || 60,
      description: document.getElementById('service-description').value,
      isActive: true
    };

    if (this.currentEditId) {
      StorageManager.updateService(this.currentEditId, formData);
      Notification.show('Service updated successfully', 'success');
    } else {
      StorageManager.addService(formData);
      Notification.show('Service added successfully', 'success');
    }

    ModalManager.close('service-modal');
    this.render();
  },

  editClient(id) {
    const client = StorageManager.getClientById(id);
    if (!client) return;

    this.currentEditId = id;
    document.getElementById('client-modal-title').textContent = 'Edit Client';
    document.getElementById('client-name').value = client.name;
    document.getElementById('client-phone').value = client.phone || '';
    document.getElementById('client-email').value = client.email || '';
    document.getElementById('client-address').value = client.address || '';
    document.getElementById('client-type').value = client.type;
    ModalManager.open('client-modal');
  },

  editVehicle(id) {
    const vehicle = StorageManager.getVehicleById(id);
    if (!vehicle) return;

    this.currentEditId = id;
    document.getElementById('vehicle-modal-title').textContent = 'Edit Vehicle';
    this.populateVehicleClientSelect();
    document.getElementById('vehicle-client').value = vehicle.clientId;
    document.getElementById('vehicle-make').value = vehicle.make;
    document.getElementById('vehicle-model').value = vehicle.model;
    document.getElementById('vehicle-year').value = vehicle.year;
    document.getElementById('vehicle-license').value = vehicle.licensePlate;
    document.getElementById('vehicle-vin').value = vehicle.vin || '';
    document.getElementById('vehicle-color').value = vehicle.color || '';
    ModalManager.open('vehicle-modal');
  },

  editService(id) {
    const service = StorageManager.getServiceById(id);
    if (!service) return;

    this.currentEditId = id;
    document.getElementById('service-modal-title').textContent = 'Edit Service';
    document.getElementById('service-name').value = service.name;
    document.getElementById('service-category').value = service.category;
    document.getElementById('service-price').value = service.basePrice;
    document.getElementById('service-duration').value = service.duration || 60;
    document.getElementById('service-description').value = service.description || '';
    ModalManager.open('service-modal');
  },

  deleteClient(id) {
    Confirmation.show(
      'Delete Client',
      'Are you sure you want to delete this client? This action cannot be undone.',
      () => {
        StorageManager.deleteClient(id);
        Notification.show('Client deleted successfully', 'success');
        this.render();
      }
    );
  },

  deleteVehicle(id) {
    Confirmation.show(
      'Delete Vehicle',
      'Are you sure you want to delete this vehicle? This action cannot be undone.',
      () => {
        StorageManager.deleteVehicle(id);
        Notification.show('Vehicle deleted successfully', 'success');
        this.render();
      }
    );
  },

  deleteService(id) {
    Confirmation.show(
      'Delete Service',
      'Are you sure you want to delete this service? This action cannot be undone.',
      () => {
        StorageManager.deleteService(id);
        Notification.show('Service deleted successfully', 'success');
        this.render();
      }
    );
  },

  filterClients() {
    const searchTerm = document.getElementById('client-search').value.toLowerCase();
    const cards = document.querySelectorAll('#clients-list .card');
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
  },

  filterVehicles() {
    const searchTerm = document.getElementById('vehicle-search').value.toLowerCase();
    const cards = document.querySelectorAll('#vehicles-list .card');
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
  },

  filterServices() {
    const searchTerm = document.getElementById('service-search').value.toLowerCase();
    const cards = document.querySelectorAll('#services-list .card');
    
    cards.forEach(card => {
      const text = card.textContent.toLowerCase();
      card.style.display = text.includes(searchTerm) ? 'block' : 'none';
    });
  },

  populateVehicleClientSelect() {
    const clients = StorageManager.getAllClients();
    const select = document.getElementById('vehicle-client');
    if (!select) return;

    const currentValue = select.value;
    select.innerHTML = '<option value="">Select Client</option>' +
      clients.map(client => `<option value="${client.id}">${this.escapeHtml(client.name)}</option>`).join('');
    
    if (currentValue) {
      select.value = currentValue;
    }
  },

  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
};

if (typeof window !== 'undefined') {
  window.DirectoriesModule = DirectoriesModule;
}
