import express from 'express';
import {
  listZones,
  createZone,
  updateZone,
  deleteZone,
  assignStations
} from '../controllers/floorZones.Controller.js';
import { requireStaff, requirePermission } from '../middleware/authGuards.js';

const floorZonesRouter = express.Router();

// Anyone who can see the floor can see how it is divided up.
floorZonesRouter.get('/', requireStaff('Café staff access required'), listZones);

// Rearranging it is a manager's job.
const canEdit = requirePermission('floor.layout');

// Literal path before "/:id", or "assign" would be read as an id.
floorZonesRouter.put('/assign', canEdit, assignStations);

floorZonesRouter.post('/', canEdit, createZone);
floorZonesRouter.put('/:id', canEdit, updateZone);
floorZonesRouter.delete('/:id', canEdit, deleteZone);

export default floorZonesRouter;
