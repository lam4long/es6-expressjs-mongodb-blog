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
	body('firstName').isLength({ min: 1 }).trim().withMessage('First name must be specified.').isAlphanumeric().withMessage('First name has non-alphanumeric characters.'),
	body('lastName').isLength({ min: 1 }).trim().withMessage('Last name must be specified.').isAlphanumeric().withMessage('Last name has non-alphanumeric characters.'),
	body('email').isLength({ min: 6 }).trim().withMessage('Email must be specified.')
		.isEmail().withMessage('Email must be a valid email address.').custom(async (value) => { 
			const user = await UserModel.findOne({ 'email': value });
			if (user) throw new Error('Email already in use');
	}),
	body('password').isLength({ min: 6 }).trim().withMessage('Password must be 6 characters or greater.'),
];

export const register = async (req, res) => {
	const {
		firstName,
		lastName,
		email,
		password,
	} = req.body;
	try {
		// Extract the validation errors from a request.
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			// Display sanitized values/errors messages.
			return validationErrorWithData(res, 'Validation Error.', errors.array());
		}

		const user = new UserModel({
				firstName,
				lastName,
				email,
				password,
		});
		await user.save();

		const token = await user.generateAuthToken();
		const userData = {
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email,
			token,
		};

		return successResponseWithData(res, 'Registration Success.', userData);
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
		const user = await UserModel.findByCredentials(email, password);

		const token = await user.generateAuthToken();
		const userData = {
			_id: user._id,
			email: user.email,
			token,
		};
		return successResponseWithData(res, 'Login Success.', userData);

	} catch (err) {
		return unauthorizedResponse(res, err.message);
	}
};

// User Logout
export const logout = async (req, res) => {
	try {
		req.user.tokens = req.user.tokens.filter((token) => token.token !== req.token);
		await req.user.save();
		return successResponse(res, 'Logout Success');
	} catch (error) {
		return errorResponse(res, 'Logout Error');
	}
};

// Logout All User
export const logoutAll = async (req, res) => {
	try {
		const tokens = req.user.tokens;
		tokens.splice(0, tokens.length);
		await req.user.save();
		return successResponse(res, 'Logout All Users Success');
	} catch (error) {
		return errorResponse(res, 'Logout Error');
	}
};
