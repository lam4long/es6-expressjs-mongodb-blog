import mongoose from 'mongoose';

import UserModel from './UserModel';

const PostSchema = new mongoose.Schema(
	{
		title: String,
		body: String,
		starsCount: { type: Number, default: 0 },
		likesCount: { type: Number, default: 0 },
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
		commentCount: { type: Number, default: 0 },
		tagList: [{ type: String }],
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
	},
	{ timestamps: true },
);

PostSchema.methods.toJSON = function(user) {
	return {
		id: this._id,
		title: this.title,
		body: this.body,
		starsCount: this.starsCount,
		likesCount: this.likesCount,
		liked: user ? user.isLikedPost(this._id) : false,
		stared: user ? user.isStaredPost(this._id) : false,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
		tagList: this.tagList,
		author: this.author.toProfileJSON(user),
	};
};

PostSchema.methods.updateLikesCount = async function() {
	const totalLikesCount = await UserModel.count({
		likedPosts: { $in: [this._id] },
	});
	this.likesCount = totalLikesCount;
	return this.save();
};

PostSchema.methods.updateStarsCount = async function() {
	const totalStarsCount = await UserModel.count({
		staredPosts: { $in: [this._id] },
	});
	this.starsCount = totalStarsCount;
	return this.save();
};

PostSchema.methods.updateComment = function(id, user) {
	this.comments.push(id);
	this.commentCount += 1;
	user.updateCommentedPost(this._id);
	return this.save();
};

export default mongoose.model('Post', PostSchema);
