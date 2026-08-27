import express from 'express';
import {
  register,
  login,
  createCustomer,
  getCustomers,
  getCustomerById,
  setCustomerTier,
  getCustomerCredit
} from '../controllers/customer.Controller.js';
import { requireStaff, requirePermission } from '../middleware/authGuards.js';
import { loginLimiter } from '../middleware/rateLimit.js';

const customerRouter = express.Router();

// Public: the client app registers and signs customers in. The login limiter
// counts only failed attempts, so a busy café's successful sign-ins — many
// from one IP — are never throttled; only a run of failures is.
customerRouter.post('/register', register);
customerRouter.post('/login', loginLimiter, login);

// Staff only: these return other people's contact details.
customerRouter.post('/', requirePermission('customers.manage'), createCustomer);
customerRouter.get('/', requireStaff('Café staff access required'), getCustomers);
customerRouter.get('/:id', requireStaff('Café staff access required'), getCustomerById);

/* What they owe and what is left of their limit — read by the till before it
   offers to put a ticket on their tab. */
customerRouter.get('/:id/credit', requireStaff('Café staff access required'), getCustomerCredit);

/* Making somebody a regular grants a standing discount and the right to owe
   the café money, so it needs the same permission as managing customers
   rather than merely being staff. */
customerRouter.patch('/:id/tier', requirePermission('customers.manage'), setCustomerTier);

export default customerRouter;
