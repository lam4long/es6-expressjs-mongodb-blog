import UserModel from '../models/UserModel';
import {
	errorResponse,
	notFoundResponse,
	successResponseWithData,
} from '../utils/apiResponse';

export const getProfile = async (req, res) => {
	return successResponseWithData(
		res,
		'Get User Profile Success',
		req.user.toProfileJSON(),
	);
};

export const getProfileByUserId = async (req, res) => {
	try {
		const user = await UserModel.findById(req.params.userId);
		if (!user) return notFoundResponse(res, 'User Not Found');

		return successResponseWithData(
			res,
			'Get User Profile Success',
			req.user.toProfileJSON(),
		);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const followUser = async (req, res) => {
	const targetUser = await UserModel.findById(req.params.userId);

	if (!targetUser) return notFoundResponse(res, 'User Not Found');
	await req.user.followUser(targetUser);
	return successResponseWithData(
		res,
		'Follow User Success',
		req.user.toProfileJSON(req.user),
	);
};

export const unfollowUser = async (req, res) => {
	const targetUser = await UserModel.findById(req.params.userId);

	if (!targetUser) return notFoundResponse(res, 'User Not Found');
	await req.user.unfollowUser(targetUser);
	return successResponseWithData(
		res,
		'Unfollow User Success',
		req.user.toProfileJSON(req.user),
	);
};
