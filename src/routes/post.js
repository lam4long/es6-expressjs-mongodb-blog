import express from 'express';
import { createPost } from '../controllers/PostController';

import auth from '../middlewares/auth';

const postRouter = express.Router();

postRouter.post('/', auth, createPost);

export default postRouter;
