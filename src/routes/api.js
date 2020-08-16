import express from 'express';

import AuthRouter from './auth';
import PostRouter from './post';
import ProfileRouter from './profile';

const app = express();

app.use('/auth', AuthRouter);
app.use('/post', PostRouter);
app.use('/profile', ProfileRouter);

export default app;
