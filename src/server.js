/* eslint-disable prefer-arrow-callback */
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import mongoose from 'mongoose';
import morgan from 'morgan';

import { isProduction, MONGODB_URL } from './config';
import apiRouter from './routes/api';
import { notFoundResponse, unauthorizedResponse } from './utils/apiResponse';

dotenv.config();

// DB connection
mongoose
	.connect(MONGODB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	})
	.then(() => {
		if (!isProduction) {
			console.log('Connected to %s', MONGODB_URL);
		}
	})
	.catch(err => {
		console.error('App starting error:', err.message);
		process.exit(1);
	});

const db = mongoose.connection;

const app = express();

if (!isProduction) {
	app.use(morgan('dev'));
}

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors()); // To allow cross-origin requests

const port = 3000;

app.use('/api', apiRouter);

// throw 404 if URL not found
app.all('*', (req, res) => notFoundResponse(res, 'Page not found'));

if (!isProduction) {
	app.use(function(err, req, res, next) {
		if (err.name === 'UnauthorizedError') {
			return unauthorizedResponse(res, err);
		}
	});
}

app.listen(port, () => console.log(`app listening on port ${port}!`));
