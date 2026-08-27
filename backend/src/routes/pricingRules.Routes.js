import express from 'express';
import {
  listRules,
  createRule,
  updateRule,
  deleteRule,
  previewRates
} from '../controllers/pricingRules.Controller.js';
import { requireStaff } from '../middleware/authGuards.js';

const pricingRulesRouter = express.Router();
const staff = requireStaff('Café staff access required');

// Literal segment first, so "preview" is never read as a rule id.
pricingRulesRouter.get('/preview', staff, previewRates);

pricingRulesRouter.get('/', staff, listRules);
pricingRulesRouter.post('/', staff, createRule);
pricingRulesRouter.put('/:id', staff, updateRule);
pricingRulesRouter.delete('/:id', staff, deleteRule);

export default pricingRulesRouter;
