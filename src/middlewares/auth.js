import jwt from 'jsonwebtoken';
import UserModel from '../models/UserModel';
import { unauthorizedResponse } from '../utils/apiResponse';

const auth = async (req, res, next) => {
	if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
		const token = req.headers.authorization.split(' ')[1];
		try {
			const data = jwt.verify(token, process.env.JWT_SECRET);
			const user = await UserModel.findOne({ _id: data._id, 'tokens.token': token });
			if (!user) {
				return unauthorizedResponse(res, 'Invalid Access Token');
			}
			req.user = user;
			req.token = token;
			next();
		} catch (error) {
			return unauthorizedResponse(res, 'Not authorized to access this resource');
		}
	}

	return unauthorizedResponse(res, 'Not authorized to access this resource'); 
};

export default auth;
