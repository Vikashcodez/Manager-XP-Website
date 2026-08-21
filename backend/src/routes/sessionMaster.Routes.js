import express from 'express';
import {
  createSession,
  listSessions,
  getSessionById,
  updateSession,
  setSessionStatus,
  deleteSession
} from '../controllers/sessionMaster.Controller.js';
import { requireStaff } from '../middleware/authGuards.js';

const sessionMasterRouter = express.Router();

// Master data — staff only.
const staff = requireStaff('Café staff access required');

sessionMasterRouter.get('/', staff, listSessions);
sessionMasterRouter.post('/', staff, createSession);
sessionMasterRouter.get('/:id', staff, getSessionById);
sessionMasterRouter.put('/:id', staff, updateSession);
sessionMasterRouter.patch('/:id/status', staff, setSessionStatus);
sessionMasterRouter.delete('/:id', staff, deleteSession);

export default sessionMasterRouter;
