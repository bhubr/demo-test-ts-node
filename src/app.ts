import express from 'express';
import cors from 'cors';
import * as authController from './controllers/auth';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/dummy-endpoint', (req, res) =>
  res.send({
    message: 'Hello from the backend',
  })
);

app.post('/api/auth/signup', authController.postSignup);

export default app;
