import express from 'express';
import {
  getProviderCatalogue, listGateways, saveGateway, testGateway, deleteGateway,
  listTopups, getTopupOptions, createTopupOrder, verifyTopup, myTopups, handleWebhook,
  renderCheckoutPage, completeCheckout,
  requestCashTopup, approveCashTopup, rejectCashTopup, listPendingTopups
} from '../controllers/payments.Controller.js';
import { requireAuth, requirePermission } from '../middleware/authGuards.js';

/* ==========================================================================
   WEBHOOKS

   Exported separately because of where it has to be mounted. Every provider
   signs the exact bytes it sent, so the handler needs the raw body — but
   server.js installs express.json() globally before its routes, and once that
   has consumed the stream the original bytes are gone. Re-serialising the
   parsed object produces different ones (key order, whitespace, number
   formatting), so the signature would never match and every genuine payment
   would be rejected as forged.

   server.js therefore mounts this router ahead of express.json().

   No auth guard: the signature IS the authentication. A caller without the
   café's webhook secret cannot produce a body that verifies.
   ========================================================================== */
export const webhookRouter = express.Router();

webhookRouter.post('/webhook/:provider',
  express.raw({ type: '*/*', limit: '1mb' }),
  handleWebhook
);

const router = express.Router();

/* ==========================================================================
   HOSTED CHECKOUT

   No auth guard by design: the nonce in the path is the credential. It is 24
   random bytes, single-use, and expires in 30 minutes — a bearer token here
   would have to travel in the URL, which is worse in every way.
   ========================================================================== */
router.get('/checkout/:nonce', renderCheckoutPage);
router.post('/checkout/:nonce/complete', completeCheckout);

/* ==========================================================================
   ADMIN — gateway configuration

   Credentials are the keys to the café's merchant account, so viewing and
   changing them are separate permissions: a manager can be shown that
   Razorpay is live without being able to point it somewhere else.
   ========================================================================== */
router.get('/providers', requirePermission('payments.gateway.view'), getProviderCatalogue);
router.get('/gateways', requirePermission('payments.gateway.view'), listGateways);
router.put('/gateways/:provider', requirePermission('payments.gateway.manage'), saveGateway);
router.post('/gateways/:provider/test', requirePermission('payments.gateway.manage'), testGateway);
router.delete('/gateways/:provider', requirePermission('payments.gateway.manage'), deleteGateway);

router.get('/topups', requirePermission('payments.topup.view'), listTopups);

/* Cash approvals. Separated from the gateway permissions because this is
   counter work, not configuration: a cashier confirms the notes arrived
   without being able to see or change where card money lands. */
router.get('/topups/pending', requirePermission('payments.topup.view'), listPendingTopups);
router.post('/topups/:id/approve', requirePermission('payments.topup.approve'), approveCashTopup);
router.post('/topups/:id/reject', requirePermission('payments.topup.approve'), rejectCashTopup);

/* ==========================================================================
   CUSTOMER — self-service top-up

   requireAuth, then the controller takes the customer from the token. These
   routes never read a customer id from the body, so a valid token cannot be
   used to fund somebody else's wallet.
   ========================================================================== */
router.get('/topup/options', requireAuth, getTopupOptions);
router.get('/topup/mine', requireAuth, myTopups);
router.post('/topup/order', requireAuth, createTopupOrder);
router.post('/topup/cash', requireAuth, requestCashTopup);
router.post('/topup/verify', requireAuth, verifyTopup);

export default router;
