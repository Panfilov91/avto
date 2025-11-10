import { test } from 'node:test';
import assert from 'node:assert';
import OrderCalculationService from './OrderCalculationService.js';

test('OrderCalculationService - Subtotal calculation', async (t) => {
  await t.test('should calculate subtotal correctly', () => {
    const lineItems = [
      { quantity: 2, unitPrice: 50 },
      { quantity: 1, unitPrice: 150 },
    ];

    const subtotal = OrderCalculationService.calculateSubtotal(lineItems);
    assert.strictEqual(subtotal, 250);
  });

  await t.test('should return 0 for empty line items', () => {
    const subtotal = OrderCalculationService.calculateSubtotal([]);
    assert.strictEqual(subtotal, 0);
  });
});

test('OrderCalculationService - Discount calculation', async (t) => {
  await t.test('should apply 20% discount for own clients', () => {
    const client = { isOwn: true };
    const subtotal = 100;

    const discount = OrderCalculationService.calculateDiscount(subtotal, client);
    assert.strictEqual(discount, 20);
  });

  await t.test('should not apply discount for regular clients', () => {
    const client = { isOwn: false };
    const subtotal = 100;

    const discount = OrderCalculationService.calculateDiscount(subtotal, client);
    assert.strictEqual(discount, 0);
  });

  await t.test('should apply manual discount', () => {
    const client = { isOwn: false };
    const subtotal = 100;
    const manualDiscount = 15;

    const discount = OrderCalculationService.calculateDiscount(subtotal, client, manualDiscount);
    assert.strictEqual(discount, 15);
  });

  await t.test('should combine automatic and manual discounts', () => {
    const client = { isOwn: true };
    const subtotal = 100;
    const manualDiscount = 10;

    const discount = OrderCalculationService.calculateDiscount(subtotal, client, manualDiscount);
    assert.strictEqual(discount, 30); // 20 (automatic) + 10 (manual)
  });
});

test('OrderCalculationService - VAT calculation', async (t) => {
  await t.test('should calculate 18% VAT correctly', () => {
    const subtotal = 100;
    const vat = OrderCalculationService.calculateVAT(subtotal);
    assert.strictEqual(vat, 18);
  });

  await t.test('should handle decimal values correctly', () => {
    const subtotal = 50.50;
    const vat = OrderCalculationService.calculateVAT(subtotal);
    assert.strictEqual(vat, 9.09);
  });
});

test('OrderCalculationService - Complete totals calculation', async (t) => {
  await t.test('should calculate all totals correctly for own client', () => {
    const order = { manualDiscount: 0 };
    const lineItems = [{ quantity: 2, unitPrice: 100 }];
    const client = { isOwn: true };

    const totals = OrderCalculationService.calculateTotals(order, lineItems, client);

    assert.strictEqual(totals.subtotal, 200);
    assert.strictEqual(totals.discount, 40); // 20% of 200
    assert.strictEqual(totals.subtotalAfterDiscount, 160);
    assert.strictEqual(totals.vat, 28.8); // 18% of 160
    assert.strictEqual(totals.grandTotal, 188.8);
  });

  await t.test('should calculate all totals correctly for regular client', () => {
    const order = { manualDiscount: 0 };
    const lineItems = [{ quantity: 2, unitPrice: 100 }];
    const client = { isOwn: false };

    const totals = OrderCalculationService.calculateTotals(order, lineItems, client);

    assert.strictEqual(totals.subtotal, 200);
    assert.strictEqual(totals.discount, 0);
    assert.strictEqual(totals.subtotalAfterDiscount, 200);
    assert.strictEqual(totals.vat, 36); // 18% of 200
    assert.strictEqual(totals.grandTotal, 236);
  });

  await t.test('should handle decimal rounding correctly', () => {
    const order = { manualDiscount: 0 };
    const lineItems = [{ quantity: 3, unitPrice: 33.33 }];
    const client = { isOwn: false };

    const totals = OrderCalculationService.calculateTotals(order, lineItems, client);

    // Should round to 2 decimals
    assert.strictEqual(totals.subtotal, 99.99);
    assert.strictEqual(typeof totals.vat, 'number');
  });
});

test('OrderCalculationService - Rounding', async (t) => {
  await t.test('should round to two decimal places', () => {
    const value = 10.4567;
    const rounded = OrderCalculationService.roundToTwoDecimals(value);
    assert.strictEqual(rounded, 10.46);
  });

  await t.test('should handle exact two decimals', () => {
    const value = 10.45;
    const rounded = OrderCalculationService.roundToTwoDecimals(value);
    assert.strictEqual(rounded, 10.45);
  });
});

test('OrderCalculationService - Line item validation', async (t) => {
  await t.test('should validate valid line item', () => {
    const item = {
      serviceId: 'service-1',
      quantity: 2,
      unitPrice: 50,
    };

    const validation = OrderCalculationService.validateLineItem(item);
    assert(validation.isValid);
    assert.strictEqual(validation.errors.length, 0);
  });

  await t.test('should reject invalid quantity', () => {
    const item = {
      serviceId: 'service-1',
      quantity: 0,
      unitPrice: 50,
    };

    const validation = OrderCalculationService.validateLineItem(item);
    assert(!validation.isValid);
    assert(validation.errors.length > 0);
  });

  await t.test('should reject missing service ID', () => {
    const item = {
      quantity: 1,
      unitPrice: 50,
    };

    const validation = OrderCalculationService.validateLineItem(item);
    assert(!validation.isValid);
    assert(validation.errors.some(err => err.includes('Service')));
  });
});

test('OrderCalculationService - Labor cost calculation', async (t) => {
  await t.test('should calculate labor cost correctly', () => {
    const cost = OrderCalculationService.calculateLaborCost(5, 50);
    assert.strictEqual(cost, 250);
  });

  await t.test('should handle decimal hours', () => {
    const cost = OrderCalculationService.calculateLaborCost(2.5, 100);
    assert.strictEqual(cost, 250);
  });
});

test('OrderCalculationService - Parts cost calculation', async (t) => {
  await t.test('should calculate parts cost correctly', () => {
    const parts = [
      { quantity: 2, unitPrice: 50 },
      { quantity: 1, unitPrice: 100 },
    ];

    const cost = OrderCalculationService.calculatePartsCost(parts);
    assert.strictEqual(cost, 200);
  });
});
