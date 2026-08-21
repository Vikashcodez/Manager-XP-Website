import express from 'express';
import {
  getWallet,
  getTransactions,
  creditWallet,
  debitWallet
} from '../controllers/wallet.Controller.js';
import { canReadWallet, canMoveMoney } from '../middleware/authGuards.js';

const walletRouter = express.Router();

// Customers read their own wallet; staff can read any.
walletRouter.get('/customer/:customerId', canReadWallet, getWallet);
walletRouter.get('/customer/:customerId/transactions', canReadWallet, getTransactions);

// Money only moves on a staff token.
walletRouter.post('/customer/:customerId/credit', canMoveMoney, creditWallet);
walletRouter.post('/customer/:customerId/debit', canMoveMoney, debitWallet);

export default walletRouter;
