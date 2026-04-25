import express from 'express';
import {
  upload,
  createSoftware,
  getAllSoftware,
  getSoftwareById,
  updateSoftware,
  deleteSoftware,
  permanentDeleteSoftware
} from '../controllers/softwareMaster.Controller.js';

const softwareMasterRouter = express.Router();

// Routes
softwareMasterRouter.post('/', upload, createSoftware);
softwareMasterRouter.get('/', getAllSoftware);
softwareMasterRouter.get('/:id', getSoftwareById);
softwareMasterRouter.put('/:id', upload, updateSoftware);
softwareMasterRouter.delete('/:id', deleteSoftware);
softwareMasterRouter.delete('/permanent/:id', permanentDeleteSoftware);

export default softwareMasterRouter;