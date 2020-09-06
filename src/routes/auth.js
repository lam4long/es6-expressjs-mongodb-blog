import express from 'express';

import {
	login,
	loginValidator,
	register,
	registerValidator,
} from '../controllers/AuthController';

const authRouter = express.Router();

authRouter.post('/register', registerValidator, register);
authRouter.post('/login', loginValidator, login);

// TODO add update password

// TODO add refresh token

export default authRouter;
