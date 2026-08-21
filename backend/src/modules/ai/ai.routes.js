import express from 'express';
import { askController, healthController, suggestionsController } from './ai.controller.js';
import { requirePermission } from '../../middleware/authGuards.js';

const aiRouter = express.Router();

/*
 * CafeXP AI sits behind its own permission rather than riding on reports.view.
 *
 * The AI reaches across revenue, sessions, stations, F&B, customers and
 * payments in a single question. A cashier who may see the till should not
 * gain the café's full trading picture simply because an AI endpoint exists —
 * which is exactly what would happen if this were guarded by requireStaff.
 *
 * Every route is read-only. There is no write endpoint in this module, and the
 * tool layer contains no statement that is not a SELECT.
 */
const canAsk = requirePermission('ai.ask');

aiRouter.get('/health', canAsk, healthController);
aiRouter.get('/suggestions', canAsk, suggestionsController);
aiRouter.post('/ask', canAsk, askController);

export default aiRouter;
