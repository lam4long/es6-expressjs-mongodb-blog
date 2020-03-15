import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// import indexRouter from'./routes/index';
import apiRouter from './routes/api';
import { notFoundResponse } from './utils/apiResponse';

dotenv.config();

// DB connection
const MONGODB_URL = process.env.MONGODB_URL;
mongoose.connect(MONGODB_URL, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
}).then(() => {
	if (process.env.NODE_ENV === 'development') {
		console.log('Connected to %s', MONGODB_URL);
	}
}).catch(err => {
	console.error('App starting error:', err.message);
	process.exit(1);
});

const db = mongoose.connection;

const app = express();

// don't show the log when it is test
if (process.env.NODE_ENV === 'development') {
	app.use(logger('development'));
}

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors()); // To allow cross-origin requests

const port = 3000;

app.use('/api', apiRouter);

// throw 404 if URL not found
app.all('*', (req, res) => notFoundResponse(res, 'Page not found'));


app.listen(port, () => console.log(`app listening on port ${port}!`));
