import { isProduction } from '../config';

export const successResponse = (res, msg) => {
	const data = {
		status: 1,
		message: msg,
	};
	return res.status(200).json(data);
};

export const successResponseWithData = (res, msg, data) => {
	const resData = {
		status: 1,
		message: msg,
		data,
	};
	return res.status(200).json(resData);
};

export const notFoundResponse = (res, msg) => {
	const data = {
		status: 0,
		message: msg,
	};
	return res.status(404).json(data);
};

export const errorResponse = (res, err) => {
	if (!isProduction) {
		console.log(err.stack);
	}
	const data = {
		status: 0,
		message: !isProduction ? err.message : '',
	};
	return res.status(500).json(data);
};

export const validationErrorWithData = (res, msg, data) => {
	const resData = {
		status: 0,
		message: msg,
		data,
	};
	return res.status(400).json(resData);
};

export const unauthorizedResponse = (res, err) => {
	if (!isProduction) {
		console.log(err.stack);
	}
	const data = {
		status: 0,
		message: err,
	};
	return res.status(401).json(data);
};

export const wrongPermissionResponse = res => {
	const data = {
		status: 0,
		message: 'No Permission to edit',
	};
	return res.status(403).json(data);
};
