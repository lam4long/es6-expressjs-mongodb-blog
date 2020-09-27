import CommentModel from '../models/CommentModel';
import PostModel from '../models/PostModel';
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

export const getStaredPosts = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	try {
		const user = await UserModel.findById(req.user.id);
		const query = { _id: { $in: user.staredPosts } };
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
			posts: posts.map(post => post.toJSON(user)),
			postsCount,
			page: offset + 1,
		};
		return successResponseWithData(res, 'Get Stared Posts Success', result);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const getCommentedPosts = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	try {
		const user = await UserModel.findById(req.user.id);
		const query = { _id: { $in: user.commentedPosts } };
		const [posts, postsCount] = await Promise.all([
			CommentModel.find(query)
				.limit(Number(limit))
				.skip(Number(offset))
				.sort({ createdAt: 'desc' })
				.populate('author')
				.populate('post')
				.exec(),
			CommentModel.countDocuments(query).exec(),
		]);
		const result = {
			posts: posts.map(post => post.toJSON(user)),
			postsCount,
			page: offset + 1,
		};
		return successResponseWithData(res, 'Get Commented Posts Success', result);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const getlikedPosts = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	try {
		const user = await UserModel.findById(req.user.id);
		const query = { _id: { $in: user.likedPosts } };
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
			posts: posts.map(post => post.toJSON(user)),
			postsCount,
			page: offset + 1,
		};
		return successResponseWithData(res, 'Get Liked Posts Success', result);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const getFollowings = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	try {
		const user = await UserModel.findById(req.user.id);
		const query = { _id: { $in: user.following } };
		const [followingUsers, usersCount] = await Promise.all([
			UserModel.find(query)
				.limit(Number(limit))
				.skip(Number(offset))
				.exec(),
			UserModel.countDocuments(query).exec(),
		]);
		const result = {
			users: followingUsers.map(followingUser =>
				followingUser.toProfileJSON(user),
			),
			usersCount,
			page: offset + 1,
		};
		return successResponseWithData(res, 'Get Following Users Success', result);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const getFollowers = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	try {
		const user = await UserModel.findById(req.user.id);
		const query = { _id: { $in: user.followers } };
		const [followers, usersCount] = await Promise.all([
			UserModel.find(query)
				.limit(Number(limit))
				.skip(Number(offset))
				.exec(),
			UserModel.countDocuments(query).exec(),
		]);
		const result = {
			users: followers.map(follower => follower.toProfileJSON(user)),
			usersCount,
			page: offset + 1,
		};
		return successResponseWithData(res, 'Get Followers Success', result);
	} catch (err) {
		return errorResponse(res, err);
	}
};
