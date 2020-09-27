import jwt from 'express-jwt';

import { JWT_SECRET } from '../config';

function getTokenFromHeader(req) {
	const authorization = req.headers.authorization;
	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		return authorization.split(' ')[1];
	}
	return null;
}

const auth = {
	required: jwt({
		secret: JWT_SECRET,
		algorithms: ['HS256'],
		getToken: getTokenFromHeader,
	}),
	optional: jwt({
		secret: JWT_SECRET,
		algorithms: ['HS256'],
		credentialsRequired: false,
		getToken: getTokenFromHeader,
	}),
};

export default auth;
