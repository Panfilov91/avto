import { test } from 'node:test';
import assert from 'node:assert';
import FormValidationService from './FormValidationService.js';

test('FormValidationService - Order form validation', async (t) => {
  await t.test('should validate complete order form', () => {
    const formData = {
      clientId: 'client-1',
      vehicleId: 'vehicle-1',
      status: 'draft',
      lineItems: [],
    };

    const validation = FormValidationService.validateOrderForm(formData);
    assert(validation.isValid);
  });

  await t.test('should require client ID', () => {
    const formData = {
      vehicleId: 'vehicle-1',
      status: 'draft',
      lineItems: [],
    };

    const validation = FormValidationService.validateOrderForm(formData);
    assert(!validation.isValid);
    assert(validation.errors.clientId);
  });

  await t.test('should require vehicle ID', () => {
    const formData = {
      clientId: 'client-1',
      status: 'draft',
      lineItems: [],
    };

    const validation = FormValidationService.validateOrderForm(formData);
    assert(!validation.isValid);
    assert(validation.errors.vehicleId);
  });

  await t.test('should require status', () => {
    const formData = {
      clientId: 'client-1',
      vehicleId: 'vehicle-1',
      lineItems: [],
    };

    const validation = FormValidationService.validateOrderForm(formData);
    assert(!validation.isValid);
    assert(validation.errors.status);
  });

  await t.test('should require mechanic for non-draft orders', () => {
    const formData = {
      clientId: 'client-1',
      vehicleId: 'vehicle-1',
      status: 'scheduled',
      lineItems: [{ id: '1' }],
    };

    const validation = FormValidationService.validateOrderForm(formData);
    assert(!validation.isValid);
    assert(validation.errors.mechanicId);
  });

  await t.test('should allow draft without mechanic', () => {
    const formData = {
      clientId: 'client-1',
      vehicleId: 'vehicle-1',
      status: 'draft',
      lineItems: [],
    };

    const validation = FormValidationService.validateOrderForm(formData);
    assert(validation.isValid);
  });

  await t.test('should require planned date for scheduled orders', () => {
    const formData = {
      clientId: 'client-1',
      vehicleId: 'vehicle-1',
      status: 'scheduled',
      mechanicId: 'mech-1',
      lineItems: [{ id: '1' }],
    };

    const validation = FormValidationService.validateOrderForm(formData);
    assert(!validation.isValid);
    assert(validation.errors.plannedStartDate);
  });
});

test('FormValidationService - Client form validation', async (t) => {
  await t.test('should validate complete client form', () => {
    const clientData = {
      name: 'John Doe',
      email: 'john@example.com',
      phone: '123-456-7890',
    };

    const validation = FormValidationService.validateClientForm(clientData);
    assert(validation.isValid);
  });

  await t.test('should require name', () => {
    const clientData = {
      email: 'john@example.com',
      phone: '123-456-7890',
    };

    const validation = FormValidationService.validateClientForm(clientData);
    assert(!validation.isValid);
    assert(validation.errors.name);
  });

  await t.test('should require valid email', () => {
    const clientData = {
      name: 'John Doe',
      email: 'invalid-email',
      phone: '123-456-7890',
    };

    const validation = FormValidationService.validateClientForm(clientData);
    assert(!validation.isValid);
    assert(validation.errors.email);
  });

  await t.test('should require phone', () => {
    const clientData = {
      name: 'John Doe',
      email: 'john@example.com',
    };

    const validation = FormValidationService.validateClientForm(clientData);
    assert(!validation.isValid);
    assert(validation.errors.phone);
  });
});

test('FormValidationService - Vehicle form validation', async (t) => {
  await t.test('should validate complete vehicle form', () => {
    const vehicleData = {
      licensePlate: 'ABC123',
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
    };

    const validation = FormValidationService.validateVehicleForm(vehicleData);
    assert(validation.isValid);
  });

  await t.test('should require license plate', () => {
    const vehicleData = {
      make: 'Toyota',
      model: 'Camry',
      year: 2022,
    };

    const validation = FormValidationService.validateVehicleForm(vehicleData);
    assert(!validation.isValid);
    assert(validation.errors.licensePlate);
  });

  await t.test('should require make', () => {
    const vehicleData = {
      licensePlate: 'ABC123',
      model: 'Camry',
      year: 2022,
    };

    const validation = FormValidationService.validateVehicleForm(vehicleData);
    assert(!validation.isValid);
    assert(validation.errors.make);
  });

  await t.test('should require model', () => {
    const vehicleData = {
      licensePlate: 'ABC123',
      make: 'Toyota',
      year: 2022,
    };

    const validation = FormValidationService.validateVehicleForm(vehicleData);
    assert(!validation.isValid);
    assert(validation.errors.model);
  });

  await t.test('should validate year', () => {
    const vehicleData = {
      licensePlate: 'ABC123',
      make: 'Toyota',
      model: 'Camry',
      year: 1800,
    };

    const validation = FormValidationService.validateVehicleForm(vehicleData);
    assert(!validation.isValid);
    assert(validation.errors.year);
  });
});

test('FormValidationService - Email validation', async (t) => {
  await t.test('should accept valid emails', () => {
    assert(FormValidationService.isValidEmail('test@example.com'));
    assert(FormValidationService.isValidEmail('user.name@domain.co.uk'));
  });

  await t.test('should reject invalid emails', () => {
    assert(!FormValidationService.isValidEmail('invalid-email'));
    assert(!FormValidationService.isValidEmail('missing@domain'));
    assert(!FormValidationService.isValidEmail('test@.com'));
  });
});

test('FormValidationService - Line item validation', async (t) => {
  await t.test('should validate valid line item', () => {
    const item = {
      serviceId: 'service-1',
      quantity: 2,
      unitPrice: 50,
    };

    const validation = FormValidationService.validateLineItem(item);
    assert(validation.isValid);
  });

  await t.test('should reject without service ID', () => {
    const item = {
      quantity: 2,
      unitPrice: 50,
    };

    const validation = FormValidationService.validateLineItem(item);
    assert(!validation.isValid);
    assert(validation.errors.length > 0);
  });
});

test('FormValidationService - Labor entry validation', async (t) => {
  await t.test('should validate valid labor entry', () => {
    const labor = {
      description: 'Oil change',
      hours: 2,
      hourlyRate: 50,
    };

    const validation = FormValidationService.validateLaborEntry(labor);
    assert(validation.isValid);
  });

  await t.test('should require description', () => {
    const labor = {
      hours: 2,
      hourlyRate: 50,
    };

    const validation = FormValidationService.validateLaborEntry(labor);
    assert(!validation.isValid);
    assert(validation.errors.description);
  });

  await t.test('should require valid hours', () => {
    const labor = {
      description: 'Oil change',
      hours: 0,
      hourlyRate: 50,
    };

    const validation = FormValidationService.validateLaborEntry(labor);
    assert(!validation.isValid);
    assert(validation.errors.hours);
  });
});
