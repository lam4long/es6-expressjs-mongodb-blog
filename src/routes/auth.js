import express from 'express';

import {
	login,
	loginValidator,
	register,
	registerValidator,
} from '../controllers/AuthController';
import auth from '../middlewares/auth';

const authRouter = express.Router();

authRouter.post('/register', registerValidator, register);
authRouter.post('/login', loginValidator, login);
authRouter.get('/profile', auth, async (req, res) => {
	res.send(req.user.toProfileJSON());
});

export default authRouter;
