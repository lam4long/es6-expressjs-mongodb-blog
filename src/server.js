/* eslint-disable import/first */
/* eslint-disable prefer-arrow-callback */
import bodyParser from 'body-parser';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import helmet from 'helmet';
import morgan from 'morgan';

import { isProduction } from './config';
import apiRouter from './routes/api';
import { notFoundResponse, unauthorizedResponse } from './utils/apiResponse';
import mongoDbSetup from './utils/mongoDb';
import redisSetup from './utils/redis';

dotenv.config();

mongoDbSetup();
redisSetup();

const app = express();

if (!isProduction) {
	app.use(morgan('dev'));
}

app.use(compression());
app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '20mb' }));
app.use(cookieParser());
app.use(cors()); // To allow cross-origin requests

const port = 3000;

app.use('/api', apiRouter);

// throw 404 if URL not found
app.all('*', (req, res) => notFoundResponse(res, 'Page not found'));

app.use(function(err, req, res, next) {
	if (err.name === 'UnauthorizedError') {
		return unauthorizedResponse(res, err);
	}
});

app.listen(port, () => console.log(`app listening on port ${port}!`));
