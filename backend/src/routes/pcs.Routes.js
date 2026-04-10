import express from 'express';
import {
  getAllPCs,
  getPCById,
  createPC,
  updatePC,
  deletePC,
  restorePC,
  getPCsByBranch,
  getActivePCs
} from '../controllers/pcs.Controller.js';

const pcsRouter = express.Router();


pcsRouter.get('/', getAllPCs);
pcsRouter.get('/active', getActivePCs);
pcsRouter.get('/branch/:branchId', getPCsByBranch);
pcsRouter.get('/:id', getPCById);
pcsRouter.post('/', createPC);
pcsRouter.put('/:id', updatePC);
pcsRouter.delete('/:id', deletePC);
pcsRouter.patch('/:id/restore', restorePC);

export default pcsRouter;