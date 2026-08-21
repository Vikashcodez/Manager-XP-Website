import express from 'express';
import {
  ingest,
  latest,
  history,
  alerts,
  clearStation
} from '../controllers/telemetry.Controller.js';
import { requireStaff, requirePermission } from '../middleware/authGuards.js';

const telemetryRouter = express.Router();

const staff = requireStaff('Café staff access required');

// The admin console relays what its stations report.
telemetryRouter.post('/', staff, ingest);

// Literal paths before "/:pcName".
telemetryRouter.get('/latest', requirePermission('telemetry.view'), latest);
telemetryRouter.get('/alerts', requirePermission('telemetry.view'), alerts);
telemetryRouter.get('/history/:pcName', requirePermission('telemetry.view'), history);

// Wiping a station's history is a management action, not a viewing one.
telemetryRouter.delete('/:pcName', requirePermission('floor.layout'), clearStation);

export default telemetryRouter;
