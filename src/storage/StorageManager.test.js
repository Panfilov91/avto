import { test } from 'node:test';
import assert from 'node:assert';
import StorageManager from './StorageManager.js';

test('StorageManager - Order operations', async (t) => {
  const manager = new StorageManager();

  await t.test('should save and retrieve order', () => {
    const order = {
      clientId: 'client-1',
      vehicleId: 'vehicle-1',
      status: 'draft',
      lineItems: [],
    };

    const saved = manager.saveOrder(order);
    assert(saved.id);
    assert(saved.number);
    assert.strictEqual(saved.number, '00000001');

    const retrieved = manager.getOrder(saved.id);
    assert.strictEqual(retrieved.clientId, 'client-1');
  });

  await t.test('should generate sequential order numbers', () => {
    const order1 = manager.saveOrder({ status: 'draft', lineItems: [] });
    const order2 = manager.saveOrder({ status: 'draft', lineItems: [] });

    assert.strictEqual(order1.number, '00000002');
    assert.strictEqual(order2.number, '00000003');
  });

  await t.test('should get all orders', () => {
    const allOrders = manager.getAllOrders();
    assert(Array.isArray(allOrders));
    assert(allOrders.length > 0);
  });

  await t.test('should delete order', () => {
    const order = manager.saveOrder({ status: 'draft', lineItems: [] });
    const deleted = manager.deleteOrder(order.id);
    assert(deleted);

    const retrieved = manager.getOrder(order.id);
    assert(!retrieved);
  });
});

test('StorageManager - Client operations', async (t) => {
  const manager = new StorageManager();

  await t.test('should save and retrieve client', () => {
    const client = {
      name: 'Test Client',
      email: 'test@example.com',
      phone: '123-456-7890',
      isOwn: false,
    };

    const saved = manager.saveClient(client);
    assert(saved.id);

    const retrieved = manager.getClient(saved.id);
    assert.strictEqual(retrieved.name, 'Test Client');
  });

  await t.test('should get all clients', () => {
    const allClients = manager.getAllClients();
    assert(Array.isArray(allClients));
    assert(allClients.length > 0);
  });
});

test('StorageManager - Vehicle operations', async (t) => {
  const manager = new StorageManager();
  const client = manager.saveClient({ name: 'Test', email: 'test@example.com', phone: '123' });

  await t.test('should save and retrieve vehicle', () => {
    const vehicle = {
      clientId: client.id,
      licensePlate: 'ABC123',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
    };

    const saved = manager.saveVehicle(vehicle);
    assert(saved.id);

    const retrieved = manager.getVehicle(saved.id);
    assert.strictEqual(retrieved.licensePlate, 'ABC123');
  });

  await t.test('should get vehicles by client', () => {
    const vehicles = manager.getVehiclesByClient(client.id);
    assert(Array.isArray(vehicles));
    assert(vehicles.length > 0);
  });
});

test('StorageManager - Service catalog operations', async (t) => {
  const manager = new StorageManager();

  await t.test('should get all services', () => {
    const services = manager.getAllServices();
    assert(Array.isArray(services));
    assert(services.length > 0);
  });

  await t.test('should get service by ID', () => {
    const service = manager.getService('oil-change');
    assert(service);
    assert.strictEqual(service.name, 'Oil Change');
  });

  await t.test('should get services by category', () => {
    const services = manager.getServicesByCategory('maintenance');
    assert(Array.isArray(services));
    assert(services.length > 0);
  });

  await t.test('should add service to catalog', () => {
    const newService = {
      name: 'Custom Service',
      unitPrice: 250,
      category: 'custom',
    };

    const saved = manager.addServiceToCatalog(newService);
    assert(saved.id);

    const retrieved = manager.getService(saved.id);
    assert.strictEqual(retrieved.name, 'Custom Service');
  });
});
