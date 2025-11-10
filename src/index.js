/**
 * Order Management System - Main entry point
 * Exports all public APIs for order creation and management
 */

export { default as StorageManager } from './storage/StorageManager.js';
export { default as OrderCalculationService } from './services/OrderCalculationService.js';
export { default as FormValidationService } from './services/FormValidationService.js';
export { default as OrderForm } from './forms/OrderForm.js';
export { default as ClientForm } from './forms/ClientForm.js';
export { default as VehicleForm } from './forms/VehicleForm.js';
