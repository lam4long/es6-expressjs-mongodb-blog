import express from 'express';

import AuthRouter from './auth';
import PostRouter from './post';

const app = express();

app.use('/auth', AuthRouter);
app.use('/post', PostRouter);

export default app;
