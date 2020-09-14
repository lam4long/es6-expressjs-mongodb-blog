import express from 'express';

import {
	findUser,
	followUser,
	getCommentedPosts,
	getFollowers,
	getFollowings,
	getlikedPosts,
	getProfile,
	getStaredPosts,
	unfollowUser,
} from '../controllers/ProfileController';
import auth from '../middlewares/auth';

const profileRouter = express.Router();

profileRouter.get('/', auth.required, getProfile);
profileRouter.get('/:userId', auth.optional, findUser); // set auth optional
profileRouter.post('/:userId/follow', auth.required, followUser);
profileRouter.delete('/:userId/follow', auth.required, unfollowUser);

profileRouter.get('/staredPost', auth.required, getStaredPosts);
profileRouter.get('/likedPost', auth.required, getlikedPosts);
profileRouter.get('/commentedPost', auth.required, getCommentedPosts);

profileRouter.get('/followings', auth.required, getFollowings);
profileRouter.get('/followers', auth.required, getFollowers);

export default profileRouter;
