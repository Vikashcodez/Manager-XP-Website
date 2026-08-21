import express from 'express';
import {
  createBill,
  listBills,
  getBill,
  listCustomerBills,
  addItem,
  removeItem,
  applyAdjustment,
  recordPayment,
  voidBill,
  applyDiscountCode,
  removeDiscountCode,
  refundBill,   // superseded by createRefund; kept exported for reference
  claimBill
} from '../controllers/billing.Controller.js';
import {
  createRefund, getRefundable, listBillRefunds
} from '../controllers/refunds.Controller.js';
import { requireStaff, requireAuth, canReadWallet, requirePermission } from '../middleware/authGuards.js';

const billingRouter = express.Router();

const staff = requireStaff('Café staff access required');

// Customers read their own bills; canReadWallet already enforces
// "own record, or any if staff" against :customerId.
billingRouter.get('/customer/:customerId', canReadWallet, listCustomerBills);

billingRouter.get('/', staff, listBills);
billingRouter.post('/', staff, createBill);

// A customer may open their own bill, so this one is not staff-only —
// the controller checks ownership.
billingRouter.get('/:id', requireAuth, getBill);

billingRouter.post('/:id/items', staff, addItem);
billingRouter.delete('/:id/items/:itemId', staff, removeItem);
billingRouter.patch('/:id/discount', staff, applyAdjustment);
billingRouter.post('/:id/discount-code', staff, applyDiscountCode);
billingRouter.delete('/:id/discount-code', staff, removeDiscountCode);
billingRouter.post('/:id/payments', staff, recordPayment);
// Returning money is at least as sensitive as voiding, so it has its own key.
/*
 * Refunds.
 *
 * Same route as before, upgraded handler. createRefund is a superset of the
 * old refundBill: it still accepts { amount, method, reason } for a
 * whole-bill refund, and additionally accepts selected items with quantities.
 * Keeping the path means the existing Billing page keeps working while the
 * itemised UI is built.
 */
billingRouter.post('/:id/refund', requirePermission('billing.refund'), createRefund);

// What can still be refunded, per line. Read-only, so it rides on billing.view
// rather than requiring refund permission just to look.
billingRouter.get('/:billId/refundable', requirePermission('billing.view'), getRefundable);
billingRouter.get('/:billId/refunds', requirePermission('billing.view'), listBillRefunds);
billingRouter.patch('/:id/customer', staff, claimBill);
billingRouter.post('/:id/void', staff, voidBill);

export default billingRouter;
