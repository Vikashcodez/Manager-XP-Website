import express from 'express';
import {
  listGames, getGame, createGame, updateGame, deleteGame,
  listPcGames, setPcGames
} from '../controllers/games.Controller.js';
import { requireStaff } from '../middleware/authGuards.js';

/*
 * The Game Library is a café's own inventory, so every route is staff-scoped —
 * `requireStaff` puts the café on req.actor and the controller confirms each
 * game belongs to it before touching anything.
 */
const gamesRouter = express.Router();
const staff = requireStaff('Café staff access required');

// PC ↔ game mapping first: its paths are more specific than /:id.
gamesRouter.get('/pc/:pcId', staff, listPcGames);
gamesRouter.put('/pc/:pcId', staff, setPcGames);

gamesRouter.get('/', staff, listGames);
gamesRouter.post('/', staff, createGame);
gamesRouter.get('/:id', staff, getGame);
gamesRouter.patch('/:id', staff, updateGame);
gamesRouter.delete('/:id', staff, deleteGame);

export default gamesRouter;
