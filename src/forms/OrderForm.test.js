import { test } from 'node:test';
import assert from 'node:assert';
import OrderForm from './OrderForm.js';

test('OrderForm - Initialization', async (t) => {
  await t.test('should initialize new order form', () => {
    const form = new OrderForm();
    const data = form.getFormData();

    assert.strictEqual(data.status, 'draft');
    assert.strictEqual(data.lineItems.length, 0);
    assert.strictEqual(data.laborEntries.length, 0);
    assert.strictEqual(data.partEntries.length, 0);
    assert.strictEqual(data.grandTotal, 0);
  });

  await t.test('should track dirty state', () => {
    const form = new OrderForm();
    assert(!form.isDirtyForm());

    form.setFieldValue('notes', 'Test notes');
    assert(form.isDirtyForm());
  });
});

test('OrderForm - Field management', async (t) => {
  await t.test('should set field values', () => {
    const form = new OrderForm();
    form.setFieldValue('status', 'scheduled');
    form.setFieldValue('mechanicId', 'mech-1');

    const data = form.getFormData();
    assert.strictEqual(data.status, 'scheduled');
    assert.strictEqual(data.mechanicId, 'mech-1');
  });

  await t.test('should trigger field changed listener', () => {
    const form = new OrderForm();
    let eventFired = false;

    form.addEventListener('fieldChanged', (data) => {
      eventFired = true;
      assert.strictEqual(data.fieldName, 'notes');
    });

    form.setFieldValue('notes', 'Test');
    assert(eventFired);
  });
});

test('OrderForm - Client management', async (t) => {
  await t.test('should set client and trigger recalculation', () => {
    const form = new OrderForm();
    let totalsChanged = false;

    form.addEventListener('totalsChanged', () => {
      totalsChanged = true;
    });

    form.setClient('client-2'); // own client
    assert.strictEqual(form.formData.clientId, 'client-2');
    assert(form.formData.client);
    assert(form.formData.client.isOwn);
  });

  await t.test('should get clients list', () => {
    const form = new OrderForm();
    const clients = form.getClients();
    assert(Array.isArray(clients));
    assert(clients.length > 0);
  });
});

test('OrderForm - Line items', async (t) => {
  await t.test('should add line item', () => {
    const form = new OrderForm();
    const item = form.addLineItem('oil-change', 1, 50);

    assert(item.id);
    assert.strictEqual(item.serviceId, 'oil-change');
    assert.strictEqual(item.quantity, 1);
    assert.strictEqual(item.unitPrice, 50);

    const lineItems = form.getLineItems();
    assert.strictEqual(lineItems.length, 1);
  });

  await t.test('should update line item', () => {
    const form = new OrderForm();
    const item = form.addLineItem('oil-change', 1, 50);

    form.updateLineItem(item.id, { quantity: 2 });
    const updated = form.getLineItems()[0];
    assert.strictEqual(updated.quantity, 2);
  });

  await t.test('should remove line item', () => {
    const form = new OrderForm();
    const item = form.addLineItem('oil-change', 1, 50);

    form.removeLineItem(item.id);
    assert.strictEqual(form.getLineItems().length, 0);
  });

  await t.test('should trigger lineItemAdded listener', () => {
    const form = new OrderForm();
    let eventFired = false;

    form.addEventListener('lineItemAdded', (item) => {
      eventFired = true;
      assert.strictEqual(item.serviceId, 'oil-change');
    });

    form.addLineItem('oil-change', 1, 50);
    assert(eventFired);
  });

  await t.test('should validate line items', () => {
    const form = new OrderForm();
    assert.throws(() => {
      form.addLineItem('oil-change', 0, 50); // invalid quantity
    });
  });
});

test('OrderForm - Labor entries', async (t) => {
  await t.test('should add labor entry', () => {
    const form = new OrderForm();
    const labor = form.addLaborEntry('Engine inspection', 2, 75);

    assert(labor.id);
    assert.strictEqual(labor.description, 'Engine inspection');
    assert.strictEqual(labor.hours, 2);
    assert.strictEqual(labor.hourlyRate, 75);
    assert.strictEqual(labor.total, 150);
  });

  await t.test('should update labor entry', () => {
    const form = new OrderForm();
    const labor = form.addLaborEntry('Engine inspection', 2, 75);

    form.updateLaborEntry(labor.id, { hours: 3 });
    const updated = form.getLaborEntries()[0];
    assert.strictEqual(updated.hours, 3);
    assert.strictEqual(updated.total, 225);
  });

  await t.test('should remove labor entry', () => {
    const form = new OrderForm();
    const labor = form.addLaborEntry('Engine inspection', 2, 75);

    form.removeLaborEntry(labor.id);
    assert.strictEqual(form.getLaborEntries().length, 0);
  });
});

test('OrderForm - Part entries', async (t) => {
  await t.test('should add part entry', () => {
    const form = new OrderForm();
    const part = form.addPartEntry('Brake fluid', 2, 25);

    assert(part.id);
    assert.strictEqual(part.partName, 'Brake fluid');
    assert.strictEqual(part.quantity, 2);
    assert.strictEqual(part.unitPrice, 25);
    assert.strictEqual(part.total, 50);
  });

  await t.test('should update part entry', () => {
    const form = new OrderForm();
    const part = form.addPartEntry('Brake fluid', 2, 25);

    form.updatePartEntry(part.id, { quantity: 3 });
    const updated = form.getPartEntries()[0];
    assert.strictEqual(updated.quantity, 3);
  });

  await t.test('should remove part entry', () => {
    const form = new OrderForm();
    const part = form.addPartEntry('Brake fluid', 2, 25);

    form.removePartEntry(part.id);
    assert.strictEqual(form.getPartEntries().length, 0);
  });
});

test('OrderForm - Totals calculation', async (t) => {
  await t.test('should calculate totals with regular client', () => {
    const form = new OrderForm();
    form.setClient('client-1'); // regular client
    form.addLineItem('oil-change', 1, 100);

    const data = form.getFormData();
    assert.strictEqual(data.subtotal, 100);
    assert.strictEqual(data.discount, 0);
    assert.strictEqual(data.vat, 18);
    assert.strictEqual(data.grandTotal, 118);
  });

  await t.test('should calculate totals with own client discount', () => {
    const form = new OrderForm();
    form.setClient('client-2'); // own client
    form.addLineItem('oil-change', 1, 100);

    const data = form.getFormData();
    assert.strictEqual(data.subtotal, 100);
    assert.strictEqual(data.discount, 20); // 20% discount
    assert.strictEqual(data.subtotalAfterDiscount, 80);
    assert.strictEqual(data.vat, 14.4); // 18% of 80
    assert.strictEqual(data.grandTotal, 94.4);
  });

  await t.test('should trigger totalsChanged listener', () => {
    const form = new OrderForm();
    let eventFired = false;

    form.addEventListener('totalsChanged', (totals) => {
      eventFired = true;
      assert(totals.grandTotal !== undefined);
    });

    form.addLineItem('oil-change', 1, 100);
    assert(eventFired);
  });
});

test('OrderForm - Validation', async (t) => {
  await t.test('should validate form', () => {
    const form = new OrderForm();
    const validation = form.validateForm();
    assert(!validation.isValid);
    assert(validation.errors.clientId);
  });

  await t.test('should pass validation with required fields', () => {
    const form = new OrderForm();
    form.setClient('client-1');
    form.setFieldValue('vehicleId', 'vehicle-1');
    form.setFieldValue('status', 'draft');

    const validation = form.validateForm();
    assert(validation.isValid);
  });

  await t.test('should get validation errors', () => {
    const form = new OrderForm();
    form.validateForm();
    const errors = form.getValidationErrors();
    assert(Object.keys(errors).length > 0);
  });
});

test('OrderForm - Save and load', async (t) => {
  await t.test('should save order as draft', () => {
    const form = new OrderForm();
    form.setClient('client-1');
    form.setFieldValue('vehicleId', 'vehicle-1');
    form.addLineItem('oil-change', 1, 50);

    let saved = false;
    form.addEventListener('orderSaved', () => {
      saved = true;
    });

    const order = form.saveDraft();
    assert(order.id);
    assert(order.number);
    assert.strictEqual(order.status, 'draft');
    assert(saved);
  });

  await t.test('should load existing order', () => {
    const form1 = new OrderForm();
    form1.setClient('client-1');
    form1.setFieldValue('vehicleId', 'vehicle-1');
    form1.addLineItem('oil-change', 1, 50);
    const order = form1.saveDraft();

    const form2 = new OrderForm(order.id);
    const data = form2.getFormData();
    assert.strictEqual(data.clientId, 'client-1');
    assert.strictEqual(data.lineItems.length, 1);
  });
});

test('OrderForm - Order number immutability', async (t) => {
  await t.test('should assign order number on first save', () => {
    const form = new OrderForm();
    form.setClient('client-1');
    form.setFieldValue('vehicleId', 'vehicle-1');

    const order1 = form.saveDraft();
    const firstNumber = order1.number;
    assert(firstNumber);

    // Update and save again
    form.setFieldValue('notes', 'Updated notes');
    const order2 = form.save();

    // Number should not change
    assert.strictEqual(order2.number, firstNumber);
  });
});

test('OrderForm - Cancel editing', async (t) => {
  await t.test('should reset form on cancel for new order', () => {
    const form = new OrderForm();
    form.setClient('client-1');
    form.addLineItem('oil-change', 1, 50);

    form.cancel();
    const data = form.getFormData();
    assert(!data.clientId);
    assert.strictEqual(data.lineItems.length, 0);
  });

  await t.test('should restore original data on cancel for existing order', () => {
    const form1 = new OrderForm();
    form1.setClient('client-1');
    form1.setFieldValue('vehicleId', 'vehicle-1');
    const order = form1.saveDraft();

    const form2 = new OrderForm(order.id);
    form2.setClient('client-2');
    form2.cancel();

    const data = form2.getFormData();
    assert.strictEqual(data.clientId, 'client-1');
  });
});
