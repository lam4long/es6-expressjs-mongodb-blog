import express from 'express';

import {
	findUser,
	followUser,
	getProfile,
	unfollowUser,
} from '../controllers/ProfileController';
import auth from '../middlewares/auth';

const profileRouter = express.Router();

profileRouter.get('/', auth, getProfile);
profileRouter.get('/:userId', auth, findUser); // set auth optional
profileRouter.post('/:userId/follow', auth, followUser);
profileRouter.delete('/:userId/follow', auth, unfollowUser);

export default profileRouter;
