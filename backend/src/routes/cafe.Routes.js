// cafeRoutes.js
import express from 'express';
import {
  createCafe,
  updateCafe,
  deleteCafe,
  getAllCafes,
  getCafeById
} from '../controllers/cafe.Controller.js';

const cafeRouter = express.Router();

cafeRouter.post('/', createCafe);
cafeRouter.put('/:cafe_id', updateCafe);
cafeRouter.delete('/:cafe_id', deleteCafe);
cafeRouter.get('/', getAllCafes);
cafeRouter.get('/:cafe_id', getCafeById);

export default cafeRouter;