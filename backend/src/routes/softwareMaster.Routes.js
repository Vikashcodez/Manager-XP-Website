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
import { requireAuth, requirePlatformAdmin } from '../middleware/authGuards.js';

const softwareMasterRouter = express.Router();

/*
 * The gaming software catalogue — the titles ManagerXP publishes, with their
 * artwork and trailers. A café's console picks from this list when it links a
 * game to a station, and the station shows the artwork to the player.
 *
 * Every route here was previously unauthenticated, including the permanent
 * delete. Anyone who could reach the server could upload a 50 MB file or erase
 * the catalogue every café reads from. The split now is:
 *
 *   READ   any signed-in principal. The café console and its stations need
 *          the catalogue to work, and a game's name and cover art are not a
 *          secret — they are published to be seen.
 *
 *   WRITE  ManagerXP administrators only. This is one shared catalogue across
 *          every customer, so a café editing it would be editing every other
 *          café's library too.
 */
softwareMasterRouter.get('/', requireAuth, getAllSoftware);
softwareMasterRouter.get('/:id', requireAuth, getSoftwareById);

softwareMasterRouter.post('/', requirePlatformAdmin, upload, createSoftware);
softwareMasterRouter.put('/:id', requirePlatformAdmin, upload, updateSoftware);

/* Deactivates — the title stops being offered but the row survives, so a
   station that still has it linked does not lose its artwork. */
softwareMasterRouter.delete('/:id', requirePlatformAdmin, deleteSoftware);

/* Actually destroys the row and its uploaded files. Kept separate from the
   soft delete precisely because it cannot be undone. */
softwareMasterRouter.delete('/permanent/:id', requirePlatformAdmin, permanentDeleteSoftware);

export default softwareMasterRouter;
