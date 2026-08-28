import express from 'express';
import {
  browseCatalog, listGames, addGame, updateCafeGame, removeGame,
  listPcGames, setPcGames
} from '../controllers/games.Controller.js';
import {
  listAccounts, createAccount, updateAccount, deleteAccount
} from '../controllers/gameAccounts.Controller.js';
import { requireStaff } from '../middleware/authGuards.js';

/*
 * A café's Game Library. Every route is staff-scoped — `requireStaff` puts
 * the café on req.actor and the controller confirms each row belongs to it
 * before touching anything.
 *
 * There is no icon upload and no App ID/executable field here on purpose:
 * those live only in ManagerXP's master catalog. A café browses it, picks a
 * title, chooses how customers get into it, and that's the whole of what
 * it's allowed to configure — plus its own venue account pool, which is
 * café-owned data, not catalog data.
 */
const gamesRouter = express.Router();
const staff = requireStaff('Café staff access required');

// More specific paths before /:id.
gamesRouter.get('/catalog', staff, browseCatalog);
gamesRouter.get('/pc/:pcId', staff, listPcGames);
gamesRouter.put('/pc/:pcId', staff, setPcGames);

// A platform's venue account pool. Scoped by game_platform_id, not by the
// café's cafe_games row, since accounts are café-owned data independent of
// whether the game happens to be enabled right now.
gamesRouter.get('/platforms/:platformId/accounts', staff, listAccounts);
gamesRouter.post('/platforms/:platformId/accounts', staff, createAccount);
gamesRouter.patch('/platforms/:platformId/accounts/:accountId', staff, updateAccount);
gamesRouter.delete('/platforms/:platformId/accounts/:accountId', staff, deleteAccount);

gamesRouter.get('/', staff, listGames);
gamesRouter.post('/', staff, addGame);
gamesRouter.patch('/:id', staff, updateCafeGame);
gamesRouter.delete('/:id', staff, removeGame);

export default gamesRouter;
