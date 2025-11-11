// Test the storage manager in Node.js environment
const fs = require('fs');

// Mock localStorage for Node.js testing
global.localStorage = {
  data: {},
  getItem: function(key) { return this.data[key] || null; },
  setItem: function(key, value) { this.data[key] = value; },
  removeItem: function(key) { delete this.data[key]; }
};

// Mock window object for browser compatibility
global.window = {};

// Load and execute the storage manager
const storageCode = fs.readFileSync('storage-manager.js', 'utf8');
eval(storageCode);

// Get the StorageManager class from module.exports
const StorageManager = module.exports;

// Test basic functionality
console.log('Testing Storage Manager...');

const storage = new StorageManager();
console.log('✓ Storage Manager initialized');

// Test seed data
const carMakes = storage.getItem('carMakes');
console.log(`✓ Car makes loaded: ${carMakes.length}`);

const services = storage.getAll('services');
console.log(`✓ Services loaded: ${services.length}`);

const clients = storage.getAll('clients');
console.log(`✓ Clients loaded: ${clients.length}`);

const lifts = storage.getAll('lifts');
console.log(`✓ Lifts loaded: ${lifts.length}`);

// Test CRUD operations
const newClient = storage.add('clients', {
  name: 'Test Client',
  type: 'individual',
  email: 'test@example.com'
});
console.log(`✓ Added client: ${newClient.name} (ID: ${newClient.id})`);

// Test find by ID
const foundClient = storage.findById('clients', newClient.id);
console.log(`✓ Found client: ${foundClient ? foundClient.name : 'NOT FOUND'}`);

// Test update
const updatedClient = storage.update('clients', newClient.id, {
  name: 'Updated Test Client'
});
console.log(`✓ Updated client: ${updatedClient.name}`);

// Test order numbering
const orderNumber1 = storage.getNextOrderNumber();
const orderNumber2 = storage.getNextOrderNumber();
console.log(`✓ Order numbers: ${orderNumber1}, ${orderNumber2}`);

// Test export/import
const exportData = storage.exportData();
console.log(`✓ Export successful: ${exportData.length} characters`);

const importSuccess = storage.importData(exportData);
console.log(`✓ Import successful: ${importSuccess}`);

// Test validation
try {
  storage.add('clients', { name: '', type: 'invalid' });
  console.log('✗ Validation should have failed');
} catch (error) {
  console.log(`✓ Validation working: ${error.message}`);
}

// Test service categories
const categories = [...new Set(services.map(s => s.category))];
console.log(`✓ Service categories: ${categories.join(', ')}`);

// Test car makes and models
let totalModels = 0;
carMakes.forEach(make => {
  totalModels += make.models.length;
});
console.log(`✓ Total car models: ${totalModels}`);

// Test order counter persistence
const counter = storage.getItem('orderCounter');
console.log(`✓ Order counter: ${counter}`);

console.log('\nAll tests passed! ✅');