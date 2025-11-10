/**
 * StorageManager - Handles persistent data storage for orders and related entities
 */
class StorageManager {
  static instance = null;

  constructor() {
    // Implement singleton pattern to ensure data persistence across instances
    if (StorageManager.instance) {
      return StorageManager.instance;
    }

    this.orders = new Map();
    this.clients = new Map();
    this.vehicles = new Map();
    this.serviceCatalog = new Map();
    this.nextOrderNumber = 1;
    this.loadFromStorage();

    StorageManager.instance = this;
  }

  /**
   * Load data from persistent storage (localStorage or file system)
   */
  loadFromStorage() {
    // In a real implementation, this would load from localStorage or a database
    // For now, we initialize with empty data
    this.initializeDefaultData();
  }

  /**
   * Initialize with default data
   */
  initializeDefaultData() {
    // Initialize service catalog with sample services
    const defaultServices = [
      { id: 'oil-change', name: 'Oil Change', unitPrice: 50, category: 'maintenance' },
      { id: 'brake-pads', name: 'Brake Pads Replacement', unitPrice: 150, category: 'maintenance' },
      { id: 'tire-rotation', name: 'Tire Rotation', unitPrice: 75, category: 'maintenance' },
      { id: 'filter-replacement', name: 'Air Filter Replacement', unitPrice: 45, category: 'maintenance' },
      { id: 'battery-replacement', name: 'Battery Replacement', unitPrice: 200, category: 'maintenance' },
      { id: 'spark-plugs', name: 'Spark Plugs Replacement', unitPrice: 100, category: 'maintenance' },
      { id: 'coolant-flush', name: 'Coolant Flush', unitPrice: 120, category: 'maintenance' },
      { id: 'transmission-fluid', name: 'Transmission Fluid Service', unitPrice: 180, category: 'maintenance' },
    ];

    defaultServices.forEach(service => {
      this.serviceCatalog.set(service.id, service);
    });

    // Initialize with a few default clients
    const defaultClients = [
      { id: 'client-1', name: 'John Smith', email: 'john@example.com', isOwn: false },
      { id: 'client-2', name: 'Jane Doe', email: 'jane@example.com', isOwn: true },
      { id: 'client-3', name: 'ABC Corp', email: 'contact@abccorp.com', isOwn: false },
    ];

    defaultClients.forEach(client => {
      this.clients.set(client.id, client);
    });
  }

  /**
   * Save order to storage
   */
  saveOrder(order) {
    if (!order.id) {
      order.id = this.generateOrderId();
      order.number = this.getNextOrderNumber();
      order.createdAt = new Date().toISOString();
    }
    order.updatedAt = new Date().toISOString();
    this.orders.set(order.id, order);
    return order;
  }

  /**
   * Get order by ID
   */
  getOrder(orderId) {
    return this.orders.get(orderId);
  }

  /**
   * Get all orders
   */
  getAllOrders() {
    return Array.from(this.orders.values());
  }

  /**
   * Delete order
   */
  deleteOrder(orderId) {
    return this.orders.delete(orderId);
  }

  /**
   * Get next sequential order number (zero-padded)
   */
  getNextOrderNumber() {
    const number = this.nextOrderNumber;
    this.nextOrderNumber += 1;
    // Return zero-padded 8-digit number
    return String(number).padStart(8, '0');
  }

  /**
   * Generate unique order ID
   */
  generateOrderId() {
    return `order-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Save client
   */
  saveClient(client) {
    if (!client.id) {
      client.id = `client-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.clients.set(client.id, client);
    return client;
  }

  /**
   * Get client by ID
   */
  getClient(clientId) {
    return this.clients.get(clientId);
  }

  /**
   * Get all clients
   */
  getAllClients() {
    return Array.from(this.clients.values());
  }

  /**
   * Save vehicle
   */
  saveVehicle(vehicle) {
    if (!vehicle.id) {
      vehicle.id = `vehicle-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.vehicles.set(vehicle.id, vehicle);
    return vehicle;
  }

  /**
   * Get vehicle by ID
   */
  getVehicle(vehicleId) {
    return this.vehicles.get(vehicleId);
  }

  /**
   * Get all vehicles
   */
  getAllVehicles() {
    return Array.from(this.vehicles.values());
  }

  /**
   * Get vehicles by client ID
   */
  getVehiclesByClient(clientId) {
    return Array.from(this.vehicles.values()).filter(v => v.clientId === clientId);
  }

  /**
   * Get service from catalog
   */
  getService(serviceId) {
    return this.serviceCatalog.get(serviceId);
  }

  /**
   * Get all services
   */
  getAllServices() {
    return Array.from(this.serviceCatalog.values());
  }

  /**
   * Get services by category
   */
  getServicesByCategory(category) {
    return Array.from(this.serviceCatalog.values()).filter(s => s.category === category);
  }

  /**
   * Add service to catalog
   */
  addServiceToCatalog(service) {
    if (!service.id) {
      service.id = `service-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.serviceCatalog.set(service.id, service);
    return service;
  }
}

export default StorageManager;
