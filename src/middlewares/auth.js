import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import { unauthorizedResponse } from '../utils/apiResponse';

const auth = async (req, res, next) => {
	const authorization = req.headers.authorization;
	if (!authorization && authorization.split(' ')[0] !== 'Bearer') {
		return unauthorizedResponse(res, 'Not authorized to access this resource');
	}

	try {
		const token = authorization.split(' ')[1];
		const data = await jwt.verify(token, process.env.JWT_SECRET);
		const user = await UserModel.findOne({
			_id: data._id,
			username: data.username,
		});
		if (!user) {
			return unauthorizedResponse(res, 'Invalid Access Token');
		}
		req.user = user;
		req.token = token;
		next();
	} catch (err) {
		return unauthorizedResponse(res, 'Not authorized to access this resource');
	}
};

export default auth;
