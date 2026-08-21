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
import { requireStaff } from '../middleware/authGuards.js';

const pcsRouter = express.Router();

/*
 * Every route here was previously open: anyone who could reach the port could
 * delete a station. The mutating ones are now staff-only, which also means the
 * audit trail can name who did it instead of recording "System".
 *
 * The reads are left open deliberately — the admin console and the discovery
 * flow both poll them before a token is necessarily in hand, and they expose
 * nothing beyond the café's own machine names.
 */
const staff = requireStaff('Café staff access required');

pcsRouter.get('/', getAllPCs);
pcsRouter.get('/active', getActivePCs);
pcsRouter.get('/branch/:branchId', getPCsByBranch);
pcsRouter.get('/:id', getPCById);
pcsRouter.get('/cafe/:cafeId', getPCsByCafe);

// check-exists only answers "is this MAC known", and the discovery listener
// calls it as stations announce themselves, so it stays open.
pcsRouter.post('/check-exists', checkPCExists);

pcsRouter.post('/', staff, createPC);
pcsRouter.post('/register-discovered', staff, registerDiscoveredPC);
pcsRouter.put('/:id', staff, updatePC);
pcsRouter.delete('/:id', staff, deletePC);
pcsRouter.patch('/:id/restore', staff, restorePC);

export default pcsRouter;
