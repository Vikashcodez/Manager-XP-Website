import express from 'express';
import {
  placeOrder, listOrders, listCustomerOrders, setOrderStatus
} from '../controllers/orders.Controller.js';
import { requireStaff, requireAuth, canReadWallet } from '../middleware/authGuards.js';

const ordersRouter = express.Router();
const staff = requireStaff('Café staff access required');

// Customers place their own orders from the station.
ordersRouter.post('/', requireAuth, placeOrder);
ordersRouter.get('/customer/:customerId', canReadWallet, listCustomerOrders);

ordersRouter.get('/', staff, listOrders);
ordersRouter.patch('/:id/status', staff, setOrderStatus);

export default ordersRouter;
