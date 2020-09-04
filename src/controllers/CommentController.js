import { body, validationResult } from 'express-validator';

import CommentModel from '../models/CommentModel';
import {
	errorResponse,
	notFoundResponse,
	successResponseWithData,
	validationErrorWithData,
} from '../utils/apiResponse';
import { queryPostById } from './PostController';

export const createCommentValidator = [
	body('body')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Body must be specified.'),
];

export const queryCommentById = async (commentId, res) => {
	try {
		const comment = await CommentModel.findById(commentId);
		if (!comment) {
			return notFoundResponse(res, 'Comment Not Found');
		}
		return comment;
	} catch (err) {
		return errorResponse(res, err);
	}
};

// create a new comment
export const createComment = async (req, res) => {
	const { body } = req.body;
	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Display sanitized values/errors messages.
			return validationErrorWithData(res, 'Validation Error.', errors.array());
		}
		const post = await queryPostById(req.params.postId, res);
		const comment = new CommentModel({
			body,
			post,
			author: req.user,
		});
		await comment.save();
		await post.updateComment(comment._id, req.user);
		return successResponseWithData(
			res,
			'Comment Create Success.',
			comment.toJSON(),
		);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const getCommentsByPostId = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;
	try {
		const post = await queryPostById(req.params.postId, res);
		const comments = await post
			.populate({
				path: 'comments',
				populate: {
					path: 'author',
				},
				options: {
					sort: {
						createdAt: 'desc',
					},
					limit,
					skip: offset,
				},
			})
			.execPopulate();

		const results = {
			comments: comments.comments.map(comment => comment.toJSON()),
			post: post.toJSON(),
			page: offset + 1,
			totalComment: post.commentCount,
		};
		return successResponseWithData(res, 'get comments success', results);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const likeComment = async (req, res) => {
	try {
		const comment = await queryCommentById(req.params.commentId);
		await req.user.likeComment(comment._id);
		comment.updateLikesCount();
		return successResponseWithData(
			res,
			'comment has been liked',
			comment.toJSON(),
		);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const unlikeComment = async (req, res) => {
	try {
		const comment = await queryCommentById(req.params.commentId);
		await req.user.unlikeComment(comment._id);
		comment.updateLikesCount();
		return successResponseWithData(
			res,
			'comment has been unliked',
			comment.toJSON(),
		);
	} catch (err) {
		return errorResponse(res, err);
	}
};
