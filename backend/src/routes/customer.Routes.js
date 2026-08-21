import express from 'express';
import {
  register,
  login,
  createCustomer,
  getCustomers,
  getCustomerById
} from '../controllers/customer.Controller.js';
import { requireStaff, requirePermission } from '../middleware/authGuards.js';

const customerRouter = express.Router();

// Public: the client app registers and signs customers in.
customerRouter.post('/register', register);
customerRouter.post('/login', login);

// Staff only: these return other people's contact details.
customerRouter.post('/', requirePermission('customers.manage'), createCustomer);
customerRouter.get('/', requireStaff('Café staff access required'), getCustomers);
customerRouter.get('/:id', requireStaff('Café staff access required'), getCustomerById);

export default customerRouter;
