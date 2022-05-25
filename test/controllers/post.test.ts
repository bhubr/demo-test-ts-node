import request from 'supertest';
import jwt from 'jsonwebtoken';

import app from '../../src/app';
import User from '../../src/models/User';
import { jwtSecret } from '../../src/settings';
import Post from '../../src/models/Post';

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

  describe('update post', () => {
    it('no auth', async () => {
      await request(app)
        .put('/api/posts/1234')
        .send({ title: 'sample post', content: 'hello world' })
        .expect(401);
    });
    it("a user cannot update another's post", async () => {
      const postAuthor = await User.create({
        email: 'test2@mail.com',
        password: 'abcd1234',
      });
      const post = await Post.create({
        title: 'sample',
        content: 'initial content',
        author: postAuthor._id,
      });

      const otherUser = await User.create({
        email: 'test3@mail.com',
        password: 'abcd1234',
      });

      const token = jwt.sign({ _id: otherUser._id }, jwtSecret);
      await request(app)
        .put(`/api/posts/${post._id}`)
        .send({ title: 'sample post', content: 'hello world' })
        .set('Cookie', [`jwt=${token}`])
        .expect('Content-Type', /json/)
        .expect(403)
        .then((res) => {
          expect(res.body.error).toEqual('you have no right to do this');
        });
    });
    it('happy path', async () => {
      const user = await User.create({
        email: 'test2@mail.com',
        password: 'abcd1234',
      });
      const post = await Post.create({
        title: 'sample',
        content: 'initial content',
        author: user._id,
      });

      const token = jwt.sign({ _id: user._id }, jwtSecret);
      await request(app)
        .put(`/api/posts/${post._id}`)
        .send({ title: 'sample post', content: 'hello world' })
        .set('Cookie', [`jwt=${token}`])
        .expect('Content-Type', /json/)
        .expect(200)
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
