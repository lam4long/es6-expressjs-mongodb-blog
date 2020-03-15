import { body, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel';
import { ErrorResponse, validationErrorWithData, successResponseWithData} from '../utils/apiResponse';

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
	body('email').isLength({ min: 1 }).trim().withMessage('Email must be specified.')
		.isEmail().withMessage('Email must be a valid email address.').custom(async (value) => { 
			const user = await UserModel.findOne({ 'email': value});
			if (user) throw new Error('Email already in use');
	}),
	body('password').isLength({ min: 6 }).trim().withMessage('Password must be 6 characters or greater.'),
];

export const register = async (req, res) => {
	console.log('rrr');
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
		const salt = await bcrypt.genSalt(10);
		user.password = await bcrypt.hash(password, salt);
		await user.save();
		const userData = {
			_id: user._id,
			firstName: user.firstName,
			lastName: user.lastName,
			email: user.email
		};

		return successResponseWithData(res, 'Registration Success.', userData);
	} catch (err) {
		// throw error in json response with status 500.
		return ErrorResponse(res, err);
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
	
	const { email, password } = req.body;

	try {
		const user = await UserModel.findOne({
			email
		});

	} catch (err) {
		// throw error in json response with status 500.
		return ErrorResponse(res, err);
	}

};
