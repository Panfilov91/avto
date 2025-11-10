import { test } from 'node:test';
import assert from 'node:assert';
import OrderForm from './forms/OrderForm.js';
import ClientForm from './forms/ClientForm.js';
import VehicleForm from './forms/VehicleForm.js';
import StorageManager from './storage/StorageManager.js';

test('Integration - Complete Order Workflow', async (t) => {
  await t.test('should create complete order with all features', () => {
    // Use fresh storage with unique test client
    const storage = new StorageManager();
    
    // Create test client to ensure clean state
    const testClient = storage.saveClient({
      name: 'Integration Test Client',
      email: 'test-' + Date.now() + '@example.com',
      phone: '555-0123',
      isOwn: true,
    });

    // Create test vehicle
    const testVehicle = storage.saveVehicle({
      clientId: testClient.id,
      licensePlate: 'INT-' + Date.now(),
      make: 'Toyota',
      model: 'Test',
      year: 2022,
    });

    // Create order
    const orderForm = new OrderForm();

    // Verify events work
    let totalsChangedCount = 0;
    orderForm.addEventListener('totalsChanged', () => {
      totalsChangedCount++;
    });

    orderForm.setClient(testClient.id);
    orderForm.setFieldValue('vehicleId', testVehicle.id);
    orderForm.setFieldValue('liftReference', 'Lift-A1');

    // Add multiple line items
    const item1 = orderForm.addLineItem('oil-change', 1, 100);
    const item2 = orderForm.addLineItem('brake-pads', 2, 150);

    assert.strictEqual(orderForm.getLineItems().length, 2);

    // Add labor entries
    const labor1 = orderForm.addLaborEntry('Inspection', 2, 75);
    const labor2 = orderForm.addLaborEntry('Maintenance', 1, 100);

    assert.strictEqual(orderForm.getLaborEntries().length, 2);

    // Add part entries
    const part1 = orderForm.addPartEntry('Oil filter', 1, 20);
    const part2 = orderForm.addPartEntry('Brake fluid', 2, 25);

    assert.strictEqual(orderForm.getPartEntries().length, 2);

    // Verify totals calculation with own client discount
    let data = orderForm.getFormData();
    assert.strictEqual(data.subtotal, 720); // 100 + 300 + 150 + 100 + 20 + 50
    assert.strictEqual(data.discount, 144); // 20% of 720
    assert.strictEqual(data.subtotalAfterDiscount, 576);
    assert.strictEqual(data.vat, 103.68); // 18% of 576
    assert.strictEqual(data.grandTotal, 679.68);

    // Verify totals changed event fired
    assert(totalsChangedCount > 0);

    // Add scheduling
    orderForm.setFieldValue('status', 'scheduled');
    orderForm.setFieldValue('mechanicId', 'mech-001');
    orderForm.setFieldValue('plannedStartDate', '2024-01-15');
    orderForm.setFieldValue('notes', 'Comprehensive service');

    // Save order
    let orderSaved = false;
    orderForm.addEventListener('orderSaved', () => {
      orderSaved = true;
    });

    const savedOrder = orderForm.finalize();
    assert(orderSaved);
    assert(savedOrder.id);
    assert(savedOrder.number);
    assert.strictEqual(savedOrder.status, 'scheduled');
  });

  await t.test('should load and edit existing order', () => {
    const storage = new StorageManager();
    
    // Create unique test client and vehicle
    const testClient = storage.saveClient({
      name: 'Edit Test Client - ' + Date.now(),
      email: 'edit-test-' + Date.now() + '@example.com',
      phone: '555-9876',
      isOwn: false,
    });

    const testVehicle = storage.saveVehicle({
      clientId: testClient.id,
      licensePlate: 'EDIT-' + Date.now(),
      make: 'Honda',
      model: 'Test',
      year: 2020,
    });

    // Create initial order
    const form1 = new OrderForm();
    form1.setClient(testClient.id);
    form1.setFieldValue('vehicleId', testVehicle.id);
    form1.addLineItem('oil-change', 1, 50);
    const order = form1.saveDraft();

    const initialNumber = order.number;

    // Load for editing
    const form2 = new OrderForm(order.id);
    const data1 = form2.getFormData();

    assert.strictEqual(data1.clientId, testClient.id);
    assert.strictEqual(data1.number, initialNumber);

    // Make changes
    form2.addLineItem('brake-pads', 2, 150);
    form2.setFieldValue('notes', 'Added brake pads');

    const editedOrder = form2.save();
    assert.strictEqual(editedOrder.number, initialNumber); // number unchanged
    assert.strictEqual(editedOrder.lineItems.length, 2); // both items saved

    // Verify changes persisted
    const form3 = new OrderForm(order.id);
    const data2 = form3.getFormData();

    assert.strictEqual(data2.lineItems.length, 2);
    assert.strictEqual(data2.notes, 'Added brake pads');
  });

  await t.test('should handle discount calculations correctly', () => {
    // Regular client
    const regularForm = new OrderForm();
    regularForm.setClient('client-1'); // not an own client
    regularForm.addLineItem('oil-change', 1, 200);

    let data = regularForm.getFormData();
    assert.strictEqual(data.subtotal, 200);
    assert.strictEqual(data.discount, 0);
    assert.strictEqual(data.vat, 36); // 18% of 200
    assert.strictEqual(data.grandTotal, 236);

    // Own client with automatic 20% discount
    const ownForm = new OrderForm();
    ownForm.setClient('client-2'); // is an own client
    ownForm.addLineItem('oil-change', 1, 200);

    data = ownForm.getFormData();
    assert.strictEqual(data.subtotal, 200);
    assert.strictEqual(data.discount, 40); // 20% of 200
    assert.strictEqual(data.subtotalAfterDiscount, 160);
    assert.strictEqual(data.vat, 28.8); // 18% of 160
    assert.strictEqual(data.grandTotal, 188.8);
  });

  await t.test('should handle form validation', () => {
    const form = new OrderForm();

    // Invalid form
    let validation = form.validateForm();
    assert(!validation.isValid);

    // Add required fields
    form.setClient('client-1');
    form.setFieldValue('vehicleId', 'vehicle-1');
    form.setFieldValue('status', 'draft');

    validation = form.validateForm();
    assert(validation.isValid);

    // Set to scheduled without mechanic
    form.setFieldValue('status', 'scheduled');
    validation = form.validateForm();
    assert(!validation.isValid);
    assert(validation.errors.mechanicId);
  });

  await t.test('should cancel and restore form state', () => {
    const storage = new StorageManager();
    
    // Create unique test client and vehicle
    const testClient1 = storage.saveClient({
      name: 'Cancel Test Client 1 - ' + Date.now(),
      email: 'cancel-test-1-' + Date.now() + '@example.com',
      phone: '555-1111',
      isOwn: false,
    });

    const testClient2 = storage.saveClient({
      name: 'Cancel Test Client 2 - ' + Date.now(),
      email: 'cancel-test-2-' + Date.now() + '@example.com',
      phone: '555-2222',
      isOwn: false,
    });

    const testVehicle = storage.saveVehicle({
      clientId: testClient1.id,
      licensePlate: 'CANCEL-' + Date.now(),
      make: 'Ford',
      model: 'Test',
      year: 2019,
    });

    // Create and save order
    const form1 = new OrderForm();
    form1.setClient(testClient1.id);
    form1.setFieldValue('vehicleId', testVehicle.id);
    form1.addLineItem('oil-change', 1, 50);
    const order = form1.saveDraft();

    // Load for editing
    const form2 = new OrderForm(order.id);

    // Verify initial state
    let data = form2.getFormData();
    assert.strictEqual(data.clientId, testClient1.id);
    assert.strictEqual(data.lineItems.length, 1);

    // Make changes
    form2.setClient(testClient2.id);
    form2.addLineItem('brake-pads', 2, 150);

    assert(form2.isDirtyForm());

    // Cancel
    form2.cancel();

    // Verify restored to previous state
    data = form2.getFormData();
    assert.strictEqual(data.clientId, testClient1.id);
    assert.strictEqual(data.lineItems.length, 1);
    assert(!form2.isDirtyForm());
  });

  await t.test('should manage service catalog', () => {
    const storage = new StorageManager();

    // Get default services
    const allServices = storage.getAllServices();
    assert(allServices.length > 0);

    // Get by ID
    const oilChange = storage.getService('oil-change');
    assert(oilChange);
    assert.strictEqual(oilChange.name, 'Oil Change');

    // Get by category
    const maintenance = storage.getServicesByCategory('maintenance');
    assert(maintenance.length > 0);

    // Add new service
    const newService = storage.addServiceToCatalog({
      name: 'Custom Service',
      unitPrice: 500,
      category: 'custom',
    });

    assert(newService.id);
    const retrieved = storage.getService(newService.id);
    assert.strictEqual(retrieved.name, 'Custom Service');
  });

  await t.test('should track multiple orders with sequential numbers', () => {
    const storage = new StorageManager();

    // Create multiple orders
    const form1 = new OrderForm();
    form1.setClient('client-1');
    form1.setFieldValue('vehicleId', 'vehicle-1');
    const order1 = form1.saveDraft();

    const form2 = new OrderForm();
    form2.setClient('client-1');
    form2.setFieldValue('vehicleId', 'vehicle-1');
    const order2 = form2.saveDraft();

    const form3 = new OrderForm();
    form3.setClient('client-1');
    form3.setFieldValue('vehicleId', 'vehicle-1');
    const order3 = form3.saveDraft();

    // Verify sequential numbers
    const num1 = parseInt(order1.number);
    const num2 = parseInt(order2.number);
    const num3 = parseInt(order3.number);

    assert(num2 > num1);
    assert(num3 > num2);
    assert.strictEqual(num2, num1 + 1);
    assert.strictEqual(num3, num2 + 1);

    // Get all orders
    const allOrders = storage.getAllOrders();
    assert(allOrders.length >= 3);
  });
});
