import express from 'express';
import AuthRouter from './auth';

const app = express();

app.use('/auth', AuthRouter);

export default app;

