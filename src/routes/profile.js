import express from 'express';

import {
	followUser,
	getProfile,
	getProfileByUserId,
	unfollowUser,
} from '../controllers/ProfileController';
import auth from '../middlewares/auth';

const profileRouter = express.Router();

profileRouter.get('/', auth, getProfile);
profileRouter.get('/:userId', getProfileByUserId);
profileRouter.post('/:userId/follow', auth, followUser);
profileRouter.delete('/:userId/follow', auth, unfollowUser);

export default profileRouter;
