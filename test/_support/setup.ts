import { connect, connection } from 'mongoose';
import User from '../../src/models/User';

beforeAll(async () => {
  await connect('mongodb://localhost:27017/myapp_test');
});

beforeEach(async () => {
  await User.deleteMany({});
});

afterAll(async () => {
  await connection.close();
});
