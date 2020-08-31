import UserModel from '../models/UserModel';
import {
	errorResponse,
	notFoundResponse,
	successResponse,
	successResponseWithData,
} from '../utils/apiResponse';

export const getProfile = async (req, res) => {
	return successResponseWithData(
		res,
		'Get User Profile Success',
		req.user.toProfileJSON(),
	);
};

export const findUser = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.userId);
		if (!user) return notFoundResponse(res, 'User Not Found');

		return successResponseWithData(
			res,
			'Get User Profile Success',
			user.toProfileJSON(req.user),
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

	const targetUser = await UserModel.findById(req.params.userId);
	if (!targetUser) return notFoundResponse(res, 'User Not Found');
	Promise.all([
		req.user.followUser(targetUser._id),
		targetUser.isFollowedBy(req.user._id),
	]);
	return successResponse(res, 'Follow User Success');
};

export const unfollowUser = async (req, res) => {
	// check if your id doesn't match the id of the user you want to follow
	if (req.user._id === req.params.userId) {
		return errorResponse({ error: 'You cannot unfollow yourself' });
	}
	const targetUser = await UserModel.findById(req.params.userId);

	if (!targetUser) return notFoundResponse(res, 'User Not Found');
	Promise.all([
		req.user.unfollowUser(targetUser._id),
		targetUser.unFollowedBy(req.user._id),
	]);
	return successResponse(res, 'Unfollow User Success');
};

// export const updateProfile = async (req, res) => {
// 	try {

// 	} catch (err) {
// 		return errorResponse(res, err);
// 	}
// }
