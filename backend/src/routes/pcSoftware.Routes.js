import express from 'express';
import {
  getAllPcSoftware,
  getPcSoftwareById,
  getSoftwareByPcId,
  createPcSoftware,
  updatePcSoftware,
  deletePcSoftware,
  togglePcSoftwareStatus
} from '../controllers/pcSoftware.controller.js';

const pcSoftwareRouter = express.Router();


pcSoftwareRouter.get('/', getAllPcSoftware);
pcSoftwareRouter.post('/', createPcSoftware);
pcSoftwareRouter.get('/pc/:pcId', getSoftwareByPcId);
pcSoftwareRouter.get('/:id', getPcSoftwareById);
pcSoftwareRouter.put('/:id', updatePcSoftware);
pcSoftwareRouter.delete('/:id', deletePcSoftware);
pcSoftwareRouter.patch('/:id/toggle-status', togglePcSoftwareStatus);

export default pcSoftwareRouter;