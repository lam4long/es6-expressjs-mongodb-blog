import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import {
	JWT_EXPIRATION,
	JWT_REFRESH_EXPIRATION,
	JWT_REFRESH_SECRET,
	JWT_SECRET,
} from '../config';

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
		password: {
			type: String,
			required: true,
		},
		posts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
		commentedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
		staredPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
		likedPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Post' }],
		following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
		bio: String,
		salt: String,
	},
	{ timestamps: true },
);

UserSchema.plugin(uniqueValidator, { message: 'is already taken.' });

const getHash = (password, salt) =>
	crypto.pbkdf2Sync(password, salt, 10000, 512, 'sha512').toString('hex');

UserSchema.methods.validPassword = function(password) {
	const hash = getHash(password, this.salt);
	return this.password === hash;
};

UserSchema.methods.setPassword = function(password) {
	const salt = crypto.randomBytes(16).toString('hex');
	const hash = getHash(password, salt);
	return [salt, hash];
};

UserSchema.methods.generateAccessToken = function() {
	return jwt.sign(
		{
			id: this._id,
			username: this.username,
			email: this.email,
		},
		JWT_SECRET,
		{
			expiresIn: JWT_EXPIRATION,
		},
	);
};

UserSchema.methods.generateRefreshToken = function() {
	return jwt.sign({ id: this._id }, JWT_REFRESH_SECRET, {
		expiresIn: JWT_REFRESH_EXPIRATION,
	});
};

UserSchema.methods.toAuthJSON = function(refreshToken) {
	return {
		username: this.username,
		email: this.email,
		token: this.generateAccessToken(),
		refreshToken: refreshToken || this.generateRefreshToken(),
	};
};

UserSchema.methods.toProfileJSON = function(user) {
	const profile = {
		username: this.username,
		email: this.email,
		bio: this.bio,
		image: this.image,
	};

	if (user !== '') return profile;

	if (user && user._id.toString() !== this._id.toString()) {
		return {
			...profile,
			following: user.isFollowing(this._id),
		};
	}
	return profile;
};

UserSchema.methods.addPost = function(id) {
	if (this.posts.indexOf(id) === -1) {
		this.posts.push(id);
		return this.save();
	}
};

UserSchema.methods.removePost = function(id) {
	this.posts.remove(id);
	return this.save();
};

UserSchema.methods.updateCommentedPost = function(id) {
	if (this.commentedPosts.indexOf(id) === -1) {
		this.commentedPosts.push(id);
		return this.save();
	}
};

UserSchema.methods.likePost = function(id) {
	if (this.likedPosts.indexOf(id) === -1) {
		this.likedPosts.push(id);
		return this.save();
	}
};

UserSchema.methods.unlikedPost = function(id) {
	this.likedPosts.remove(id);
	return this.save();
};

UserSchema.methods.isLikedPost = function(id) {
	return this.likedPosts.some(postId => postId.toString() === id.toString());
};

UserSchema.methods.starPost = function(id) {
	if (this.staredPosts.indexOf(id) === -1) {
		this.staredPosts.push(id);
		return this.save();
	}
};

UserSchema.methods.unstarPost = function(id) {
	this.staredPosts.remove(id);
	return this.save();
};

UserSchema.methods.isStaredPost = function(id) {
	return this.staredPosts.some(postId => postId.toString() === id.toString());
};

UserSchema.methods.followUser = function(id) {
	if (this.following.indexOf(id) === -1) {
		this.following.push(id);
		return this.save();
	}
};

UserSchema.methods.isFollowedBy = function(id) {
	if (this.followers.indexOf(id) === -1) {
		this.followers.push(id);
		return this.save();
	}
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
	return this.following.some(userId => userId.toString() === id.toString());
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

UserSchema.pre('save', async function(next) {
	// Hash the password before save the model
	if (this.isModified('password')) {
		try {
			const [salt, newHash] = await this.setPassword(this.password);
			this.salt = salt;
			this.password = newHash;
			return next();
		} catch (err) {
			return next(err);
		}
	}
	return next();
});

export default mongoose.model('User', UserSchema);
