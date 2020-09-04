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

export default authRouter;
