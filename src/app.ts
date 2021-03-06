import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import * as authController from './controllers/auth';
import * as postController from './controllers/post';
import jwtCheck from './middlewares/jwt-check';

const app = express();
app.use(cors());
app.use(cookieParser());
app.use(express.json());

app.get('/api/dummy-endpoint', jwtCheck, (req, res) =>
  res.send({
    message: 'Hello from the backend',
  })
);

app.post('/api/auth/signup', authController.postSignup);
app.post('/api/auth/signin', authController.postSignin);
app.get('/api/auth/user', jwtCheck, authController.getUser);
app.post('/api/posts', jwtCheck, postController.createPost);
app.put('/api/posts/:postId', jwtCheck, postController.updatePost);

export default app;
