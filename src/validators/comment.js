import { body } from 'express-validator';

export const createCommentValidator = [
	body('body')
		.isLength({ min: 1 })
		.trim()
		.withMessage('Body must be specified.'),
];

export default createCommentValidator;
