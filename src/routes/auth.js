import express from 'express';
import {
	register,
	registerValidator,
	loginValidator,
	login,
	logout,
	logoutAll,
} from '../controllers/AuthController';
import auth from '../middlewares/auth';

const authRouter = express.Router();

authRouter.post('/register', registerValidator, register);
authRouter.post('/login', loginValidator, login);
authRouter.get('/profile', auth, async (req, res) => {
	res.send(req.user.toProfileJSON());
});

export default authRouter;
