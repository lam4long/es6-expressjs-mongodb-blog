import PostModel from '../models/PostModel';
import UserModel from '../models/UserModel';
import {
	errorResponse,
	notFoundResponse,
	successResponse,
	successResponseWithData,
	wrongPermissionResponse,
} from '../utils/apiResponse';
import validateRequestPayload from '../validators';

export const getAllPosts = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	const query = {};
	try {
		const [posts, postsCount, user] = await Promise.all([
			PostModel.find(query)
				.limit(Number(limit))
				.skip(Number(offset))
				.sort({ createdAt: 'desc' })
				.populate('author')
				.exec(),
			PostModel.countDocuments(query).exec(),
			req.user ? UserModel.findById(req.user.id) : null,
		]);

		const result = {
			posts: posts.map(post => post.toJSON(user)),
			postsCount,
			page: offset + 1,
		};
		return successResponseWithData(res, 'Get Posts Success', result);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const getFeeds = async (req, res) => {
	const limit = req.query.limit || 20;
	const offset = req.query.offset || 0;

	try {
		const user = await UserModel.findById(req.user.id);
		const query = { author: { $in: user.following } };
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
		return successResponseWithData(res, 'Get Feeds Success', result);
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const queryPostById = async (postId, res) => {
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
	const [user, post] = await Promise.all([
		req.user ? UserModel.findById(req.user.id) : null,
		queryPostById(req.params.postId, res),
	]);
	return successResponseWithData(
		res,
		'Get Post By Id Success',
		post.toJSON(user),
	);
};

export const createPost = async (req, res) => {
	validateRequestPayload(req, res);

	try {
		const { title, body } = req.body;
		const author = await UserModel.findById(req.user.id);
		const post = new PostModel({
			title,
			body,
			author,
		});
		await post.save();
		await author.addPost(post._id);
		return successResponseWithData(res, 'Post Create Success.', post.toJSON());
	} catch (err) {
		return errorResponse(res, err);
	}
};

// update a post
export const updatePostById = async (req, res) => {
	validateRequestPayload(req, res);
	try {
		const post = await queryPostById(req.params.postId, res);
		if (post.author._id.toString() !== req.user.id.toString()) {
			return wrongPermissionResponse(res);
		}
		const { title, body } = req.body;
		post.title = title;
		post.body = body;
		await post.save();
		return successResponseWithData(res, 'Post Update Success.', post.toJSON());
	} catch (err) {
		return errorResponse(res, err);
	}
};

// delete a Post
export const deletePostById = async (req, res) => {
	try {
		const [author, post] = await Promise.all([
			UserModel.findById(req.user.id),
			queryPostById(req.params.postId, res),
		]);
		if (post.author._id.toString() === author._id.toString()) {
			await author.removePost(post._id);
			await post.remove();
			return successResponse(res, 'Post has been deleted');
		}
		return wrongPermissionResponse(res);
	} catch (err) {
		return errorResponse(res, err);
	}
};

// Like a Post
export const likePost = async (req, res) => {
	try {
		const [user, post] = await Promise.all([
			UserModel.findById(req.user.id),
			queryPostById(req.params.postId),
		]);
		await user.likePost(post._id);
		post.updateLikesCount();
		return successResponseWithData(res, 'Post has been liked', post.toJSON());
	} catch (err) {
		return errorResponse(res, err);
	}
};

// Unlike a Post
export const unlikePost = async (req, res) => {
	try {
		const [user, post] = await Promise.all([
			UserModel.findById(req.user.id),
			queryPostById(req.params.postId),
		]);
		await user.unlikedPost(post._id);
		post.updateLikesCount();
		return successResponseWithData(res, 'Post has been unliked', post.toJSON());
	} catch (err) {
		return errorResponse(res, err);
	}
};

// Star a Post
export const starPost = async (req, res) => {
	try {
		const [user, post] = await Promise.all([
			UserModel.findById(req.user.id),
			queryPostById(req.params.postId),
		]);
		await user.starPost(post._id);
		post.updateStarsCount();
		return successResponseWithData(res, 'Post has been stared', post.toJSON());
	} catch (err) {
		return errorResponse(res, err);
	}
};

// Unstar a Post
export const unstarPost = async (req, res) => {
	try {
		const [user, post] = await Promise.all([
			UserModel.findById(req.user.id),
			queryPostById(req.params.postId),
		]);
		await user.unstarPost(post._id);
		post.updateStarsCount();
		return successResponseWithData(
			res,
			'Post has been unstared',
			post.toJSON(),
		);
	} catch (err) {
		return errorResponse(res, err);
	}
};
