import { body } from 'express-validator';

import UserModel from '../models/UserModel';

export const registerValidator = [
	body('username')
		.isLength({ min: 1, max: 20 })
		.trim()
		.withMessage('Username must be specified.')
		.isAlphanumeric()
		.withMessage('Username has non-alphanumeric characters.'),
	body('email')
		.isLength({ min: 6 })
		.trim()
		.withMessage('Email must be specified.')
		.isEmail()
		.withMessage('Email must be a valid email address.')
		.custom(async value => {
			const user = await UserModel.findOne({ email: value });
			if (user) {
				throw new Error('Email already in use');
			}
		}),
	body('password')
		.isLength({ min: 6 })
		.trim()
		.withMessage('Password must be 6 characters or greater.'),
];

export const loginValidator = [
	body('email', 'Please enter a valid email').isEmail(),
	body('password', 'Please enter a valid password').isLength({ min: 6 }),
];

export const refreshTokenValidator = [
	body('email', 'Missing User Email')
		.isEmail()
		.withMessage('Email must be a valid email address.'),
	body('refreshToken', 'Missing User Refresh Token'),
];

export const changePasswordValidator = [
	body('password', 'Please enter a valid password').isLength({ min: 6 }),
];
