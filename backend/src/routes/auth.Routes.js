import express from 'express';
import { register, login, getAllUsers } from '../controllers/auth.Controller.js';
import { registerValidation, loginValidation } from '../utils/validation.js';
import { validate } from '../middleware/validationMiddleware.js';

const AuthRouter = express.Router();

AuthRouter.post('/register', registerValidation, validate, register);
AuthRouter.post('/login', loginValidation, validate, login);
AuthRouter.get('/users', getAllUsers);

export default AuthRouter;