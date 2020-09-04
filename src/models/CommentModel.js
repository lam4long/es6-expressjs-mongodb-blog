import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema(
	{
		body: String,
		author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
		post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
		// comments: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' },
	},
	{ timestamps: true },
);

CommentSchema.methods.toJSON = function(user) {
	return {
		id: this._id,
		body: this.body,
		createdAt: this.createdAt,
		author: this.author.toProfileJSON(user),
	};
};

export default mongoose.model('Comment', CommentSchema);
