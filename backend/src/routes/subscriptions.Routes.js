import express from 'express';
import { 
  createSubscription,
  getAllSubscriptions,
  getSubscriptionById,
  deleteSubscription,
  deleteExpiredSubscriptions
} from '../controllers/subscriptions.Controller.js';

const subscriptionsRouter = express.Router();


subscriptionsRouter.post('/', createSubscription);
subscriptionsRouter.get('/', getAllSubscriptions);
subscriptionsRouter.get('/:id', getSubscriptionById);
subscriptionsRouter.delete('/:id', deleteSubscription);
subscriptionsRouter.delete('/expired/cleanup', deleteExpiredSubscriptions);

export default subscriptionsRouter;