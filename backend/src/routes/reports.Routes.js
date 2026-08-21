import express from 'express';
import {
  summary,
  revenue,
  stations,
  hours,
  customers,
  products
} from '../controllers/reports.Controller.js';
import { requirePermission } from '../middleware/authGuards.js';

const reportsRouter = express.Router();

const canRead = requirePermission('reports.view');

reportsRouter.get('/summary', canRead, summary);
reportsRouter.get('/revenue', canRead, revenue);
reportsRouter.get('/stations', canRead, stations);
reportsRouter.get('/hours', canRead, hours);
reportsRouter.get('/customers', canRead, customers);
reportsRouter.get('/products', canRead, products);

export default reportsRouter;
