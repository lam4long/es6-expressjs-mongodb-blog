import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const UserSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: true,
			required: true,
			index: true,
		},
		email: {
			type: String,
			unique: true,
			required: true,
			index: true,
		},
		likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		bio: String,
		image: String,
		hash: String,
		salt: String,
	},
	{ timestamps: true },
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

const getHash = (password, salt) =>
	crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');

UserSchema.methods.validPassword = function(password) {
	const hash = getHash(password, this.salt);
	return this.hash === hash;
};

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = getHash(password, this.salt);
};

UserSchema.methods.generateJWT = function() {
	return jwt.sign(
		{
			_id: this._id,
			username: this.username,
		},
		process.env.JWT_SECRET,
		{
			expiresIn: process.env.JWT_TIMEOUT_DURATION,
		},
	);
};

UserSchema.methods.toAuthJSON = function() {
	return {
		username: this.username,
		email: this.email,
		token: this.generateJWT(),
	};
};

UserSchema.methods.toProfileJSON = function() {
	const profile = {
		username: this.username,
		email: this.email,
		bio: this.bio,
		image: this.image,
	};

	// if (user && user._id !== this._id) {
	// 	return {
	// 		...profile,
	// 		following: user.isFollowing(this._id),
	// 	};
	// }
	return profile;
};

UserSchema.methods.likePost = function(id) {
	if (this.likedPosts.indexOf(id) === -1) {
		this.likedPosts.push(id);
	}
	return this.save();
};

UserSchema.methods.unlikedPost = function(id) {
	this.likedPosts.remove(id);
	return this.save();
};

UserSchema.methods.isLikedPost = function(id) {
	return this.likedPosts.some(postId => postId.toString() === id.toString());
};

UserSchema.methods.followUser = function(id) {
	if (this.following.indexOf(id) === -1) {
		this.following.push(id);
	}
	return this.save();
};

UserSchema.methods.isFollowedBy = function(id) {
	if (this.followers.indexOf(id) === -1) {
		this.followers.push(id);
	}
	return this.save();
};

UserSchema.methods.unfollowUser = function(id) {
	this.following.remove(id);
	return this.save();
};

UserSchema.methods.unFollowedBy = function(id) {
	this.followers.remove(id);
	return this.save();
};

UserSchema.methods.isFollowing = function(id) {
	return this.following.some(userId => {
		console.log('userId: ', userId);
		return userId.toString() === id.toString();
	});
};

UserSchema.statics.findByCredential = async function(email, password) {
	const user = await this.findOne({ email });

	if (!user) {
		throw new Error('Account is not existed. Please check your email input.');
	}
	const isPasswordMatch = await user.validPassword(password);
	if (!isPasswordMatch) {
		throw new Error('Invalid login credentials');
	}

	return user;
};

/*
	Note: cant use arrow operator for the callback,
	which changes the scope of this.
	If we define a regular callback, should be fine.
*/
UserSchema.pre('save', async function(next) {
	// Hash the password before save the model
	if (this.isModified('password')) {
		this.password = await this.setPassword(this.password);
	}
	next();
});

export default mongoose.model('User', UserSchema);
