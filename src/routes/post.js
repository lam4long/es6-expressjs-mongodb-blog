import express from 'express';

import {
	createComment,
	createCommentValidator,
	getCommentsByPostId,
} from '../controllers/CommentController';
import {
	createAndUpdatePostValidator,
	createPost,
	deletePostById,
	getAllPosts,
	getPostById,
	likePost,
	starPost,
	unlikePost,
	unstarPost,
	updatePostById,
} from '../controllers/PostController';
import auth from '../middlewares/auth';

const postRouter = express.Router();

postRouter.get('/', getAllPosts);
postRouter.post('/', [auth, createAndUpdatePostValidator], createPost);
postRouter.get('/:postId', getPostById); // set auth optional
postRouter.put(
	'/:postId',
	[auth, createAndUpdatePostValidator],
	updatePostById,
);
postRouter.delete('/:postId', auth, deletePostById);
postRouter.post('/:postId/like', auth, likePost);
postRouter.delete('/:postId/like', auth, unlikePost);
postRouter.post('/:postId/star', auth, starPost);
postRouter.delete('/:postId/star', auth, unstarPost);

// comment
postRouter.get('/:postId/comment', getCommentsByPostId);
postRouter.post(
	'/:postId/comment',
	[auth, createCommentValidator],
	createComment,
);

export default postRouter;
