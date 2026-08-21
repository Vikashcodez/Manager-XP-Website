import express from 'express';
import { register, login, getAllUsers, verifyToken, verify } from '../controllers/auth.Controller.js';
import { signin } from '../controllers/signin.Controller.js';
import { requirePlatformAdmin } from '../middleware/authGuards.js';
import { registerValidation, loginValidation } from '../utils/validation.js';
import { validate } from '../middleware/validationMiddleware.js';

const AuthRouter = express.Router();

AuthRouter.post('/register', registerValidation, validate, register);
AuthRouter.post('/login', loginValidation, validate, login);
/*
 * The single door: administrators and café owners sign in here and the server
 * works out which they are. /login stays for the desktop apps and anything
 * else already pointed at it.
 */
AuthRouter.post('/signin', loginValidation, validate, signin);
AuthRouter.post('/verify-token', verifyToken);
AuthRouter.post('/verify', verify);
/*
 * Every account's name, email, phone and address. This was reachable with no
 * token at all — a full customer list for anyone who found the URL. It is a
 * platform-admin view, so it is guarded as one.
 */
AuthRouter.get('/users', requirePlatformAdmin, getAllUsers);

export default AuthRouter;