import express from 'express';

import {
	changePassword,
	login,
	logout,
	refreshAccessToken,
	register,
} from '../controllers/AuthController';
import auth from '../middlewares/auth';
import {
	changePasswordValidator,
	loginValidator,
	refreshTokenValidator,
	registerValidator,
} from '../validators/auth';

const authRouter = express.Router();

authRouter.post('/register', registerValidator, register);
authRouter.post('/login', loginValidator, login);

authRouter.put(
	'/changePassword',
	[auth.required, changePasswordValidator],
	changePassword,
);
authRouter.post('/token', refreshTokenValidator, refreshAccessToken);
authRouter.delete('/logout', auth.required, logout);

export default authRouter;
