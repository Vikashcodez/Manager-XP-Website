import express from 'express';
import {
  listCodes,
  validateCode,
  createCode,
  setCodeStatus,
  deleteCode,
  listRedemptions
} from '../controllers/discounts.Controller.js';
import { requireStaff, requirePermission } from '../middleware/authGuards.js';

const discountsRouter = express.Router();

const staff = requireStaff('Café staff access required');
const canManage = requirePermission('discounts.manage');

// A cashier needs to check a code without being able to invent one.
discountsRouter.post('/validate', staff, validateCode);
discountsRouter.get('/', staff, listCodes);

discountsRouter.post('/', canManage, createCode);
discountsRouter.get('/:id/redemptions', canManage, listRedemptions);
discountsRouter.patch('/:id/status', canManage, setCodeStatus);
discountsRouter.delete('/:id', canManage, deleteCode);

export default discountsRouter;
