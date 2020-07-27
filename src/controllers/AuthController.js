import { body, validationResult } from 'express-validator';
import UserModel from '../models/UserModel';
import {
	errorResponse,
	successResponse,
	validationErrorWithData,
	successResponseWithData,
	unauthorizedResponse,
} from '../utils/apiResponse';

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */

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
			if (user) throw new Error('Email already in use');
		}),
	body('password')
		.isLength({ min: 6 })
		.trim()
		.withMessage('Password must be 6 characters or greater.'),
];

/**
 * User Register.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}			email
 * @param {string}			password
 *
 * @returns {Object}
 */
export const register = async (req, res) => {
	const { username, email, password } = req.body;
	try {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Display sanitized values/errors messages.
			return validationErrorWithData(res, 'Validation Error.', errors.array());
		}

		const user = new UserModel({
			username,
			email,
			password,
		});
		await user.save();
		return successResponseWithData(
			res,
			'Registration Success.',
			user.toAuthJSON(),
		);
	} catch (err) {
		// throw error in json response with status 500.
		return errorResponse(res, err);
	}
};

export const loginValidator = [
	body('email', 'Please enter a valid email').isEmail(),
	body('password', 'Please enter a valid password').isLength({ min: 6 }),
];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
export const login = async (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return validationErrorWithData(res, 'Validation Error.', errors.array());
	}

	try {
		const { email, password } = req.body;
		const user = await UserModel.findByCredential(email, password);

		return successResponseWithData(res, 'Login Success.', user.toAuthJSON());
	} catch (err) {
		return unauthorizedResponse(res, err.message);
	}
};
