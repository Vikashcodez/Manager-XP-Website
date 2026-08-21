import express from 'express';
import {
  createPrice,
  listPrices,
  lookupPrice,
  getPriceById,
  updatePrice,
  setPriceStatus,
  deletePrice,
  priceMatrix
} from '../controllers/gamingPrice.Controller.js';
import { requireStaff } from '../middleware/authGuards.js';

const gamingPriceRouter = express.Router();

const staff = requireStaff('Café staff access required');

// Literal paths must be declared before "/:id", or Express would treat
// "lookup" and "matrix" as ids.
gamingPriceRouter.get('/lookup', staff, lookupPrice);
gamingPriceRouter.get('/matrix', staff, priceMatrix);

gamingPriceRouter.get('/', staff, listPrices);
gamingPriceRouter.post('/', staff, createPrice);
gamingPriceRouter.get('/:id', staff, getPriceById);
gamingPriceRouter.put('/:id', staff, updatePrice);
gamingPriceRouter.patch('/:id/status', staff, setPriceStatus);
gamingPriceRouter.delete('/:id', staff, deletePrice);

export default gamingPriceRouter;
