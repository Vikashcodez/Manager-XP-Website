import express from 'express';
import {
  getAllPCs,
  getPCById,
  createPC,
  updatePC,
  deletePC,
  restorePC,
  getPCsByBranch,
  getActivePCs,
  getPCsByCafe,
  checkPCExists,
  registerDiscoveredPC
} from '../controllers/pcs.Controller.js';

const pcsRouter = express.Router();


pcsRouter.get('/', getAllPCs);
pcsRouter.get('/active', getActivePCs);
pcsRouter.get('/branch/:branchId', getPCsByBranch);
pcsRouter.get('/:id', getPCById);
pcsRouter.get('/cafe/:cafeId', getPCsByCafe);
pcsRouter.post('/', createPC);
pcsRouter.post('/check-exists', checkPCExists);
pcsRouter.post('/register-discovered', registerDiscoveredPC);
pcsRouter.put('/:id', updatePC);
pcsRouter.delete('/:id', deletePC);
pcsRouter.patch('/:id/restore', restorePC);
export default pcsRouter;