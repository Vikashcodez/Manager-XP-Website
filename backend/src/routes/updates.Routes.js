import express from 'express';
import { checkForUpdate, reportUpdateState } from '../controllers/updates.Controller.js';

const router = express.Router();

/* ==========================================================================
   UPDATE CHECK  (licence-authenticated, no session)

   A café's console calls these on behalf of its stations. There is no bearer
   token because the caller is a desktop app on a café's LAN, not a browser
   session — the licence key is the credential, exactly as it is for
   activation.

   Note what is not here: no endpoint that lets a caller state what version it
   is entitled to. It may report what it is running; the entitlement decision
   is made server-side from the licence and subscription.
   ========================================================================== */
router.post('/check', checkForUpdate);
router.post('/report', reportUpdateState);

export default router;
