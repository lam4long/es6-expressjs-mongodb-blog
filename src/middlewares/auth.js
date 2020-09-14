import jwt from 'express-jwt';

function getTokenFromHeader(req) {
	const authorization = req.headers.authorization;
	if (authorization && authorization.split(' ')[0] === 'Bearer') {
		return authorization.split(' ')[1];
	}
	return null;
}

const auth = {
	required: jwt({
		secret: process.env.JWT_SECRET,
		getToken: getTokenFromHeader,
	}),
	optional: jwt({
		secret: process.env.JWT_SECRET,
		credentialsRequired: false,
		getToken: getTokenFromHeader,
	}),
};

export default auth;
