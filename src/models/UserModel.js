import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	password: {
		type: String,
		required: true,
		minlength: 7,
	},
	tokens: [{
		token: {
			type: String,
			required: false,
		},
	}],
}, { timestamps: true });

/* 
	Note: cant use arrow operator for the callback,
	which changes the scope of this. 
	If we define a regular callback, should be fine.
*/
UserSchema.pre('save', async function(next) {
	// Hash the password before save the model
	if (this.isModified('password')) {
		const salt = await bcrypt.genSalt(10);
		this.password = await bcrypt.hash(this.password, salt);
	}
	next();
});

UserSchema.method('generateAuthToken', async function() {
	// Generate an auth token for the user
	const token = jwt.sign({ _id: this._id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_TIMEOUT_DURATION });
	this.tokens = this.tokens.concat({ token });
	await this.save();
	return token;
});

UserSchema.static('findByCredentials', async function(email, password) {
	// Search for a user by email & password.
	const user = await this.findOne({ email });
	
	if (!user) {
		throw new Error('Account is not existed. Please check your email input.');
	}
	const isPasswordMatch = await bcrypt.compare(password, user.password);
	if (!isPasswordMatch) {
		throw new Error('Invalid login credentials');
	}

	return user;
});

export default mongoose.model('User', UserSchema);
