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

const router = express.Router();

router.post('/register', registerValidator, register);
router.post('/login', loginValidator, login);
router.get('/profile', auth, async (req, res) => {
	res.send(req.user);
});
router.post('/logout', auth, logout);
router.post('/logoutall', auth, logoutAll);

export default router;

