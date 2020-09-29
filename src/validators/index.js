import { validationResult } from 'express-validator';

import { validationErrorWithData } from '../utils/apiResponse';

const validateRequestPayload = (req, res) => {
	const errors = validationResult(req);

	if (!errors.isEmpty()) {
		return validationErrorWithData(res, 'Validation Error.', errors.array());
	}
};

export default validateRequestPayload;
