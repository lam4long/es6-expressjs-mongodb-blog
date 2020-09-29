import express from 'express';

import {
	createComment,
	getCommentsByPostId,
} from '../controllers/CommentController';
import {
	createPost,
	deletePostById,
	getAllPosts,
	getFeeds,
	getPostById,
	likePost,
	starPost,
	unlikePost,
	unstarPost,
	updatePostById,
} from '../controllers/PostController';
import auth from '../middlewares/auth';
import { createCommentValidator } from '../validators/comment';
import { createAndUpdatePostValidator } from '../validators/post';

const postRouter = express.Router();

postRouter.get('/', auth.optional, getAllPosts);
postRouter.post('/', [auth.required, createAndUpdatePostValidator], createPost);
postRouter.get('/:postId', auth.optional, getPostById); // set auth optional
postRouter.put(
	'/:postId',
	[auth.required, createAndUpdatePostValidator],
	updatePostById,
);
postRouter.delete('/:postId', auth.required, deletePostById);
postRouter.post('/:postId/like', auth.required, likePost);
postRouter.delete('/:postId/like', auth.required, unlikePost);
postRouter.post('/:postId/star', auth.required, starPost);
postRouter.delete('/:postId/star', auth.required, unstarPost);

// comment
postRouter.get('/:postId/comment', auth.optional, getCommentsByPostId);
postRouter.post(
	'/:postId/comment',
	[auth.required, createCommentValidator],
	createComment,
);

// Feed
postRouter.get('/feed', auth.required, getFeeds);

// TODO add recommended Post
// postRouter.get('/recommended')

// TODO add comment in comment
// postRouter.post('/:postId/comment/:commentId')

export default postRouter;
