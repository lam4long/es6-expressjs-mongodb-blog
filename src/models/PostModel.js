import mongoose from 'mongoose';

const User = mongoose.model('User');

const PostSchema = new mongoose.Schema(
	{
		title: String,
		body: String,
		favoritesCount: { type: Number, default: 0 },
		comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
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
		favoritesCount: this.favoritesCount,
		createdAt: this.createdAt,
		updatedAt: this.updatedAt,
		tagList: this.tagList,
		author: this.author.toProfileJSON(),
	};
};

export default mongoose.model('Post', PostSchema);
