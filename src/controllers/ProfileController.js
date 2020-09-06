import UserModel from '../models/UserModel';
import {
	errorResponse,
	notFoundResponse,
	successResponse,
	successResponseWithData,
} from '../utils/apiResponse';

export const getProfile = async (req, res) => {
	const user = await UserModel.findById(req.user.id);
	return successResponseWithData(
		res,
		'Get User Profile Success',
		user.toProfileJSON(),
	);
};

export const findUser = async (req, res) => {
	try {
		// TODO: use one query to replace promise.all
		const [user, targetUser] = await Promise.all([
			UserModel.findById(req.user.id),
			UserModel.findById(req.params.userId),
		]);
		if (!targetUser) return notFoundResponse(res, 'User Not Found');

		return successResponseWithData(
			res,
			'Get User Profile Success',
			targetUser.toProfileJSON(user),
		);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const followUser = async (req, res) => {
	// check if your id doesn't match the id of the user you want to follow
	if (req.user._id === req.params.userId) {
		return errorResponse({ error: 'You cannot follow yourself' });
	}

	const [user, targetUser] = await Promise.all([
		UserModel.findById(req.user.id),
		UserModel.findById(req.params.userId),
	]);

	if (!targetUser) return notFoundResponse(res, 'User Not Found');
	Promise.all([
		user.followUser(targetUser._id),
		targetUser.isFollowedBy(user._id),
	]);
	return successResponse(res, 'Follow User Success');
};

export const unfollowUser = async (req, res) => {
	// check if your id doesn't match the id of the user you want to follow
	if (req.user._id === req.params.userId) {
		return errorResponse({ error: 'You cannot unfollow yourself' });
	}
	const [user, targetUser] = await Promise.all([
		UserModel.findById(req.user.id),
		UserModel.findById(req.params.userId),
	]);

	if (!targetUser) return notFoundResponse(res, 'User Not Found');
	Promise.all([
		req.user.unfollowUser(targetUser._id),
		targetUser.unFollowedBy(user._id),
	]);
	return successResponse(res, 'Unfollow User Success');
};

// export const updateProfile = async (req, res) => {
// 	try {

// 	} catch (err) {
// 		return errorResponse(res, err);
// 	}
// }
