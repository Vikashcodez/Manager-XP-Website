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
softwareMasterRouter.post('/software', upload, createSoftware);
softwareMasterRouter.get('/software', getAllSoftware);
softwareMasterRouter.get('/software/:id', getSoftwareById);
softwareMasterRouter.put('/software/:id', upload, updateSoftware);
softwareMasterRouter.delete('/software/:id', deleteSoftware);
softwareMasterRouter.delete('/software/permanent/:id', permanentDeleteSoftware);

export default softwareMasterRouter;