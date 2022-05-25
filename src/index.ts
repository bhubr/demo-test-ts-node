import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';

import { port } from './settings';
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

async function start() {
  await mongoose.connect('mongodb://localhost:27017/myapp_dev');

  app.listen(port, () => console.log(`listening on ${port}`));
}

start();
