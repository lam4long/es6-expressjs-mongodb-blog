import { body } from 'express-validator';

export const createAndUpdatePostValidator = [
	body('title')
		.isLength({ min: 1, max: 50 })
		.trim()
		.withMessage('Title must be specified.'),
	body('body')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Body must be specified.'),
];

export default createAndUpdatePostValidator;
