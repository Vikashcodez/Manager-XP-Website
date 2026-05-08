import express from 'express';
import { register, login } from '../controllers/customer.Controller.js';

const customerRouter = express.Router();

customerRouter.post('/register', register);
customerRouter.post('/login', login);

export default customerRouter;