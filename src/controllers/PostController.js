import { body, validationResult } from 'express-validator';
import PostModel from '../models/PostModel';
import {
	errorResponse,
	successResponse,
	successResponseWithData,
	unauthorizedResponse,
	validationErrorWithData,
} from '../utils/apiResponse';
import UserModel from '../models/UserModel';

export const createPostValidator = [
	body('title')
		.isLength({ min: 1, max: 50 })
		.trim()
		.withMessage('Title must be specified.'),
	body('body')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Body must be specified.'),
];

export const createPost = async (req, res) => {
	const { title, body } = req.body;

	try {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Display sanitized values/errors messages.
			console.log('error: ', errors)
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
