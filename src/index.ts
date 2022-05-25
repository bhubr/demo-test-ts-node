import mongoose from 'mongoose';

import { port } from './settings';
import app from './app';

async function start() {
  await mongoose.connect('mongodb://localhost:27017/myapp_dev');

  app.listen(port, () => console.log(`listening on ${port}`));
}

start();
