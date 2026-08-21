import express from 'express';
import {
  createPlan, listPlans, updatePlan, setPlanStatus,
  subscribe, listMemberships, getCustomerMembership, cancelMembership
} from '../controllers/memberships.Controller.js';
import { requireStaff, canReadWallet } from '../middleware/authGuards.js';

const membershipsRouter = express.Router();
const staff = requireStaff('Café staff access required');

// Literal segments before "/:id" so they are not read as ids.
membershipsRouter.get('/plans', staff, listPlans);
membershipsRouter.post('/plans', staff, createPlan);
membershipsRouter.put('/plans/:id', staff, updatePlan);
membershipsRouter.patch('/plans/:id/status', staff, setPlanStatus);
membershipsRouter.post('/plans/:id/subscribe', staff, subscribe);

membershipsRouter.get('/customer/:customerId', canReadWallet, getCustomerMembership);

membershipsRouter.get('/', staff, listMemberships);
membershipsRouter.post('/:id/cancel', staff, cancelMembership);

export default membershipsRouter;
