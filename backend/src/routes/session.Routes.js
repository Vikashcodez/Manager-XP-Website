import express from 'express';
import {
  startSession,
  listSessions,
  getSession,
  pauseSession,
  resumeSession,
  extendSession,
  transferSession,
  endSession,
  cancelSession,
  getDefaults
} from '../controllers/session.Controller.js';
import { requireStaff } from '../middleware/authGuards.js';

const sessionRouter = express.Router();

// Sessions are a staff surface end to end — the client learns about its own
// session from the admin over the existing WebSocket, not from here.
const staff = requireStaff('Café staff access required');

sessionRouter.get('/defaults', staff, getDefaults);
sessionRouter.get('/', staff, listSessions);
sessionRouter.post('/', staff, startSession);
sessionRouter.get('/:id', staff, getSession);
sessionRouter.post('/:id/pause', staff, pauseSession);
sessionRouter.post('/:id/resume', staff, resumeSession);
sessionRouter.post('/:id/extend', staff, extendSession);
sessionRouter.post('/:id/transfer', staff, transferSession);
sessionRouter.post('/:id/end', staff, endSession);

/* Started by mistake. Records who and when, releases the station, charges
   nothing — and never removes the row. */
sessionRouter.post('/:id/cancel', staff, cancelSession);

export default sessionRouter;
