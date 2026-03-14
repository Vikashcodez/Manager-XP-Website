import express from 'express';
import { register, login } from '../controllers/auth.Controller.js';
import { registerValidation, loginValidation } from '../utils/validation.js';
import { validate } from '../middleware/validationMiddleware.js';

const AuthRouter = express.Router();

AuthRouter.post('/register', registerValidation, validate, register);
AuthRouter.post('/login', loginValidation, validate, login);

export default AuthRouter;