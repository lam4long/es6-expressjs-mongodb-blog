import Redis from 'ioredis';

import UserModel from '../models/UserModel';
import {
	errorResponse,
	successResponse,
	successResponseWithData,
	unauthorizedResponse,
} from '../utils/apiResponse';
import { getRedisClient } from '../utils/redis';
import validateRequestPayload from '../validators';

export const register = async (req, res) => {
	validateRequestPayload(req, res);

	try {
		const { username, email, password } = req.body;
		const user = new UserModel({
			username,
			email,
			password,
		});
		await user.save();
		const credential = user.toAuthJSON();
		await getRedisClient().set(credential.email, credential.refreshToken);
		return successResponseWithData(res, 'Registration Success.', credential);
	} catch (err) {
		// throw error in json response with status 500.
		return errorResponse(res, err);
	}
};

export const login = async (req, res) => {
	validateRequestPayload(req, res);

	try {
		const { email, password } = req.body;
		const user = await UserModel.findByCredential(email, password);

		const credential = user.toAuthJSON();
		await getRedisClient().set(credential.email, credential.refreshToken);

		return successResponseWithData(res, 'Login Success.', user.toAuthJSON());
	} catch (err) {
		if (err instanceof Redis.ReplyError) {
			return errorResponse(res, err);
		}
		return unauthorizedResponse(res, err.message);
	}
};

export const refreshAccessToken = async (req, res) => {
	validateRequestPayload(req, res);

	try {
		const { email, refreshToken } = req.body;
		const storedRefreshToken = await getRedisClient().get(email);
		if (storedRefreshToken === refreshToken) {
			const user = await UserModel.findOne({ email });
			return successResponseWithData(
				res,
				'Refresh Token Success.',
				user.toAuthJSON(refreshToken),
			);
		}

		return unauthorizedResponse(res, 'Invalid Refresh Token');
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const changePassword = async (req, res) => {
	validateRequestPayload(req, res);

	try {
		const { password } = req.body;
		const user = await UserModel.findById(req.user.id);
		user.password = password;
		await user.save();
		return successResponse(res, 'Password has been updated');
	} catch (err) {
		return errorResponse(res, err);
	}
};

export const logout = async (req, res) => {
	try {
		const { email } = req.user;
		await getRedisClient().del(email);
		return successResponse(res, 'Logout Success.');
	} catch (err) {
		return errorResponse(res, err);
	}
};
