import express from 'express';

import {
	findUser,
	followUser,
	getProfile,
	unfollowUser,
} from '../controllers/ProfileController';
import auth from '../middlewares/auth';

const profileRouter = express.Router();

profileRouter.get('/', auth.required, getProfile);
profileRouter.get('/:userId', auth.optional, findUser); // set auth optional
profileRouter.post('/:userId/follow', auth.required, followUser);
profileRouter.delete('/:userId/follow', auth.required, unfollowUser);

// TODO get stared Post
// profileRouter.get('/staredPost')

// TODO get liked Post
// profileRouter.get('/likedPost')

// TODO get commented Post
// profileRouter.get('/commentedPost')

// TODO get following

// TODO get followed

export default profileRouter;
