// Storage Manager for data persistence
class StorageManager {
    constructor() {
        this.keys = {
            clients: 'directories_clients',
            vehicles: 'directories_vehicles',
            services: 'directories_services'
        };
        this.initializeData();
    }

    initializeData() {
        // Initialize with seed data if empty
        if (!this.getClients().length) {
            this.seedClients();
        }
        if (!this.getVehicles().length) {
            this.seedVehicles();
        }
        if (!this.getServices().length) {
            this.seedServices();
        }
    }

    seedClients() {
        const seedClients = [
            {
                id: this.generateId(),
                name: 'John Smith',
                phone: '555-0101',
                email: 'john.smith@email.com',
                address: '123 Main St, Anytown, USA',
                corporate: false
            },
            {
                id: this.generateId(),
                name: 'ABC Corporation',
                phone: '555-0202',
                email: 'fleet@abc-corp.com',
                address: '456 Business Ave, Corporate City, USA',
                corporate: true
            },
            {
                id: this.generateId(),
                name: 'Sarah Johnson',
                phone: '555-0303',
                email: 'sarah.j@email.com',
                address: '789 Oak Rd, Smalltown, USA',
                corporate: false
            }
        ];
        localStorage.setItem(this.keys.clients, JSON.stringify(seedClients));
    }

    seedVehicles() {
        const clients = this.getClients();
        const seedVehicles = [
            {
                id: this.generateId(),
                clientId: clients[0].id,
                make: 'Toyota',
                model: 'Camry',
                year: 2020,
                license: 'ABC-123',
                vin: '1HGBH41JXMN109186'
            },
            {
                id: this.generateId(),
                clientId: clients[1].id,
                make: 'Ford',
                model: 'Transit',
                year: 2019,
                license: 'XYZ-789',
                vin: '2FTRX18W1XCA12345'
            },
            {
                id: this.generateId(),
                clientId: clients[0].id,
                make: 'Honda',
                model: 'Civic',
                year: 2021,
                license: 'DEF-456',
                vin: '19XFB2G58GE123456'
            }
        ];
        localStorage.setItem(this.keys.vehicles, JSON.stringify(seedVehicles));
    }

    seedServices() {
        const seedServices = [
            {
                id: this.generateId(),
                name: 'Oil Change',
                category: 'Maintenance',
                price: 39.99,
                duration: 30,
                description: 'Standard oil change with filter replacement'
            },
            {
                id: this.generateId(),
                name: 'Brake Inspection',
                category: 'Inspection',
                price: 89.99,
                duration: 45,
                description: 'Complete brake system inspection'
            },
            {
                id: this.generateId(),
                name: 'Engine Diagnostic',
                category: 'Diagnostic',
                price: 129.99,
                duration: 60,
                description: 'Comprehensive engine diagnostic scan'
            },
            {
                id: this.generateId(),
                name: 'Transmission Repair',
                category: 'Repair',
                price: 1500.00,
                duration: 480,
                description: 'Full transmission service and repair'
            },
            {
                id: this.generateId(),
                name: 'Car Detailing',
                category: 'Detailing',
                price: 199.99,
                duration: 180,
                description: 'Complete interior and exterior detailing'
            }
        ];
        localStorage.setItem(this.keys.services, JSON.stringify(seedServices));
    }

    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }

    getClients() {
        return JSON.parse(localStorage.getItem(this.keys.clients) || '[]');
    }

    getVehicles() {
        return JSON.parse(localStorage.getItem(this.keys.vehicles) || '[]');
    }

    getServices() {
        return JSON.parse(localStorage.getItem(this.keys.services) || '[]');
    }

    saveClients(clients) {
        localStorage.setItem(this.keys.clients, JSON.stringify(clients));
    }

    saveVehicles(vehicles) {
        localStorage.setItem(this.keys.vehicles, JSON.stringify(vehicles));
    }

    saveServices(services) {
        localStorage.setItem(this.keys.services, JSON.stringify(services));
    }
}

// Toast notification system
class ToastManager {
    static show(message, type = 'success', title = '') {
        const container = document.getElementById('toast-container');
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        
        const toastTitle = title ? `<div class="toast-title">${title}</div>` : '';
        toast.innerHTML = `
            ${toastTitle}
            <div class="toast-message">${message}</div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.style.animation = 'slideIn 0.3s ease reverse';
            setTimeout(() => {
                container.removeChild(toast);
            }, 300);
        }, 3000);
    }
}

// Form validation
class Validator {
    static validateClient(formData) {
        const errors = {};
        
        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = 'Name must be at least 2 characters long';
        }
        
        if (!formData.phone || !this.validatePhone(formData.phone)) {
            errors.phone = 'Please enter a valid phone number';
        }
        
        if (formData.email && !this.validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }
        
        return { isValid: Object.keys(errors).length === 0, errors };
    }

    static validateVehicle(formData) {
        const errors = {};
        
        if (!formData.clientId) {
            errors.clientId = 'Please select a client';
        }
        
        if (!formData.make || formData.make.trim().length < 2) {
            errors.make = 'Make must be at least 2 characters long';
        }
        
        if (!formData.model || formData.model.trim().length < 2) {
            errors.model = 'Model must be at least 2 characters long';
        }
        
        if (!formData.year || formData.year < 1900 || formData.year > new Date().getFullYear() + 1) {
            errors.year = 'Please enter a valid year';
        }
        
        if (!formData.license || formData.license.trim().length < 2) {
            errors.license = 'License plate is required';
        }
        
        return { isValid: Object.keys(errors).length === 0, errors };
    }

    static validateService(formData) {
        const errors = {};
        
        if (!formData.name || formData.name.trim().length < 2) {
            errors.name = 'Service name must be at least 2 characters long';
        }
        
        if (!formData.category) {
            errors.category = 'Please select a category';
        }
        
        if (!formData.price || formData.price < 0) {
            errors.price = 'Price must be a positive number';
        }
        
        return { isValid: Object.keys(errors).length === 0, errors };
    }

    static validatePhone(phone) {
        const phoneRegex = /^[\d\s\-\+\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    }

    static validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}

// Main Application
class DirectoriesApp {
    constructor() {
        this.storage = new StorageManager();
        this.currentEditId = null;
        this.currentEditType = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.renderClients();
        this.renderVehicles();
        this.renderServices();
        this.updateFilters();
    }

    setupEventListeners() {
        // Tab navigation
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // Form submissions
        document.getElementById('client-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleClientSubmit();
        });

        document.getElementById('vehicle-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleVehicleSubmit();
        });

        document.getElementById('service-form').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleServiceSubmit();
        });

        // Search and filter inputs
        document.getElementById('client-search').addEventListener('input', () => this.renderClients());
        document.getElementById('client-filter').addEventListener('change', () => this.renderClients());
        document.getElementById('vehicle-search').addEventListener('input', () => this.renderVehicles());
        document.getElementById('vehicle-client-filter').addEventListener('change', () => this.renderVehicles());
        document.getElementById('service-search').addEventListener('input', () => this.renderServices());
        document.getElementById('service-category-filter').addEventListener('change', () => this.renderServices());

        // Delete confirmation
        document.getElementById('confirm-delete-btn').addEventListener('click', () => {
            this.confirmDelete();
        });

        // Close modals on outside click
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal.id);
                }
            });
        });
    }

    switchTab(tabName) {
        // Update tab buttons
        document.querySelectorAll('.nav-tab').forEach(tab => {
            tab.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');

        // Update tab content
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        document.getElementById(`${tabName}-section`).classList.add('active');

        // Update filters when switching tabs
        this.updateFilters();
    }

    updateFilters() {
        // Update client filter for vehicles
        const vehicleClientFilter = document.getElementById('vehicle-client-filter');
        const clients = this.storage.getClients();
        vehicleClientFilter.innerHTML = '<option value="">All Clients</option>';
        clients.forEach(client => {
            vehicleClientFilter.innerHTML += `<option value="${client.id}">${client.name}</option>`;
        });

        // Update client select in vehicle form
        const vehicleClientSelect = document.getElementById('vehicle-client');
        vehicleClientSelect.innerHTML = '<option value="">Select Client</option>';
        clients.forEach(client => {
            vehicleClientSelect.innerHTML += `<option value="${client.id}">${client.name}</option>`;
        });

        // Update service category filter
        const serviceCategoryFilter = document.getElementById('service-category-filter');
        const services = this.storage.getServices();
        const categories = [...new Set(services.map(s => s.category))];
        serviceCategoryFilter.innerHTML = '<option value="">All Categories</option>';
        categories.forEach(category => {
            serviceCategoryFilter.innerHTML += `<option value="${category}">${category}</option>`;
        });
    }

    // Client methods
    renderClients() {
        const container = document.getElementById('clients-list');
        const clients = this.storage.getClients();
        const searchTerm = document.getElementById('client-search').value.toLowerCase();
        const filterType = document.getElementById('client-filter').value;

        let filteredClients = clients.filter(client => {
            const matchesSearch = client.name.toLowerCase().includes(searchTerm) ||
                                 client.email.toLowerCase().includes(searchTerm) ||
                                 client.phone.includes(searchTerm);
            const matchesFilter = !filterType || 
                                 (filterType === 'corporate' && client.corporate) ||
                                 (filterType === 'individual' && !client.corporate);
            return matchesSearch && matchesFilter;
        });

        if (filteredClients.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No clients found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredClients.map(client => `
            <div class="card">
                <div class="card-header">
                    <div>
                        <div class="card-title">${client.name}</div>
                        <div class="card-subtitle">${client.email}</div>
                    </div>
                    <span class="card-badge ${client.corporate ? 'badge-corporate' : 'badge-individual'}">
                        ${client.corporate ? 'Corporate' : 'Individual'}
                    </span>
                </div>
                <div class="card-body">
                    <div class="card-info">
                        <div class="info-item">
                            <span class="info-label">Phone:</span>
                            <span>${client.phone}</span>
                        </div>
                        ${client.address ? `
                        <div class="info-item">
                            <span class="info-label">Address:</span>
                            <span>${client.address}</span>
                        </div>
                        ` : ''}
                    </div>
                </div>
                <div class="card-actions">
                    <button class="btn btn-secondary btn-sm" onclick="app.editClient('${client.id}')">Edit</button>
                    <button class="btn btn-danger btn-sm" onclick="app.deleteClient('${client.id}')">Delete</button>
                </div>
            </div>
        `).join('');
    }

    editClient(id) {
        const clients = this.storage.getClients();
        const client = clients.find(c => c.id === id);
        if (!client) return;

        this.currentEditId = id;
        this.currentEditType = 'client';

        document.getElementById('client-modal-title').textContent = 'Edit Client';
        document.getElementById('client-name').value = client.name;
        document.getElementById('client-phone').value = client.phone;
        document.getElementById('client-email').value = client.email;
        document.getElementById('client-address').value = client.address;
        document.getElementById('client-corporate').checked = client.corporate;

        this.openModal('client-modal');
    }

    deleteClient(id) {
        const vehicles = this.storage.getVehicles();
        const hasVehicles = vehicles.some(v => v.clientId === id);
        
        this.currentEditId = id;
        this.currentEditType = 'client';
        
        const message = hasVehicles ? 
            'This client has associated vehicles. Deleting this client will also remove all their vehicles. Are you sure?' :
            'Are you sure you want to delete this client?';
            
        document.getElementById('delete-message').textContent = message;
        document.getElementById('delete-warning').textContent = hasVehicles ? 
            'Warning: This action cannot be undone and will affect vehicle records.' : '';
        
        this.openModal('delete-modal');
    }

    handleClientSubmit() {
        const formData = {
            name: document.getElementById('client-name').value,
            phone: document.getElementById('client-phone').value,
            email: document.getElementById('client-email').value,
            address: document.getElementById('client-address').value,
            corporate: document.getElementById('client-corporate').checked
        };

        const validation = Validator.validateClient(formData);
        if (!validation.isValid) {
            this.showFormErrors('client-form', validation.errors);
            return;
        }

        this.clearFormErrors('client-form');

        const clients = this.storage.getClients();
        
        if (this.currentEditId) {
            // Edit existing client
            const index = clients.findIndex(c => c.id === this.currentEditId);
            clients[index] = { ...formData, id: this.currentEditId };
            ToastManager.show('Client updated successfully', 'success');
        } else {
            // Add new client
            clients.push({ ...formData, id: this.storage.generateId() });
            ToastManager.show('Client added successfully', 'success');
        }

        this.storage.saveClients(clients);
        this.renderClients();
        this.closeModal('client-modal');
        this.resetClientForm();
    }

    // Vehicle methods
    renderVehicles() {
        const container = document.getElementById('vehicles-list');
        const vehicles = this.storage.getVehicles();
        const clients = this.storage.getClients();
        const searchTerm = document.getElementById('vehicle-search').value.toLowerCase();
        const clientFilter = document.getElementById('vehicle-client-filter').value;

        let filteredVehicles = vehicles.filter(vehicle => {
            const client = clients.find(c => c.id === vehicle.clientId);
            const clientName = client ? client.name.toLowerCase() : '';
            const matchesSearch = vehicle.make.toLowerCase().includes(searchTerm) ||
                                 vehicle.model.toLowerCase().includes(searchTerm) ||
                                 vehicle.license.toLowerCase().includes(searchTerm) ||
                                 clientName.includes(searchTerm);
            const matchesFilter = !clientFilter || vehicle.clientId === clientFilter;
            return matchesSearch && matchesFilter;
        });

        if (filteredVehicles.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No vehicles found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filteredVehicles.map(vehicle => {
            const client = clients.find(c => c.id === vehicle.clientId);
            return `
                <div class="card">
                    <div class="card-header">
                        <div>
                            <div class="card-title">${vehicle.year} ${vehicle.make} ${vehicle.model}</div>
                            <div class="card-subtitle">${client ? client.name : 'Unknown Client'}</div>
                        </div>
                    </div>
                    <div class="card-body">
                        <div class="card-info">
                            <div class="info-item">
                                <span class="info-label">License:</span>
                                <span>${vehicle.license}</span>
                            </div>
                            ${vehicle.vin ? `
                            <div class="info-item">
                                <span class="info-label">VIN:</span>
                                <span>${vehicle.vin}</span>
                            </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-secondary btn-sm" onclick="app.editVehicle('${vehicle.id}')">Edit</button>
                        <button class="btn btn-danger btn-sm" onclick="app.deleteVehicle('${vehicle.id}')">Delete</button>
                    </div>
                </div>
            `;
        }).join('');
    }

    editVehicle(id) {
        const vehicles = this.storage.getVehicles();
        const vehicle = vehicles.find(v => v.id === id);
        if (!vehicle) return;

        this.currentEditId = id;
        this.currentEditType = 'vehicle';

        document.getElementById('vehicle-modal-title').textContent = 'Edit Vehicle';
        document.getElementById('vehicle-client').value = vehicle.clientId;
        document.getElementById('vehicle-make').value = vehicle.make;
        document.getElementById('vehicle-model').value = vehicle.model;
        document.getElementById('vehicle-year').value = vehicle.year;
        document.getElementById('vehicle-license').value = vehicle.license;
        document.getElementById('vehicle-vin').value = vehicle.vin || '';

        this.openModal('vehicle-modal');
    }

    deleteVehicle(id) {
        this.currentEditId = id;
        this.currentEditType = 'vehicle';
        
        document.getElementById('delete-message').textContent = 'Are you sure you want to delete this vehicle?';
        document.getElementById('delete-warning').textContent = '';
        
        this.openModal('delete-modal');
    }

    handleVehicleSubmit() {
        const formData = {
            clientId: document.getElementById('vehicle-client').value,
            make: document.getElementById('vehicle-make').value,
            model: document.getElementById('vehicle-model').value,
            year: parseInt(document.getElementById('vehicle-year').value),
            license: document.getElementById('vehicle-license').value,
            vin: document.getElementById('vehicle-vin').value
        };

        const validation = Validator.validateVehicle(formData);
        if (!validation.isValid) {
            this.showFormErrors('vehicle-form', validation.errors);
            return;
        }

        this.clearFormErrors('vehicle-form');

        const vehicles = this.storage.getVehicles();
        
        if (this.currentEditId) {
            // Edit existing vehicle
            const index = vehicles.findIndex(v => v.id === this.currentEditId);
            vehicles[index] = { ...formData, id: this.currentEditId };
            ToastManager.show('Vehicle updated successfully', 'success');
        } else {
            // Add new vehicle
            vehicles.push({ ...formData, id: this.storage.generateId() });
            ToastManager.show('Vehicle added successfully', 'success');
        }

        this.storage.saveVehicles(vehicles);
        this.renderVehicles();
        this.closeModal('vehicle-modal');
        this.resetVehicleForm();
    }

    // Service methods
    renderServices() {
        const container = document.getElementById('services-list');
        const services = this.storage.getServices();
        const searchTerm = document.getElementById('service-search').value.toLowerCase();
        const categoryFilter = document.getElementById('service-category-filter').value;

        let filteredServices = services.filter(service => {
            const matchesSearch = service.name.toLowerCase().includes(searchTerm) ||
                                 service.description.toLowerCase().includes(searchTerm);
            const matchesFilter = !categoryFilter || service.category === categoryFilter;
            return matchesSearch && matchesFilter;
        });

        // Group by category
        const groupedServices = filteredServices.reduce((groups, service) => {
            if (!groups[service.category]) {
                groups[service.category] = [];
            }
            groups[service.category].push(service);
            return groups;
        }, {});

        if (filteredServices.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <h3>No services found</h3>
                    <p>Try adjusting your search or filter criteria</p>
                </div>
            `;
            return;
        }

        container.innerHTML = Object.entries(groupedServices).map(([category, categoryServices]) => `
            <div class="category-section">
                <h3 class="category-title">${category}</h3>
                <div class="cards-container">
                    ${categoryServices.map(service => `
                        <div class="card">
                            <div class="card-header">
                                <div>
                                    <div class="card-title">${service.name}</div>
                                    <div class="card-subtitle">${service.duration ? `${service.duration} minutes` : ''}</div>
                                </div>
                                <span class="card-badge badge-category">${service.category}</span>
                            </div>
                            <div class="card-body">
                                <div class="card-info">
                                    <div class="info-item">
                                        <span class="info-label">Price:</span>
                                        <span>$${service.price.toFixed(2)}</span>
                                    </div>
                                    ${service.description ? `
                                    <div class="info-item">
                                        <span class="info-label">Description:</span>
                                        <span>${service.description}</span>
                                    </div>
                                    ` : ''}
                                </div>
                            </div>
                            <div class="card-actions">
                                <button class="btn btn-secondary btn-sm" onclick="app.editService('${service.id}')">Edit</button>
                                <button class="btn btn-danger btn-sm" onclick="app.deleteService('${service.id}')">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `).join('');
    }

    editService(id) {
        const services = this.storage.getServices();
        const service = services.find(s => s.id === id);
        if (!service) return;

        this.currentEditId = id;
        this.currentEditType = 'service';

        document.getElementById('service-modal-title').textContent = 'Edit Service';
        document.getElementById('service-name').value = service.name;
        document.getElementById('service-category').value = service.category;
        document.getElementById('service-price').value = service.price;
        document.getElementById('service-duration').value = service.duration || '';
        document.getElementById('service-description').value = service.description || '';

        this.openModal('service-modal');
    }

    deleteService(id) {
        this.currentEditId = id;
        this.currentEditType = 'service';
        
        document.getElementById('delete-message').textContent = 'Are you sure you want to delete this service?';
        document.getElementById('delete-warning').textContent = '';
        
        this.openModal('delete-modal');
    }

    handleServiceSubmit() {
        const formData = {
            name: document.getElementById('service-name').value,
            category: document.getElementById('service-category').value,
            price: parseFloat(document.getElementById('service-price').value),
            duration: parseInt(document.getElementById('service-duration').value) || null,
            description: document.getElementById('service-description').value
        };

        const validation = Validator.validateService(formData);
        if (!validation.isValid) {
            this.showFormErrors('service-form', validation.errors);
            return;
        }

        this.clearFormErrors('service-form');

        const services = this.storage.getServices();
        
        if (this.currentEditId) {
            // Edit existing service
            const index = services.findIndex(s => s.id === this.currentEditId);
            services[index] = { ...formData, id: this.currentEditId };
            ToastManager.show('Service updated successfully', 'success');
        } else {
            // Add new service
            services.push({ ...formData, id: this.storage.generateId() });
            ToastManager.show('Service added successfully', 'success');
        }

        this.storage.saveServices(services);
        this.renderServices();
        this.closeModal('service-modal');
        this.resetServiceForm();
    }

    // Delete confirmation
    confirmDelete() {
        if (!this.currentEditId || !this.currentEditType) return;

        switch (this.currentEditType) {
            case 'client':
                this.deleteClientConfirmed();
                break;
            case 'vehicle':
                this.deleteVehicleConfirmed();
                break;
            case 'service':
                this.deleteServiceConfirmed();
                break;
        }

        this.closeModal('delete-modal');
    }

    deleteClientConfirmed() {
        const clients = this.storage.getClients();
        const vehicles = this.storage.getVehicles();
        
        // Remove client and their vehicles
        const filteredClients = clients.filter(c => c.id !== this.currentEditId);
        const filteredVehicles = vehicles.filter(v => v.clientId !== this.currentEditId);
        
        this.storage.saveClients(filteredClients);
        this.storage.saveVehicles(filteredVehicles);
        
        this.renderClients();
        this.renderVehicles();
        ToastManager.show('Client and associated vehicles deleted successfully', 'success');
    }

    deleteVehicleConfirmed() {
        const vehicles = this.storage.getVehicles();
        const filteredVehicles = vehicles.filter(v => v.id !== this.currentEditId);
        this.storage.saveVehicles(filteredVehicles);
        this.renderVehicles();
        ToastManager.show('Vehicle deleted successfully', 'success');
    }

    deleteServiceConfirmed() {
        const services = this.storage.getServices();
        const filteredServices = services.filter(s => s.id !== this.currentEditId);
        this.storage.saveServices(filteredServices);
        this.renderServices();
        ToastManager.show('Service deleted successfully', 'success');
    }

    // Form helpers
    showFormErrors(formId, errors) {
        const form = document.getElementById(formId);
        Object.keys(errors).forEach(field => {
            const input = form.querySelector(`[id="${field.replace('clientId', 'vehicle-client').replace('corporate', 'client-corporate')}"]`);
            if (input) {
                input.classList.add('error');
                const errorElement = input.parentElement.querySelector('.error-message');
                if (errorElement) {
                    errorElement.textContent = errors[field];
                }
            }
        });
    }

    clearFormErrors(formId) {
        const form = document.getElementById(formId);
        form.querySelectorAll('.error').forEach(input => {
            input.classList.remove('error');
        });
        form.querySelectorAll('.error-message').forEach(error => {
            error.textContent = '';
        });
    }

    resetClientForm() {
        document.getElementById('client-form').reset();
        this.currentEditId = null;
        this.currentEditType = null;
    }

    resetVehicleForm() {
        document.getElementById('vehicle-form').reset();
        this.currentEditId = null;
        this.currentEditType = null;
    }

    resetServiceForm() {
        document.getElementById('service-form').reset();
        this.currentEditId = null;
        this.currentEditType = null;
    }

    // Modal helpers
    openModal(modalId) {
        document.getElementById(modalId).classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('active');
        document.body.style.overflow = '';
    }
}

// Global functions for inline event handlers
function openClientModal() {
    app.currentEditId = null;
    app.currentEditType = null;
    document.getElementById('client-modal-title').textContent = 'Add Client';
    app.resetClientForm();
    app.openModal('client-modal');
}

function openVehicleModal() {
    app.currentEditId = null;
    app.currentEditType = null;
    document.getElementById('vehicle-modal-title').textContent = 'Add Vehicle';
    app.resetVehicleForm();
    app.openModal('vehicle-modal');
}

function openServiceModal() {
    app.currentEditId = null;
    app.currentEditType = null;
    document.getElementById('service-modal-title').textContent = 'Add Service';
    app.resetServiceForm();
    app.openModal('service-modal');
}

function closeModal(modalId) {
    app.closeModal(modalId);
}

// Initialize app when DOM is loaded
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new DirectoriesApp();
});