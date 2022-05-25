import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import User from '../../src/models/User';
import { jwtSecret } from '../../src/settings';

async function testPost(
  path: string,
  data: { email?: string; password?: string },
  expectedCode: number
) {
  return (
    request(app)
      .post(path)
      .send(data)
      // Assert
      .expect('Content-Type', /json/)
      .expect(expectedCode)
  );
}

describe('post controller', () => {
  describe('create post', () => {
    it('no auth', async () => {
      await request(app)
        .post('/api/posts')
        .send({ title: 'sample post', content: 'hello world' })
        .expect(401);
    });
    it('happy path', async () => {
      const user = await User.create({
        email: 'test@mail.com',
        password: 'abcd1234',
      });
      const token = jwt.sign({ _id: user._id }, jwtSecret);
      await request(app)
        .post('/api/posts')
        .send({ title: 'sample post', content: 'hello world' })
        .set('Cookie', [`jwt=${token}`])
        .expect('Content-Type', /json/)
        .expect(201)
        .then((res) => {
          expect(Object.keys(res.body).sort()).toEqual(
            [
              '_id',
              'title',
              'author',
              'content',
              'createdAt',
              'updatedAt',
              '__v',
            ].sort()
          );
        });
    });
  });
});
