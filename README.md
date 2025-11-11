# Storage Manager Implementation

A comprehensive localStorage-backed data management system for automotive service management applications.

## Features

- **JSON Schema Definitions**: Documented schemas for all data entities
- **CRUD Operations**: Complete Create, Read, Update, Delete functionality
- **Data Validation**: Built-in validation for all data types
- **Seed Data**: Pre-populated with realistic automotive data
- **Order Numbering**: Persistent, zero-padded order counter starting at 00100
- **Export/Import**: Backup and restore functionality
- **Error Handling**: Safe JSON parsing/stringifying with fallbacks
- **Idempotent Initialization**: Seed data appears only once

## Data Schema

### Client
```json
{
  "id": "string (uuid)",
  "name": "string",
  "type": "individual|corporate",
  "email": "string (optional)",
  "phone": "string (optional)",
  "address": "string (optional)",
  "taxId": "string (optional, corporate only)",
  "createdAt": "string (ISO)",
  "updatedAt": "string (ISO)"
}
```

### Vehicle
```json
{
  "id": "string (uuid)",
  "clientId": "string",
  "make": "string",
  "model": "string",
  "year": "number",
  "licensePlate": "string",
  "vin": "string (optional)",
  "color": "string (optional)",
  "createdAt": "string (ISO)",
  "updatedAt": "string (ISO)"
}
```

### Service
```json
{
  "id": "string (uuid)",
  "name": "string",
  "category": "string",
  "description": "string (optional)",
  "basePrice": "number",
  "duration": "number (minutes)",
  "isActive": "boolean",
  "createdAt": "string (ISO)",
  "updatedAt": "string (ISO)"
}
```

### Order
```json
{
  "id": "string (uuid)",
  "orderNumber": "string (zero-padded)",
  "clientId": "string",
  "vehicleId": "string",
  "serviceIds": "array",
  "status": "pending|in_progress|completed|cancelled",
  "totalAmount": "number",
  "discount": "number (optional)",
  "vat": "number (optional)",
  "notes": "string (optional)",
  "scheduledDate": "string (ISO, optional)",
  "completedDate": "string (ISO, optional)",
  "createdAt": "string (ISO)",
  "updatedAt": "string (ISO)"
}
```

### Lift/Calendar Slot
```json
{
  "id": "string (uuid)",
  "liftNumber": "number",
  "date": "string (ISO date)",
  "startTime": "string (HH:mm)",
  "endTime": "string (HH:mm)",
  "orderId": "string (optional)",
  "isAvailable": "boolean",
  "createdAt": "string (ISO)",
  "updatedAt": "string (ISO)"
}
```

## API Reference

### Constructor
```javascript
const storageManager = new StorageManager();
```

### CRUD Operations

#### Get All Items
```javascript
const clients = storageManager.getAll('clients');
const vehicles = storageManager.getAll('vehicles');
// etc.
```

#### Add Item
```javascript
const newClient = storageManager.add('clients', {
  name: 'John Doe',
  type: 'individual',
  email: 'john@example.com'
});
```

#### Update Item
```javascript
const updatedClient = storageManager.update('clients', clientId, {
  name: 'John Smith',
  phone: '555-0123'
});
```

#### Remove Item
```javascript
storageManager.remove('clients', clientId);
```

#### Find by ID
```javascript
const client = storageManager.findById('clients', clientId);
```

### Order Management

#### Get Next Order Number
```javascript
const orderNumber = storageManager.getNextOrderNumber(); // Returns "00100", "00101", etc.
```

### Data Management

#### Export Data
```javascript
const jsonData = storageManager.exportData();
```

#### Import Data
```javascript
const success = storageManager.importData(jsonData);
```

#### Clear All Data
```javascript
storageManager.clearAllData();
```

## Seed Data

The system automatically seeds the following data on first load:

### Car Makes & Models
- 15 major car manufacturers
- 100+ vehicle models
- Toyota, Honda, Ford, Chevrolet, BMW, Mercedes-Benz, Audi, Volkswagen, Nissan, Hyundai, Kia, Mazda, Subaru, Lexus, Tesla

### Sample Clients
- 3 individual clients with contact information
- 2 corporate clients with tax IDs

### Services
- 8 service categories with 60+ services
- Oil Change, Tire Service, Brake Service, Engine Service, Transmission Service, Cooling System, Electrical, HVAC, Exhaust System, Suspension, Diagnostic
- Realistic pricing and duration estimates

### Lift Scheduling
- 4 service lifts
- 2 weeks of scheduling slots
- Hourly slots from 8am-5pm (excluding lunch break)

### Order Counter
- Starts at 99 (so first order is 00100)
- Persists across page reloads
- Zero-padded 5-digit format

## Usage Examples

### Basic Operations
```javascript
// Initialize storage manager
const storage = new StorageManager();

// Add a new client
const client = storage.add('clients', {
  name: 'Jane Smith',
  type: 'individual',
  email: 'jane@example.com',
  phone: '555-0123'
});

// Add a vehicle for the client
const vehicle = storage.add('vehicles', {
  clientId: client.id,
  make: 'Toyota',
  model: 'Camry',
  year: 2020,
  licensePlate: 'ABC-123'
});

// Create an order
const orderNumber = storage.getNextOrderNumber();
const order = storage.add('orders', {
  orderNumber: orderNumber,
  clientId: client.id,
  vehicleId: vehicle.id,
  serviceIds: ['service-id-1', 'service-id-2'],
  status: 'pending',
  totalAmount: 129.98
});
```

### Data Validation
The storage manager includes comprehensive validation for all data types. Invalid data will throw descriptive errors.

### Error Handling
All operations include error handling with safe JSON parsing/stringifying. Invalid operations throw descriptive errors.

## Testing

Open `test-storage.html` in a web browser to run comprehensive tests covering:

- Initialization and seed data
- CRUD operations
- Order number generation
- Data validation
- Export/import functionality
- Data persistence

## Browser Compatibility

- Requires modern browser with localStorage support
- Uses ES6+ features (classes, template literals, arrow functions)
- No external dependencies

## File Structure

```
├── storage-manager.js    # Main StorageManager class
├── test-storage.html     # Test suite and demo
└── README.md            # This documentation
```

## Implementation Notes

- All data is stored in localStorage as JSON strings
- IDs are generated using UUID v4 format
- Timestamps are stored in ISO 8601 format
- The system is designed to be idempotent - running initialization multiple times won't duplicate seed data
- Export/import functionality preserves all data including timestamps and relationships