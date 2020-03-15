import express from 'express';
import { 
	register,
	registerValidator,
} from '../controllers/AuthController';

const router = express.Router();

router.post('/register', registerValidator, register);

export default router;

