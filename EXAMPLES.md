# Order Management System - Examples

This document provides comprehensive examples of how to use the Order Management System.

## Table of Contents

1. [Creating Orders](#creating-orders)
2. [Managing Line Items](#managing-line-items)
3. [Calculating Totals](#calculating-totals)
4. [Working with Clients](#working-with-clients)
5. [Working with Vehicles](#working-with-vehicles)
6. [Form Validation](#form-validation)
7. [Event Handling](#event-handling)
8. [Editing Orders](#editing-orders)

## Creating Orders

### Basic Order Creation

```javascript
import OrderForm from './src/forms/OrderForm.js';

// Create new order form
const orderForm = new OrderForm();

// Set client (required)
orderForm.setClient('client-1');

// Set vehicle (required)
orderForm.setFieldValue('vehicleId', 'vehicle-1');

// Set status (required)
orderForm.setFieldValue('status', 'draft');

// Save as draft
const draftOrder = orderForm.saveDraft();
console.log('Draft order created:', draftOrder.number);
```

### Creating a Scheduled Order

```javascript
const orderForm = new OrderForm();

// Required fields
orderForm.setClient('client-1');
orderForm.setFieldValue('vehicleId', 'vehicle-1');

// Add line items (required for non-draft orders)
orderForm.addLineItem('oil-change', 1, 50);
orderForm.addLineItem('brake-pads', 2, 150);

// Set scheduling (required for scheduled orders)
orderForm.setFieldValue('status', 'scheduled');
orderForm.setFieldValue('mechanicId', 'mech-1');
orderForm.setFieldValue('plannedStartDate', '2024-01-15');
orderForm.setFieldValue('plannedEndDate', '2024-01-16');

// Add notes
orderForm.setFieldValue('notes', 'Customer wants comprehensive inspection');
orderForm.setFieldValue('internalNotes', 'Priority: High');

// Add lift reference
orderForm.setFieldValue('liftReference', 'Lift-A1');

// Finalize (validates and saves as scheduled)
const scheduledOrder = orderForm.finalize();
console.log('Order created:', scheduledOrder.number, 'Status:', scheduledOrder.status);
```

## Managing Line Items

### Adding Line Items

```javascript
const form = new OrderForm();
form.setClient('client-1');

// Add service line item with quantity and unit price
const item1 = form.addLineItem('oil-change', 1, 50);
console.log('Added:', item1.serviceName, 'Qty:', item1.quantity);

// Add another line item
const item2 = form.addLineItem('tire-rotation', 4, 75);
console.log('Added:', item2.serviceName, 'Qty:', item2.quantity);

// View all line items
const lineItems = form.getLineItems();
console.log('Total items:', lineItems.length);
```

### Updating Line Items

```javascript
const form = new OrderForm();
form.setClient('client-1');
const item = form.addLineItem('oil-change', 1, 50);

// Update quantity
form.updateLineItem(item.id, { quantity: 2 });

// Update unit price
form.updateLineItem(item.id, { unitPrice: 55 });

// Update both
form.updateLineItem(item.id, { quantity: 3, unitPrice: 60 });

const updated = form.getLineItems()[0];
console.log('Updated total:', updated.total); // 180
```

### Removing Line Items

```javascript
const form = new OrderForm();
form.setClient('client-1');
const item1 = form.addLineItem('oil-change', 1, 50);
const item2 = form.addLineItem('brake-pads', 2, 150);

console.log('Items before:', form.getLineItems().length); // 2

form.removeLineItem(item1.id);

console.log('Items after:', form.getLineItems().length); // 1
```

### Adding Labor Entries

```javascript
const form = new OrderForm();
form.setClient('client-1');

// Add labor entry: description, hours, hourly rate
const labor1 = form.addLaborEntry('Engine inspection', 2, 75);
console.log('Labor 1 total:', labor1.total); // 150

const labor2 = form.addLaborEntry('Transmission service', 3.5, 100);
console.log('Labor 2 total:', labor2.total); // 350

// View all labor entries
const laborEntries = form.getLaborEntries();
console.log('Total labor entries:', laborEntries.length); // 2
```

### Adding Parts Entries

```javascript
const form = new OrderForm();
form.setClient('client-1');

// Add part entry: name, quantity, unit price
const part1 = form.addPartEntry('Engine oil (5L)', 2, 35);
console.log('Part 1 total:', part1.total); // 70

const part2 = form.addPartEntry('Cabin air filter', 1, 45);
console.log('Part 2 total:', part2.total); // 45

// View all part entries
const partEntries = form.getPartEntries();
console.log('Total part entries:', partEntries.length); // 2
```

## Calculating Totals

### Understanding Automatic Discounts

```javascript
import OrderForm from './src/forms/OrderForm.js';

// Regular client (no discount)
const form1 = new OrderForm();
form1.setClient('client-1'); // isOwn: false
form1.addLineItem('oil-change', 1, 100);

let data = form1.getFormData();
console.log('Regular client:');
console.log('  Subtotal:', data.subtotal);        // 100
console.log('  Discount:', data.discount);        // 0
console.log('  VAT (18%):', data.vat);           // 18
console.log('  Grand Total:', data.grandTotal);  // 118

// Own client (20% discount)
const form2 = new OrderForm();
form2.setClient('client-2'); // isOwn: true
form2.addLineItem('oil-change', 1, 100);

data = form2.getFormData();
console.log('\nOwn client (20% discount):');
console.log('  Subtotal:', data.subtotal);              // 100
console.log('  Discount:', data.discount);             // 20 (20% of 100)
console.log('  Subtotal after discount:', data.subtotalAfterDiscount); // 80
console.log('  VAT (18%):', data.vat);                // 14.4 (18% of 80)
console.log('  Grand Total:', data.grandTotal);        // 94.4
```

### Multiple Line Items with Calculations

```javascript
const form = new OrderForm();
form.setClient('client-2'); // own client with 20% discount

// Add services
form.addLineItem('oil-change', 1, 100);
form.addLineItem('brake-pads', 2, 150);
form.addLineItem('tire-rotation', 1, 75);

// Add labor
form.addLaborEntry('Full inspection', 3, 50);

// Add parts
form.addPartEntry('Brake fluid', 1, 30);

const data = form.getFormData();
console.log('Complete Order Breakdown:');
console.log('  Subtotal:           $' + data.subtotal);
console.log('  Discount (20%):     -$' + data.discount);
console.log('  After Discount:     $' + data.subtotalAfterDiscount);
console.log('  VAT (18%):          $' + data.vat);
console.log('  GRAND TOTAL:        $' + data.grandTotal);
```

### Manual Discounts

```javascript
const form = new OrderForm();
form.setClient('client-1'); // regular client

form.addLineItem('oil-change', 1, 100);

// Apply manual discount
form.setFieldValue('manualDiscount', 10);

const data = form.getFormData();
console.log('Subtotal:', data.subtotal);        // 100
console.log('Manual Discount:', data.discount); // 10
console.log('VAT:', data.vat);                 // 16.2 (18% of 90)
console.log('Grand Total:', data.grandTotal);  // 106.2
```

## Working with Clients

### Creating a New Client

```javascript
import ClientForm from './src/forms/ClientForm.js';

const clientForm = new ClientForm();

// Set client information
clientForm.setFieldValue('name', 'John Smith');
clientForm.setFieldValue('email', 'john@example.com');
clientForm.setFieldValue('phone', '555-0123');
clientForm.setFieldValue('address', '123 Main St');
clientForm.setFieldValue('city', 'Springfield');
clientForm.setFieldValue('state', 'IL');
clientForm.setFieldValue('zipCode', '62701');
clientForm.setFieldValue('isOwn', false);
clientForm.setFieldValue('notes', 'Preferred customer');

// Validate
const validation = clientForm.validateForm();
if (validation.isValid) {
  const savedClient = clientForm.save();
  console.log('Client created:', savedClient.id);
} else {
  console.error('Validation errors:', validation.errors);
}
```

### Editing an Existing Client

```javascript
import ClientForm from './src/forms/ClientForm.js';

// Load existing client for editing
const clientForm = new ClientForm('client-1');

// Get current data
const data = clientForm.getFormData();
console.log('Current name:', data.name);

// Update information
clientForm.setFieldValue('email', 'newemail@example.com');
clientForm.setFieldValue('phone', '555-9876');

// Save changes
const updatedClient = clientForm.save();
console.log('Client updated');
```

### Working with Own Clients

```javascript
import StorageManager from './src/storage/StorageManager.js';

const storage = new StorageManager();

// Get all "own" clients (eligible for 20% discount)
const allClients = storage.getAllClients();
const ownClients = allClients.filter(c => c.isOwn);

console.log('Own clients:');
ownClients.forEach(client => {
  console.log('-', client.name, '(', client.email, ')');
});
```

## Working with Vehicles

### Creating a Vehicle for a Client

```javascript
import VehicleForm from './src/forms/VehicleForm.js';

// Create vehicle for specific client
const vehicleForm = new VehicleForm('client-1');

vehicleForm.setFieldValue('licensePlate', 'ABC-1234');
vehicleForm.setFieldValue('make', 'Toyota');
vehicleForm.setFieldValue('model', 'Camry');
vehicleForm.setFieldValue('year', 2022);
vehicleForm.setFieldValue('color', 'Blue');
vehicleForm.setFieldValue('vin', '1234567890');
vehicleForm.setFieldValue('mileage', 45000);
vehicleForm.setFieldValue('fuelType', 'Gasoline');
vehicleForm.setFieldValue('transmissionType', 'Automatic');

const vehicle = vehicleForm.save();
console.log('Vehicle created:', vehicle.licensePlate);
```

### Getting Vehicles for a Client

```javascript
import StorageManager from './src/storage/StorageManager.js';

const storage = new StorageManager();

// Get all vehicles for a client
const vehicles = storage.getVehiclesByClient('client-1');

console.log('Vehicles for client:');
vehicles.forEach(v => {
  console.log('-', v.year, v.make, v.model, '(' + v.licensePlate + ')');
});
```

## Form Validation

### Understanding Validation Errors

```javascript
import OrderForm from './src/forms/OrderForm.js';

const form = new OrderForm();

// Try to validate incomplete form
const validation = form.validateForm();

console.log('Is valid:', validation.isValid); // false
console.log('Errors:', validation.errors);
// Output: {
//   clientId: 'Client selection is required',
//   vehicleId: 'Vehicle selection is required',
//   status: 'Status is required'
// }
```

### Handling Validation Before Finalize

```javascript
const form = new OrderForm();

// Set basic required fields
form.setClient('client-1');
form.setFieldValue('vehicleId', 'vehicle-1');

// Add at least one line item
form.addLineItem('oil-change', 1, 50);

// Try to schedule without mechanic
form.setFieldValue('status', 'scheduled');
form.setFieldValue('plannedStartDate', '2024-01-15');

try {
  form.finalize(); // Will throw error if validation fails
} catch (error) {
  console.log('Finalize failed:', error.message);
  // Handle the error - show to user
}
```

## Event Handling

### Listening to Field Changes

```javascript
const form = new OrderForm();

form.addEventListener('fieldChanged', (data) => {
  console.log('Field changed:', data.fieldName, '=', data.value);
});

form.setFieldValue('notes', 'Test note');
// Output: Field changed: notes = Test note
```

### Listening to Line Item Changes

```javascript
const form = new OrderForm();
form.setClient('client-1');

form.addEventListener('lineItemAdded', (item) => {
  console.log('Item added:', item.serviceName);
});

form.addEventListener('lineItemRemoved', (item) => {
  console.log('Item removed:', item.serviceName);
});

form.addEventListener('totalsChanged', (totals) => {
  console.log('Totals updated - Grand Total: $' + totals.grandTotal);
});

// Trigger events
form.addLineItem('oil-change', 1, 50);
form.addLineItem('brake-pads', 2, 150);
```

### Listening to Save Events

```javascript
const form = new OrderForm();
form.setClient('client-1');
form.setFieldValue('vehicleId', 'vehicle-1');

form.addEventListener('orderSaved', (order) => {
  console.log('Order saved! Number:', order.number);
});

form.addEventListener('saveError', (data) => {
  console.error('Save failed:', data.error);
});

form.saveDraft();
```

### Form Dirty State

```javascript
const form = new OrderForm();

console.log('Dirty:', form.isDirtyForm()); // false

form.setFieldValue('notes', 'Changed');
console.log('Dirty:', form.isDirtyForm()); // true

form.save();
console.log('Dirty:', form.isDirtyForm()); // false after save
```

## Editing Orders

### Loading and Modifying an Order

```javascript
import OrderForm from './src/forms/OrderForm.js';

// Create and save initial order
const form1 = new OrderForm();
form1.setClient('client-1');
form1.setFieldValue('vehicleId', 'vehicle-1');
form1.addLineItem('oil-change', 1, 50);
const savedOrder = form1.saveDraft();

// Load existing order for editing
const form2 = new OrderForm(savedOrder.id);

// Verify loaded data
const data = form2.getFormData();
console.log('Order #', data.number);
console.log('Client:', data.clientId);
console.log('Status:', data.status);
console.log('Line items:', data.lineItems.length);

// Make changes
form2.addLineItem('brake-pads', 2, 150);
form2.setFieldValue('notes', 'Added brake pad replacement');

// Save changes
const updated = form2.save();
console.log('Order updated');
```

### Canceling Changes

```javascript
const form1 = new OrderForm();
form1.setClient('client-1');
form1.setFieldValue('vehicleId', 'vehicle-1');
form1.addLineItem('oil-change', 1, 50);
const order = form1.saveDraft();

// Load for editing
const form2 = new OrderForm(order.id);

// Make unwanted changes
form2.setClient('client-2');
form2.addLineItem('brake-pads', 2, 150);

console.log('Dirty:', form2.isDirtyForm()); // true

// Cancel - reverts to last saved state
form2.cancel();

const data = form2.getFormData();
console.log('Client restored to:', data.clientId); // client-1
console.log('Line items:', data.lineItems.length); // 1
console.log('Dirty:', form2.isDirtyForm()); // false
```

### Order Number Immutability

```javascript
const form = new OrderForm();
form.setClient('client-1');
form.setFieldValue('vehicleId', 'vehicle-1');

const order1 = form.saveDraft();
const orderNumber = order1.number;

// Edit and save again
form.setFieldValue('notes', 'Updated notes');
const order2 = form.save();

// Order number never changes
console.log('First save number:', orderNumber);
console.log('Second save number:', order2.number);
console.log('Same number:', orderNumber === order2.number); // true
```

## Complete Example Workflow

```javascript
import OrderForm from './src/forms/OrderForm.js';
import ClientForm from './src/forms/ClientForm.js';
import VehicleForm from './src/forms/VehicleForm.js';
import StorageManager from './src/storage/StorageManager.js';

// Step 1: Create a new client
const clientForm = new ClientForm();
clientForm.setFieldValue('name', 'ABC Company');
clientForm.setFieldValue('email', 'contact@abccompany.com');
clientForm.setFieldValue('phone', '555-1234');
clientForm.setFieldValue('isOwn', true); // Own client = 20% discount
const client = clientForm.save();

// Step 2: Create a vehicle for the client
const vehicleForm = new VehicleForm(client.id);
vehicleForm.setFieldValue('licensePlate', 'XYZ-789');
vehicleForm.setFieldValue('make', 'Honda');
vehicleForm.setFieldValue('model', 'Civic');
vehicleForm.setFieldValue('year', 2021);
const vehicle = vehicleForm.save();

// Step 3: Create order
const orderForm = new OrderForm();

// Set basic info
orderForm.setClient(client.id);
orderForm.setFieldValue('vehicleId', vehicle.id);
orderForm.setFieldValue('liftReference', 'Lift-B3');

// Listen to changes
orderForm.addEventListener('totalsChanged', (totals) => {
  console.log('Order total: $' + totals.grandTotal);
});

// Add services
orderForm.addLineItem('oil-change', 1, 75);
orderForm.addLineItem('brake-pads', 2, 200);
orderForm.addLineItem('tire-rotation', 1, 100);

// Add labor
orderForm.addLaborEntry('Full inspection', 2, 75);
orderForm.addLaborEntry('Brake system service', 1.5, 100);

// Add parts
orderForm.addPartEntry('Engine oil (10L)', 1, 60);
orderForm.addPartEntry('Brake cleaner', 2, 20);

// Add scheduling
orderForm.setFieldValue('status', 'scheduled');
orderForm.setFieldValue('mechanicId', 'mech-001');
orderForm.setFieldValue('plannedStartDate', '2024-01-20');
orderForm.setFieldValue('plannedEndDate', '2024-01-21');

// Add notes
orderForm.setFieldValue('notes', 'Comprehensive vehicle service');

// Step 4: Validate and save
const validation = orderForm.validateForm();
if (validation.isValid) {
  const order = orderForm.finalize();
  console.log('Order created:', order.number);
  
  const data = orderForm.getFormData();
  console.log('\nFinal Order Summary:');
  console.log('Order #:', data.number);
  console.log('Client:', client.name);
  console.log('Vehicle:', vehicle.year, vehicle.make, vehicle.model);
  console.log('Subtotal: $' + data.subtotal);
  console.log('Discount (20%): -$' + data.discount);
  console.log('VAT (18%): $' + data.vat);
  console.log('TOTAL: $' + data.grandTotal);
} else {
  console.error('Validation failed:', validation.errors);
}
```

## Tips and Best Practices

1. **Always set client before adding items** - Discount calculation depends on client type
2. **Validate before finalize** - Use `validateForm()` before `finalize()`
3. **Listen to events** - Use event listeners instead of polling for changes
4. **Check dirty state** - Warn users before navigating away if `isDirtyForm()` returns true
5. **Handle save errors** - Always catch and handle potential save errors
6. **Use draft mode** - Save as draft frequently to prevent data loss
7. **Sequential order numbers are immutable** - Never try to modify the order number manually
