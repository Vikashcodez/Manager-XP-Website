import express from 'express';
import { listActions, authorisePower } from '../controllers/stationPower.Controller.js';
import { requirePermission } from '../middleware/authGuards.js';

const stationPowerRouter = express.Router();

const canPower = requirePermission('station.power');

stationPowerRouter.get('/power/actions', canPower, listActions);
stationPowerRouter.post('/power', canPower, authorisePower);

export default stationPowerRouter;
