import express from 'express';
import {
  createSubscriptionPlan,
  getAllSubscriptionPlans,
  getSubscriptionPlanById,
  updateSubscriptionPlan,
  deleteSubscriptionPlan
} from '../controllers/subscriptionPlan.Controller.js';

const subscriptionPlanRouter = express.Router();


subscriptionPlanRouter.post('/subscription-plans', createSubscriptionPlan);
subscriptionPlanRouter.get('/subscription-plans', getAllSubscriptionPlans);
subscriptionPlanRouter.get('/subscription-plans/:id', getSubscriptionPlanById);
subscriptionPlanRouter.put('/subscription-plans/:id', updateSubscriptionPlan);
subscriptionPlanRouter.delete('/subscription-plans/:id', deleteSubscriptionPlan);

export default subscriptionPlanRouter;