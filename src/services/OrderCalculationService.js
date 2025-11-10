/**
 * OrderCalculationService - Handles calculations for order totals, discounts, and VAT
 */
class OrderCalculationService {
  // Constants
  static VAT_RATE = 0.18; // 18% VAT
  static OWN_CLIENT_DISCOUNT_RATE = 0.20; // 20% for own clients

  /**
   * Calculate order totals
   * @param {Object} order - Order data
   * @param {Array} lineItems - Order line items
   * @param {Object} client - Client information
   * @returns {Object} - Calculated totals
   */
  static calculateTotals(order, lineItems, client) {
    const subtotal = this.calculateSubtotal(lineItems);
    const discount = this.calculateDiscount(subtotal, client, order.manualDiscount);
    const subtotalAfterDiscount = subtotal - discount;
    const vat = this.calculateVAT(subtotalAfterDiscount);
    const grandTotal = subtotalAfterDiscount + vat;

    return {
      subtotal: this.roundToTwoDecimals(subtotal),
      discount: this.roundToTwoDecimals(discount),
      subtotalAfterDiscount: this.roundToTwoDecimals(subtotalAfterDiscount),
      vat: this.roundToTwoDecimals(vat),
      grandTotal: this.roundToTwoDecimals(grandTotal),
      discountPercent: order.discountPercent || (client?.isOwn ? 20 : 0),
    };
  }

  /**
   * Calculate subtotal from line items
   */
  static calculateSubtotal(lineItems) {
    return lineItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  }

  /**
   * Calculate discount amount
   */
  static calculateDiscount(subtotal, client, manualDiscount = 0) {
    let discount = 0;

    // Apply automatic 20% discount for "own" clients
    if (client?.isOwn) {
      discount = subtotal * this.OWN_CLIENT_DISCOUNT_RATE;
    }

    // Add manual discount if provided
    if (manualDiscount > 0) {
      discount += manualDiscount;
    }

    return discount;
  }

  /**
   * Calculate VAT (18%)
   */
  static calculateVAT(subtotalAfterDiscount) {
    return subtotalAfterDiscount * this.VAT_RATE;
  }

  /**
   * Round to two decimal places
   */
  static roundToTwoDecimals(value) {
    return Math.round(value * 100) / 100;
  }

  /**
   * Validate line item
   */
  static validateLineItem(item) {
    const errors = [];

    if (!item.serviceId) {
      errors.push('Service is required');
    }

    if (!item.quantity || item.quantity <= 0) {
      errors.push('Quantity must be greater than 0');
    }

    if (!item.unitPrice || item.unitPrice < 0) {
      errors.push('Unit price must be non-negative');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  /**
   * Calculate labor cost
   */
  static calculateLaborCost(laborHours, hourlyRate) {
    return laborHours * hourlyRate;
  }

  /**
   * Calculate parts cost (shorthand for subtotal of parts)
   */
  static calculatePartsCost(partItems) {
    return partItems.reduce((total, item) => {
      return total + (item.quantity * item.unitPrice);
    }, 0);
  }
}

export default OrderCalculationService;
