import PostModel from '../models/PostModel';
import {
	errorResponse,
	successResponse,
	successResponseWithData,
	unauthorizedResponse,
} from '../utils/apiResponse';
import UserModel from '../models/UserModel';

export const createPost = async (req, res) => {
	const { title, body } = req.body;

	try {
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
