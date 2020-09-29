import mongoose from 'mongoose';

import { isProduction, MONGODB_URL } from '../config/index';

function mongoDbSetup() {
	mongoose
		.connect(MONGODB_URL, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		})
		.then(() => {
			if (!isProduction) {
				console.log('MongoDb Connected to %s', MONGODB_URL);
			}
		})
		.catch(err => {
			console.error('MongoDb Connection error:', err.message);
			process.exit(1);
		});
}

export default mongoDbSetup;
