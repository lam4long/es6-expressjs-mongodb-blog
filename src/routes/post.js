import express from 'express';

import {
	createAndUpdatePostValidator,
	createPost,
	deletePostById,
	getAllPosts,
	getPostById,
	updatePostById,
} from '../controllers/PostController';
import auth from '../middlewares/auth';

const postRouter = express.Router();

postRouter.get('/', getAllPosts);
postRouter.get('/:postId', getPostById);
postRouter.put(
	'/:postId',
	[auth, createAndUpdatePostValidator],
	updatePostById,
);
postRouter.delete('/:postId', auth, deletePostById);
postRouter.post('/', [auth, createAndUpdatePostValidator], createPost);

export default postRouter;
