import request from 'supertest';

import app from '../../src/app';
import User from '../../src/models/User';

describe('auth controller', () => {
  describe('signup route', () => {
    it('empty email & password', async () => {
      // Act => effectuer une action, ici inscrire un user
      await request(app)
        .post('/api/auth/signup')
        .send({ email: '', password: '' })
        // Assert
        .expect('Content-Type', /json/)
        .expect(400)
        .then((res) => {
          expect(res.body.error).toBe('"email" is required');
        });
    });
    it('duplicate email', async () => {
      // AAA => Arrange, Act, Assert

      // Arrange => Setup
      await User.create({ email: 'test@mail.com', password: 'abcd1234' });

      // Act => effectuer une action, ici inscrire un user
      await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@mail.com', password: 'abcd1234' })
        // Assert
        .expect('Content-Type', /json/)
        .expect(409)
        .then((res) => {
          expect(res.body.error).toBe('a user already exists with this email');
        });
    });
    it('happy path', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@mail.com', password: 'abcd1234' })
        .expect('Content-Type', /json/)
        .expect(201)
        .then((res) => {
          expect(Object.keys(res.body)).toEqual(['userId', 'jwt']);
        });
    });
  });
});
