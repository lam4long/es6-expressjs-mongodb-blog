import express from 'express';
import { createPost, createPostValidator } from '../controllers/PostController';

import auth from '../middlewares/auth';

const postRouter = express.Router();

postRouter.post('/', [auth, createPostValidator], createPost);

export default postRouter;
