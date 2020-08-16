import { body, validationResult } from 'express-validator';

import PostModel from '../models/PostModel';
import {
	errorResponse,
	notFoundResponse,
	successResponse,
	successResponseWithData,
	validationErrorWithData,
	wrongPermissionResponse,
} from '../utils/apiResponse';

export const createAndUpdatePostValidator = [
	body('title')
		.isLength({ min: 1, max: 50 })
		.trim()
		.withMessage('Title must be specified.'),
	body('body')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Body must be specified.'),
];

export const getAllPosts = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	const query = {};
	try {
		const [posts, postsCount] = await Promise.all([
			PostModel.find(query)
				.limit(Number(limit))
				.skip(Number(offset))
				.sort({ createdAt: 'desc' })
				.populate('author')
				.exec(),
			PostModel.countDocuments(query).exec(),
		]);

		const result = {
			posts: posts.map(post => post.toJSON()),
			postsCount,
			page: offset + 1,
		};
		return successResponseWithData(res, 'Get Posts Success', result);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const findPostById = async (postId, res) => {
	try {
		const post = await PostModel.findById(postId).populate('author');
		if (!post) {
			return notFoundResponse(res, 'Post Not Found');
		}
		return post;
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const getPostById = async (req, res) => {
	const post = await findPostById(req.params.postId, res);
	return successResponseWithData(res, 'Get Post By Id Success', post.toJSON());
};

// update a post
export const updatePostById = async (req, res) => {
	const { title, body } = req.body;

	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Display sanitized values/errors messages.
			return validationErrorWithData(res, 'Validation Error.', errors.array());
		}

		const post = await findPostById(req.params.postId, res);
		if (post.author._id.toString() === req.user._id.toString()) {
			post.title = title;
			post.body = body;
			await post.save();
			return successResponseWithData(
				res,
				'Post Update Success.',
				post.toJSON(),
			);
		}
		return wrongPermissionResponse(res);
	} catch (err) {
		return errorResponse(res, err);
	}
};

// delete a Post
export const deletePostById = async (req, res) => {
	try {
		const post = await findPostById(req.params.postId, res);
		if (post.author._id.toString() === req.user._id.toString()) {
			await post.remove();
			return successResponse(res, 'Post has been deleted');
		}
		return wrongPermissionResponse(res);
	} catch (err) {
		return errorResponse(res, err);
	}
};

// create a Post
export const createPost = async (req, res) => {
	const { title, body } = req.body;

	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Display sanitized values/errors messages.
			return validationErrorWithData(res, 'Validation Error.', errors.array());
		}

		const post = new PostModel({
			title,
			body,
			author: req.user,
		});
		await post.save();
		return successResponseWithData(res, 'Post Create Success.', post.toJSON());
	} catch (err) {
		return errorResponse(res, err);
	}
};
