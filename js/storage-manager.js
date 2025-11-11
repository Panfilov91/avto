/**
 * Storage Manager - localStorage-backed data management system
 * 
 * JSON Schemas:
 * 
 * Client:
 * {
 *   id: string (uuid),
 *   name: string,
 *   type: 'individual' | 'corporate',
 *   email?: string,
 *   phone?: string,
 *   address?: string,
 *   taxId?: string, // for corporate clients
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO)
 * }
 * 
 * Vehicle:
 * {
 *   id: string (uuid),
 *   clientId: string,
 *   make: string,
 *   model: string,
 *   year: number,
 *   licensePlate: string,
 *   vin?: string,
 *   color?: string,
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO)
 * }
 * 
 * Service:
 * {
 *   id: string (uuid),
 *   name: string,
 *   category: string,
 *   description?: string,
 *   basePrice: number,
 *   duration: number (minutes),
 *   isActive: boolean,
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO)
 * }
 * 
 * Order:
 * {
 *   id: string (uuid),
 *   orderNumber: string (zero-padded, e.g., "00100"),
 *   clientId: string,
 *   vehicleId: string,
 *   serviceIds: string[],
 *   status: 'pending' | 'in_progress' | 'completed' | 'cancelled',
 *   totalAmount: number,
 *   discount?: number,
 *   vat?: number,
 *   notes?: string,
 *   scheduledDate?: string (ISO),
 *   completedDate?: string (ISO),
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO)
 * }
 * 
 * Lift/Calendar Slot:
 * {
 *   id: string (uuid),
 *   liftNumber: number,
 *   date: string (ISO date),
 *   startTime: string (HH:mm),
 *   endTime: string (HH:mm),
 *   orderId?: string,
 *   isAvailable: boolean,
 *   createdAt: string (ISO),
 *   updatedAt: string (ISO)
 * }
 */

class StorageManager {
  constructor() {
    this.initializeStorage();
  }

  /**
   * Initialize storage with seed data if empty
   */
  initializeStorage() {
    if (!this.getItem('initialized')) {
      this.seedData();
      this.setItem('initialized', 'true');
    }
  }

  /**
   * Safe JSON parsing with error handling
   */
  safeJsonParse(str, defaultValue = null) {
    try {
      return JSON.parse(str);
    } catch (error) {
      console.warn('Failed to parse JSON:', error);
      return defaultValue;
    }
  }

  /**
   * Safe JSON stringifying with error handling
   */
  safeJsonStringify(obj) {
    try {
      return JSON.stringify(obj);
    } catch (error) {
      console.warn('Failed to stringify JSON:', error);
      return null;
    }
  }

  /**
   * Get item from localStorage
   */
  getItem(key) {
    const value = localStorage.getItem(key);
    return value ? this.safeJsonParse(value) : null;
  }

  /**
   * Set item in localStorage
   */
  setItem(key, value) {
    const stringValue = this.safeJsonStringify(value);
    if (stringValue !== null) {
      localStorage.setItem(key, stringValue);
      return true;
    }
    return false;
  }

  /**
   * Get all items of a specific type
   */
  getAll(type) {
    return this.getItem(type) || [];
  }

  /**
   * Add new item
   */
  add(type, item) {
    const items = this.getAll(type);
    
    // Validate required fields based on type
    if (!this.validateItem(type, item)) {
      throw new Error(`Invalid ${type} item`);
    }

    const newItem = {
      ...item,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    items.push(newItem);
    this.setItem(type, items);
    return newItem;
  }

  /**
   * Update existing item
   */
  update(type, id, updates) {
    const items = this.getAll(type);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`${type} with id ${id} not found`);
    }

    const updatedItem = {
      ...items[index],
      ...updates,
      id, // Ensure ID cannot be changed
      updatedAt: new Date().toISOString()
    };

    // Validate updated item
    if (!this.validateItem(type, updatedItem)) {
      throw new Error(`Invalid ${type} update`);
    }

    items[index] = updatedItem;
    this.setItem(type, items);
    return updatedItem;
  }

  /**
   * Remove item by ID
   */
  remove(type, id) {
    const items = this.getAll(type);
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      throw new Error(`${type} with id ${id} not found`);
    }

    this.setItem(type, filteredItems);
    return true;
  }

  /**
   * Find item by ID
   */
  findById(type, id) {
    const items = this.getAll(type);
    return items.find(item => item.id === id) || null;
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  /**
   * Validate item based on type
   */
  validateItem(type, item) {
    switch (type) {
      case 'clients':
        return this.validateClient(item);
      case 'vehicles':
        return this.validateVehicle(item);
      case 'services':
        return this.validateService(item);
      case 'orders':
        return this.validateOrder(item);
      case 'lifts':
        return this.validateLift(item);
      default:
        return false;
    }
  }

  /**
   * Validate client item
   */
  validateClient(client) {
    return (
      typeof client.name === 'string' && client.name.length > 0 &&
      ['individual', 'corporate'].includes(client.type)
    );
  }

  /**
   * Validate vehicle item
   */
  validateVehicle(vehicle) {
    return (
      typeof vehicle.clientId === 'string' && vehicle.clientId.length > 0 &&
      typeof vehicle.make === 'string' && vehicle.make.length > 0 &&
      typeof vehicle.model === 'string' && vehicle.model.length > 0 &&
      typeof vehicle.year === 'number' && vehicle.year >= 1900 && vehicle.year <= new Date().getFullYear() + 1 &&
      typeof vehicle.licensePlate === 'string' && vehicle.licensePlate.length > 0
    );
  }

  /**
   * Validate service item
   */
  validateService(service) {
    return (
      typeof service.name === 'string' && service.name.length > 0 &&
      typeof service.category === 'string' && service.category.length > 0 &&
      typeof service.basePrice === 'number' && service.basePrice >= 0 &&
      typeof service.duration === 'number' && service.duration > 0 &&
      typeof service.isActive === 'boolean'
    );
  }

  /**
   * Validate order item
   */
  validateOrder(order) {
    return (
      typeof order.orderNumber === 'string' && order.orderNumber.length > 0 &&
      typeof order.clientId === 'string' && order.clientId.length > 0 &&
      typeof order.vehicleId === 'string' && order.vehicleId.length > 0 &&
      Array.isArray(order.serviceIds) &&
      typeof order.status === 'string' && ['pending', 'in_progress', 'completed', 'cancelled'].includes(order.status) &&
      typeof order.totalAmount === 'number' && order.totalAmount >= 0
    );
  }

  /**
   * Validate lift item
   */
  validateLift(lift) {
    return (
      typeof lift.liftNumber === 'number' && lift.liftNumber > 0 &&
      typeof lift.date === 'string' && lift.date.length > 0 &&
      typeof lift.startTime === 'string' && lift.startTime.length > 0 &&
      typeof lift.endTime === 'string' && lift.endTime.length > 0 &&
      typeof lift.isAvailable === 'boolean'
    );
  }

  /**
   * Get next order number with zero-padding
   */
  getNextOrderNumber() {
    let counter = parseInt(this.getItem('orderCounter') || '99');
    counter++;
    this.setItem('orderCounter', counter.toString());
    return counter.toString().padStart(5, '0');
  }

  /**
   * Seed initial data
   */
  seedData() {
    // Seed car makes and models
    const carMakes = [
      { make: 'Toyota', models: ['Camry', 'Corolla', 'Prius', 'RAV4', 'Highlander', 'Tacoma', 'Tundra'] },
      { make: 'Honda', models: ['Accord', 'Civic', 'CR-V', 'Pilot', 'Fit', 'HR-V', 'Odyssey'] },
      { make: 'Ford', models: ['F-150', 'Mustang', 'Explorer', 'Escape', 'Focus', 'Fusion', 'Edge'] },
      { make: 'Chevrolet', models: ['Silverado', 'Malibu', 'Equinox', 'Tahoe', 'Camaro', 'Traverse', 'Colorado'] },
      { make: 'BMW', models: ['3 Series', '5 Series', 'X3', 'X5', '328i', '528i', 'X1'] },
      { make: 'Mercedes-Benz', models: ['C-Class', 'E-Class', 'GLC', 'GLE', 'S-Class', 'A-Class', 'GLA'] },
      { make: 'Audi', models: ['A4', 'A6', 'Q5', 'Q7', 'A3', 'Q3', 'A8'] },
      { make: 'Volkswagen', models: ['Jetta', 'Passat', 'Tiguan', 'Atlas', 'Golf', 'Beetle', 'Arteon'] },
      { make: 'Nissan', models: ['Altima', 'Sentra', 'Rogue', 'Pathfinder', 'Murano', 'Maxima', 'Frontier'] },
      { make: 'Hyundai', models: ['Elantra', 'Sonata', 'Tucson', 'Santa Fe', 'Kona', 'Veloster', 'Palisade'] },
      { make: 'Kia', models: ['Optima', 'Sorento', 'Sportage', 'Telluride', 'Forte', 'Soul', 'Stinger'] },
      { make: 'Mazda', models: ['Mazda3', 'Mazda6', 'CX-5', 'CX-9', 'MX-5 Miata', 'CX-3', 'CX-30'] },
      { make: 'Subaru', models: ['Outback', 'Forester', 'Impreza', 'Legacy', 'Crosstrek', 'Ascent', 'BRZ'] },
      { make: 'Lexus', models: ['RX', 'ES', 'NX', 'LS', 'GX', 'IS', 'UX'] },
      { make: 'Tesla', models: ['Model 3', 'Model S', 'Model X', 'Model Y', 'Cybertruck', 'Roadster', 'Semi'] }
    ];

    this.setItem('carMakes', carMakes);

    // Seed sample clients
    const clients = [
      {
        name: 'John Smith',
        type: 'individual',
        email: 'john.smith@email.com',
        phone: '555-0101',
        address: '123 Main St, Anytown, USA'
      },
      {
        name: 'Sarah Johnson',
        type: 'individual',
        email: 'sarah.j@email.com',
        phone: '555-0102',
        address: '456 Oak Ave, Somewhere, USA'
      },
      {
        name: 'Mike Wilson',
        type: 'individual',
        email: 'm.wilson@email.com',
        phone: '555-0103'
      },
      {
        name: 'ABC Corporation',
        type: 'corporate',
        email: 'fleet@abccorp.com',
        phone: '555-0201',
        address: '789 Business Blvd, Commerce City, USA',
        taxId: '12-3456789'
      },
      {
        name: 'XYZ Logistics',
        type: 'corporate',
        email: 'maintenance@xyzlogistics.com',
        phone: '555-0202',
        address: '321 Industrial Way, Factory Town, USA',
        taxId: '98-7654321'
      }
    ];

    this.setItem('clients', clients);

    // Seed services
    const services = [
      // Oil Change Services
      { name: 'Conventional Oil Change', category: 'Oil Change', description: 'Standard oil change with conventional oil', basePrice: 29.99, duration: 30 },
      { name: 'Synthetic Oil Change', category: 'Oil Change', description: 'Full synthetic oil change', basePrice: 49.99, duration: 30 },
      { name: 'High Mileage Oil Change', category: 'Oil Change', description: 'Oil change for vehicles over 75,000 miles', basePrice: 39.99, duration: 30 },

      // Tire Services
      { name: 'Tire Rotation', category: 'Tire Service', description: 'Rotate tires for even wear', basePrice: 19.99, duration: 20 },
      { name: 'Tire Balance', category: 'Tire Service', description: 'Balance all four tires', basePrice: 39.99, duration: 40 },
      { name: 'Flat Tire Repair', category: 'Tire Service', description: 'Plug and patch tire repair', basePrice: 24.99, duration: 30 },
      { name: 'New Tire Installation', category: 'Tire Service', description: 'Install and balance new tires (per tire)', basePrice: 25.00, duration: 30 },
      { name: 'Wheel Alignment', category: 'Tire Service', description: 'Four-wheel alignment', basePrice: 89.99, duration: 60 },

      // Brake Services
      { name: 'Brake Pad Replacement (Front)', category: 'Brake Service', description: 'Replace front brake pads', basePrice: 149.99, duration: 90 },
      { name: 'Brake Pad Replacement (Rear)', category: 'Brake Service', description: 'Replace rear brake pads', basePrice: 129.99, duration: 90 },
      { name: 'Brake Rotor Replacement (Front)', category: 'Brake Service', description: 'Replace front brake rotors', basePrice: 199.99, duration: 90 },
      { name: 'Brake Rotor Replacement (Rear)', category: 'Brake Service', description: 'Replace rear brake rotors', basePrice: 179.99, duration: 90 },
      { name: 'Brake Fluid Flush', category: 'Brake Service', description: 'Flush and replace brake fluid', basePrice: 79.99, duration: 45 },

      // Engine Services
      { name: 'Air Filter Replacement', category: 'Engine Service', description: 'Replace engine air filter', basePrice: 24.99, duration: 15 },
      { name: 'Cabin Air Filter Replacement', category: 'Engine Service', description: 'Replace cabin air filter', basePrice: 34.99, duration: 20 },
      { name: 'Spark Plug Replacement', category: 'Engine Service', description: 'Replace spark plugs (4 cylinder)', basePrice: 89.99, duration: 60 },
      { name: 'Fuel Filter Replacement', category: 'Engine Service', description: 'Replace fuel filter', basePrice: 69.99, duration: 45 },
      { name: 'Serpentine Belt Replacement', category: 'Engine Service', description: 'Replace serpentine belt', basePrice: 79.99, duration: 45 },
      { name: 'Timing Belt Replacement', category: 'Engine Service', description: 'Replace timing belt', basePrice: 499.99, duration: 240 },

      // Transmission Services
      { name: 'Automatic Transmission Service', category: 'Transmission Service', description: 'Transmission fluid and filter change', basePrice: 149.99, duration: 120 },
      { name: 'Manual Transmission Service', category: 'Transmission Service', description: 'Manual transmission fluid change', basePrice: 99.99, duration: 90 },
      { name: 'CVT Transmission Service', category: 'Transmission Service', description: 'CVT fluid change', basePrice: 179.99, duration: 120 },

      // Cooling System
      { name: 'Coolant Flush', category: 'Cooling System', description: 'Flush and refill cooling system', basePrice: 99.99, duration: 90 },
      { name: 'Radiator Hose Replacement', category: 'Cooling System', description: 'Replace radiator hose', basePrice: 89.99, duration: 60 },
      { name: 'Thermostat Replacement', category: 'Cooling System', description: 'Replace thermostat', basePrice: 79.99, duration: 60 },
      { name: 'Water Pump Replacement', category: 'Cooling System', description: 'Replace water pump', basePrice: 299.99, duration: 180 },

      // Battery & Electrical
      { name: 'Battery Replacement', category: 'Electrical', description: 'Replace car battery', basePrice: 149.99, duration: 30 },
      { name: 'Alternator Replacement', category: 'Electrical', description: 'Replace alternator', basePrice: 399.99, duration: 120 },
      { name: 'Starter Replacement', category: 'Electrical', description: 'Replace starter motor', basePrice: 349.99, duration: 120 },
      { name: 'Headlight Bulb Replacement', category: 'Electrical', description: 'Replace headlight bulb (per bulb)', basePrice: 29.99, duration: 20 },

      // HVAC
      { name: 'A/C Recharge', category: 'HVAC', description: 'Recharge air conditioning system', basePrice: 99.99, duration: 60 },
      { name: 'A/C Compressor Replacement', category: 'HVAC', description: 'Replace A/C compressor', basePrice: 599.99, duration: 240 },
      { name: 'Heater Core Replacement', category: 'HVAC', description: 'Replace heater core', basePrice: 449.99, duration: 300 },
      { name: 'Blower Motor Replacement', category: 'HVAC', description: 'Replace blower motor', basePrice: 249.99, duration: 90 },

      // Exhaust System
      { name: 'Muffler Replacement', category: 'Exhaust System', description: 'Replace muffler', basePrice: 199.99, duration: 60 },
      { name: 'Exhaust Pipe Replacement', category: 'Exhaust System', description: 'Replace exhaust pipe section', basePrice: 149.99, duration: 45 },
      { name: 'Catalytic Converter Replacement', category: 'Exhaust System', description: 'Replace catalytic converter', basePrice: 899.99, duration: 120 },
      { name: 'O2 Sensor Replacement', category: 'Exhaust System', description: 'Replace oxygen sensor', basePrice: 149.99, duration: 30 },

      // Suspension & Steering
      { name: 'Shock Absorber Replacement (Front)', category: 'Suspension', description: 'Replace front shock absorbers (pair)', basePrice: 299.99, duration: 120 },
      { name: 'Shock Absorber Replacement (Rear)', category: 'Suspension', description: 'Replace rear shock absorbers (pair)', basePrice: 279.99, duration: 120 },
      { name: 'Strut Replacement (Front)', category: 'Suspension', description: 'Replace front struts (pair)', basePrice: 449.99, duration: 180 },
      { name: 'Strut Replacement (Rear)', category: 'Suspension', description: 'Replace rear struts (pair)', basePrice: 399.99, duration: 180 },
      { name: 'Ball Joint Replacement', category: 'Suspension', description: 'Replace ball joint (per side)', basePrice: 149.99, duration: 60 },
      { name: 'Tie Rod Replacement', category: 'Suspension', description: 'Replace tie rod (per side)', basePrice: 129.99, duration: 60 },

      // Diagnostic
      { name: 'Check Engine Light Diagnosis', category: 'Diagnostic', description: 'Diagnose check engine light', basePrice: 89.99, duration: 60 },
      { name: 'Full Vehicle Inspection', category: 'Diagnostic', description: 'Complete vehicle inspection', basePrice: 149.99, duration: 120 },
      { name: 'Emissions Test', category: 'Diagnostic', description: 'State emissions inspection', basePrice: 39.99, duration: 30 },
      { name: 'Computer Diagnostic Scan', category: 'Diagnostic', description: 'Full computer system scan', basePrice: 69.99, duration: 45 }
    ];

    const servicesWithIds = services.map(service => ({
      ...service,
      id: this.generateId(),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }));

    this.setItem('services', servicesWithIds);

    // Initialize empty arrays for other data types
    this.setItem('vehicles', []);
    this.setItem('orders', []);
    this.setItem('lifts', []);

    // Seed default lifts (4 lifts for scheduling)
    const lifts = [];
    const now = new Date();
    
    // Create 2 weeks of lift schedules
    for (let week = 0; week < 2; week++) {
      for (let day = 0; day < 7; day++) {
        const currentDate = new Date(now);
        currentDate.setDate(now.getDate() + (week * 7) + day);
        currentDate.setHours(0, 0, 0, 0);
        
        const dateStr = currentDate.toISOString().split('T')[0];
        
        // Each lift has 8 time slots (8am-12pm and 1pm-5pm, 1 hour each)
        for (let lift = 1; lift <= 4; lift++) {
          for (let hour = 8; hour <= 17; hour++) {
            if (hour !== 12) { // Skip lunch break
              const startTime = `${hour.toString().padStart(2, '0')}:00`;
              const endTime = `${(hour + 1).toString().padStart(2, '0')}:00`;
              
              lifts.push({
                id: this.generateId(),
                liftNumber: lift,
                date: dateStr,
                startTime: startTime,
                endTime: endTime,
                isAvailable: true,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
              });
            }
          }
        }
      }
    }

    this.setItem('lifts', lifts);

    // Initialize order counter to start at 100
    this.setItem('orderCounter', '99');
  }

  /**
   * Export all data to JSON string
   */
  exportData() {
    const data = {
      clients: this.getAll('clients'),
      vehicles: this.getAll('vehicles'),
      services: this.getAll('services'),
      orders: this.getAll('orders'),
      lifts: this.getAll('lifts'),
      carMakes: this.getItem('carMakes'),
      orderCounter: this.getItem('orderCounter'),
      exportedAt: new Date().toISOString()
    };
    
    return this.safeJsonStringify(data);
  }

  /**
   * Import data from JSON string
   */
  importData(jsonString) {
    try {
      const data = this.safeJsonParse(jsonString);
      if (!data) {
        throw new Error('Invalid JSON data');
      }

      // Validate and import each data type
      if (data.clients && Array.isArray(data.clients)) {
        this.setItem('clients', data.clients);
      }
      
      if (data.vehicles && Array.isArray(data.vehicles)) {
        this.setItem('vehicles', data.vehicles);
      }
      
      if (data.services && Array.isArray(data.services)) {
        this.setItem('services', data.services);
      }
      
      if (data.orders && Array.isArray(data.orders)) {
        this.setItem('orders', data.orders);
      }
      
      if (data.lifts && Array.isArray(data.lifts)) {
        this.setItem('lifts', data.lifts);
      }
      
      if (data.carMakes && Array.isArray(data.carMakes)) {
        this.setItem('carMakes', data.carMakes);
      }
      
      if (data.orderCounter) {
        this.setItem('orderCounter', data.orderCounter.toString());
      }

      return true;
    } catch (error) {
      console.error('Failed to import data:', error);
      return false;
    }
  }

  /**
   * Clear all data (for reset purposes)
   */
  clearAllData() {
    localStorage.removeItem('clients');
    localStorage.removeItem('vehicles');
    localStorage.removeItem('services');
    localStorage.removeItem('orders');
    localStorage.removeItem('lifts');
    localStorage.removeItem('carMakes');
    localStorage.removeItem('orderCounter');
    localStorage.removeItem('initialized');
  }
}

// Create singleton instance
const storageManagerInstance = new StorageManager();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = storageManagerInstance;
} else if (typeof window !== 'undefined') {
  window.StorageManager = storageManagerInstance;
}