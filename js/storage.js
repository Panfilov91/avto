/**
 * Storage Module
 * Manages localStorage operations for the application
 * Ensures offline operation by storing all data locally
 */

const Storage = {
  STORAGE_KEYS: {
    VEHICLES: 'app_vehicles',
    SEEDED: 'app_seeded',
    VERSION: 'app_version'
  },

  /**
   * Initialize storage with sample data if not already done
   */
  initialize() {
    if (!this.isSeeded()) {
      this.seed();
    }
  },

  /**
   * Check if storage has been seeded
   * @returns {boolean}
   */
  isSeeded() {
    return localStorage.getItem(this.STORAGE_KEYS.SEEDED) === 'true';
  },

  /**
   * Seed initial data
   */
  seed() {
    const sampleVehicles = [
      {
        id: 1,
        plate: 'A001AA99',
        phone: '+7 (900) 111-11-11',
        status: 'active',
        workload: 'high',
        notes: 'Main delivery vehicle',
        createdAt: new Date().toISOString()
      },
      {
        id: 2,
        plate: 'B002BB88',
        phone: '+7 (901) 222-22-22',
        status: 'active',
        workload: 'medium',
        notes: 'Secondary delivery vehicle',
        createdAt: new Date().toISOString()
      },
      {
        id: 3,
        plate: 'C003CC77',
        phone: '+7 (902) 333-33-33',
        status: 'maintenance',
        workload: 'low',
        notes: 'In maintenance',
        createdAt: new Date().toISOString()
      },
      {
        id: 4,
        plate: 'D004DD66',
        phone: '+7 (903) 444-44-44',
        status: 'inactive',
        workload: 'low',
        notes: 'Not in use',
        createdAt: new Date().toISOString()
      },
      {
        id: 5,
        plate: 'E005EE55',
        phone: '+7 (904) 555-55-55',
        status: 'active',
        workload: 'high',
        notes: 'Premium vehicle',
        createdAt: new Date().toISOString()
      }
    ];

    localStorage.setItem(this.STORAGE_KEYS.VEHICLES, JSON.stringify(sampleVehicles));
    localStorage.setItem(this.STORAGE_KEYS.SEEDED, 'true');
    localStorage.setItem(this.STORAGE_KEYS.VERSION, '1.0.0');
  },

  /**
   * Get all vehicles
   * @returns {Array}
   */
  getVehicles() {
    const data = localStorage.getItem(this.STORAGE_KEYS.VEHICLES);
    return data ? JSON.parse(data) : [];
  },

  /**
   * Get vehicle by ID
   * @param {number} id
   * @returns {Object|null}
   */
  getVehicleById(id) {
    const vehicles = this.getVehicles();
    return vehicles.find(v => v.id === id) || null;
  },

  /**
   * Add new vehicle
   * @param {Object} vehicleData
   * @returns {Object} Created vehicle
   */
  addVehicle(vehicleData) {
    const vehicles = this.getVehicles();
    const newId = vehicles.length > 0 ? Math.max(...vehicles.map(v => v.id)) + 1 : 1;

    const newVehicle = {
      id: newId,
      ...vehicleData,
      createdAt: new Date().toISOString()
    };

    vehicles.push(newVehicle);
    localStorage.setItem(this.STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));

    return newVehicle;
  },

  /**
   * Update vehicle
   * @param {number} id
   * @param {Object} updates
   * @returns {Object|null} Updated vehicle
   */
  updateVehicle(id, updates) {
    const vehicles = this.getVehicles();
    const vehicleIndex = vehicles.findIndex(v => v.id === id);

    if (vehicleIndex === -1) {
      return null;
    }

    vehicles[vehicleIndex] = {
      ...vehicles[vehicleIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };

    localStorage.setItem(this.STORAGE_KEYS.VEHICLES, JSON.stringify(vehicles));
    return vehicles[vehicleIndex];
  },

  /**
   * Delete vehicle
   * @param {number} id
   * @returns {boolean} Success
   */
  deleteVehicle(id) {
    const vehicles = this.getVehicles();
    const filteredVehicles = vehicles.filter(v => v.id !== id);

    if (filteredVehicles.length === vehicles.length) {
      return false; // Vehicle not found
    }

    localStorage.setItem(this.STORAGE_KEYS.VEHICLES, JSON.stringify(filteredVehicles));
    return true;
  },

  /**
   * Search vehicles
   * @param {string} query
   * @returns {Array} Matching vehicles
   */
  searchVehicles(query) {
    if (!query) {
      return this.getVehicles();
    }

    const lowerQuery = query.toLowerCase();
    const vehicles = this.getVehicles();

    return vehicles.filter(v =>
      v.plate.toLowerCase().includes(lowerQuery) ||
      v.phone.toLowerCase().includes(lowerQuery) ||
      v.notes.toLowerCase().includes(lowerQuery)
    );
  },

  /**
   * Filter vehicles by status and workload
   * @param {string} status - Empty string for all
   * @param {string} workload - Empty string for all
   * @returns {Array} Filtered vehicles
   */
  filterVehicles(status = '', workload = '') {
    let vehicles = this.getVehicles();

    if (status) {
      vehicles = vehicles.filter(v => v.status === status);
    }

    if (workload) {
      vehicles = vehicles.filter(v => v.workload === workload);
    }

    return vehicles;
  },

  /**
   * Get vehicles for a specific date (simulated calendar data)
   * @param {Date} date
   * @returns {Array}
   */
  getVehiclesForDate(date) {
    const vehicles = this.getVehicles();
    // Simulate data by distributing vehicles across dates
    // In a real app, this would be based on actual scheduling data
    const dayOfMonth = date.getDate();
    return vehicles.filter((v, index) => (index + dayOfMonth) % 3 === 0);
  },

  /**
   * Clear all data
   */
  clear() {
    localStorage.removeItem(this.STORAGE_KEYS.VEHICLES);
    localStorage.removeItem(this.STORAGE_KEYS.SEEDED);
    localStorage.removeItem(this.STORAGE_KEYS.VERSION);
  },

  /**
   * Clear and reseed
   */
  clearAndReseed() {
    this.clear();
    this.seed();
  }
};
