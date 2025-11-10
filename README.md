# Order Management System

A comprehensive order creation and management system with integrated service catalog, automatic discount calculations, and VAT computation.

## Features

- **Multi-section Order Form**: Complete interface for creating and editing orders with client selection/creation, vehicle selection, service line items, parts entries, labor tracking, notes, and scheduling details
- **Service Catalog Integration**: Built-in service catalog with ability to add line items with quantity, unit price, and discount management
- **Automatic Discount Calculation**: 20% automatic discount for designated "own" clients
- **VAT Calculation**: Automatic 18% VAT calculation on subtotal after discounts
- **Live Totals**: Real-time calculation of subtotal, discount, VAT, and grand total as line items change
- **Sequential Order Numbers**: New orders receive zero-padded 8-digit sequential numbers on first save
- **Status Management**: Support for multiple order statuses (draft, scheduled, in-progress, completed)
- **Mechanic Assignment**: Ability to assign mechanics to orders with status-based requirements
- **Persistent Storage**: All order data saved and retrieved via StorageManager
- **Form Validation**: Comprehensive validation for required fields and data integrity
- **Event Listeners**: Form changes trigger events for UI updates without console pollution

## Project Structure

```
src/
├── storage/
│   └── StorageManager.js       # Persistent data storage and retrieval
├── services/
│   ├── OrderCalculationService.js   # Totals, discounts, VAT calculations
│   └── FormValidationService.js     # Form field validation
├── forms/
│   ├── OrderForm.js            # Main order creation/editing form
│   ├── ClientForm.js           # Client creation/editing form
│   └── VehicleForm.js          # Vehicle creation/editing form
├── index.js                     # Main export file
└── **/*.test.js               # Comprehensive unit tests
```

## Usage

### Creating a New Order

```javascript
import OrderForm from './src/forms/OrderForm.js';

// Initialize new order form
const form = new OrderForm();

// Set basic order information
form.setClient('client-1');
form.setFieldValue('vehicleId', 'vehicle-1');

// Add service line items
form.addLineItem('oil-change', 1, 50);
form.addLineItem('brake-pads', 2, 150);

// Add labor entries
form.addLaborEntry('Engine inspection', 2, 75);

// Add parts entries
form.addPartEntry('Engine gasket', 1, 25);

// Set scheduling information
form.setFieldValue('plannedStartDate', '2024-01-15');
form.setFieldValue('mechanicId', 'mech-1');
form.setFieldValue('status', 'scheduled');

// Add notes
form.setFieldValue('notes', 'Customer requested detailed inspection');

// Listen to totals changes
form.addEventListener('totalsChanged', (totals) => {
  console.log('Totals:', totals);
});

// Save order
const savedOrder = form.finalize();
console.log('Order #' + savedOrder.number + ' created');
```

### Editing an Existing Order

```javascript
// Load existing order by ID
const form = new OrderForm('order-id-here');

// Modify as needed
form.setFieldValue('notes', 'Updated notes');
form.updateLineItem('item-id', { quantity: 3 });

// Save changes
const updatedOrder = form.save();
```

### Managing Clients

```javascript
import ClientForm from './src/forms/ClientForm.js';

const clientForm = new ClientForm();
clientForm.setFieldValue('name', 'John Doe');
clientForm.setFieldValue('email', 'john@example.com');
clientForm.setFieldValue('phone', '123-456-7890');
clientForm.setFieldValue('isOwn', true); // Eligible for 20% discount

const savedClient = clientForm.save();
```

### Managing Vehicles

```javascript
import VehicleForm from './src/forms/VehicleForm.js';

const vehicleForm = new VehicleForm('client-id');
vehicleForm.setFieldValue('licensePlate', 'ABC123');
vehicleForm.setFieldValue('make', 'Toyota');
vehicleForm.setFieldValue('model', 'Camry');
vehicleForm.setFieldValue('year', 2022);

const savedVehicle = vehicleForm.save();
```

### Accessing Storage

```javascript
import StorageManager from './src/storage/StorageManager.js';

const storage = new StorageManager();

// Get clients
const clients = storage.getAllClients();
const client = storage.getClient('client-id');

// Get vehicles
const vehicles = storage.getAllVehicles();
const vehiclesByClient = storage.getVehiclesByClient('client-id');

// Get services
const services = storage.getAllServices();
const service = storage.getService('oil-change');

// Get orders
const orders = storage.getAllOrders();
const order = storage.getOrder('order-id');
```

## API Reference

### OrderForm

#### Constructor
- `new OrderForm(existingOrderId = null)` - Initialize form for new or existing order

#### Methods
- `setFieldValue(fieldName, value)` - Set form field value
- `setClient(clientId)` - Set order client
- `addLineItem(serviceId, quantity, unitPrice, discount)` - Add service line item
- `updateLineItem(itemId, updates)` - Update existing line item
- `removeLineItem(itemId)` - Remove line item
- `addLaborEntry(description, hours, hourlyRate)` - Add labor entry
- `updateLaborEntry(laborId, updates)` - Update labor entry
- `removeLaborEntry(laborId)` - Remove labor entry
- `addPartEntry(partName, quantity, unitPrice)` - Add part entry
- `updatePartEntry(partId, updates)` - Update part entry
- `removePartEntry(partId)` - Remove part entry
- `recalculateTotals()` - Recalculate order totals
- `validateForm()` - Validate form data
- `saveDraft()` - Save order as draft
- `finalize()` - Finalize order (validate and save as scheduled)
- `save()` - Save order
- `cancel()` - Cancel changes
- `getFormData()` - Get all form data
- `getLineItems()` - Get all line items
- `getLaborEntries()` - Get all labor entries
- `getPartEntries()` - Get all part entries
- `getValidationErrors()` - Get validation errors
- `isDirtyForm()` - Check if form has unsaved changes
- `getClients()` - Get all clients
- `getVehicles()` - Get all vehicles
- `getVehiclesForCurrentClient()` - Get vehicles for selected client
- `getServices()` - Get all services
- `addEventListener(eventType, callback)` - Register event listener
- `removeEventListener(eventType, callback)` - Unregister event listener

#### Events
- `fieldChanged` - Fired when a field value changes
- `clientChanged` - Fired when client is changed
- `lineItemAdded` - Fired when line item is added
- `lineItemUpdated` - Fired when line item is updated
- `lineItemRemoved` - Fired when line item is removed
- `laborEntryAdded` - Fired when labor entry is added
- `laborEntryUpdated` - Fired when labor entry is updated
- `laborEntryRemoved` - Fired when labor entry is removed
- `partEntryAdded` - Fired when part entry is added
- `partEntryUpdated` - Fired when part entry is updated
- `partEntryRemoved` - Fired when part entry is removed
- `totalsChanged` - Fired when totals are recalculated
- `orderSaved` - Fired when order is saved
- `saveError` - Fired when save fails
- `formCancelled` - Fired when form is cancelled

### StorageManager

#### Methods
- `saveOrder(order)` - Save order and return with ID and sequential number
- `getOrder(orderId)` - Get order by ID
- `getAllOrders()` - Get all orders
- `deleteOrder(orderId)` - Delete order
- `saveClient(client)` - Save client
- `getClient(clientId)` - Get client by ID
- `getAllClients()` - Get all clients
- `saveVehicle(vehicle)` - Save vehicle
- `getVehicle(vehicleId)` - Get vehicle by ID
- `getAllVehicles()` - Get all vehicles
- `getVehiclesByClient(clientId)` - Get vehicles for client
- `getService(serviceId)` - Get service by ID
- `getAllServices()` - Get all services
- `getServicesByCategory(category)` - Get services by category
- `addServiceToCatalog(service)` - Add service to catalog

### OrderCalculationService

#### Static Methods
- `calculateTotals(order, lineItems, client)` - Calculate all totals (subtotal, discount, VAT, grand total)
- `calculateSubtotal(lineItems)` - Calculate subtotal from line items
- `calculateDiscount(subtotal, client, manualDiscount)` - Calculate discount amount
- `calculateVAT(subtotalAfterDiscount)` - Calculate 18% VAT
- `roundToTwoDecimals(value)` - Round to two decimal places
- `validateLineItem(item)` - Validate line item
- `calculateLaborCost(laborHours, hourlyRate)` - Calculate labor cost
- `calculatePartsCost(partItems)` - Calculate parts cost

### FormValidationService

#### Static Methods
- `validateOrderForm(formData)` - Validate complete order form
- `validateClientForm(clientData)` - Validate client form
- `validateVehicleForm(vehicleData)` - Validate vehicle form
- `isValidEmail(email)` - Validate email format
- `validateLineItem(item)` - Validate line item
- `validateLaborEntry(labor)` - Validate labor entry

## Calculation Details

### Discount Calculation
- Automatic 20% discount applied for clients with `isOwn: true`
- Additional manual discounts can be applied
- Discounts are subtracted before VAT calculation

### VAT Calculation
- 18% VAT is calculated on the subtotal after applying discounts
- VAT is not applied to the discount itself

### Order Numbers
- Sequential zero-padded 8-digit numbers
- Assigned on first save
- Immutable after initial save
- Example: `00000001`, `00000002`, etc.

## Testing

Run all tests:
```bash
npm test
```

Tests are included for:
- StorageManager (orders, clients, vehicles, services)
- OrderCalculationService (subtotal, discount, VAT, rounding)
- FormValidationService (all form validations)
- OrderForm (form operations, calculations, persistence)

## Error Handling

- Form validation errors are collected and accessible via `getValidationErrors()`
- Invalid line items, labor entries, or client data throw descriptive errors
- Event listeners handle errors silently to prevent console pollution
- All save operations throw errors that can be caught and handled

## Best Practices

1. Always validate form before finalizing orders
2. Listen to `totalsChanged` events to update UI
3. Check `isDirtyForm()` before discarding changes
4. Handle save errors with try-catch blocks
5. Use event listeners instead of polling for changes
6. Always set a client before adding line items for proper discount calculation
7. For scheduled orders, ensure mechanic is assigned and dates are set

## License

ISC
