import request from 'supertest';
import argon2 from 'argon2';

import app from '../../src/app';
import User from '../../src/models/User';

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

interface IErrorCase {
  title: string;
  data: { email: string; password: string };
  errorMessage: string;
  code?: number;
}

const errorCases: IErrorCase[] = [
  {
    title: 'empty email & password',
    data: { email: '', password: '' },
    errorMessage: '"email" is required',
  },
  {
    title: 'invalid email',
    data: { email: 'email', password: '' },
    errorMessage: '"email" is invalid',
  },
  {
    title: 'empty password',
    data: { email: 'test@email.net', password: '' },
    errorMessage: '"password" is required',
  },
];

describe('auth controller', () => {
  describe('signup route', () => {
    errorCases.forEach(({ title, data, errorMessage }) => {
      it(title, async () => {
        // Act => effectuer une action, ici inscrire un user
        await testPost('/api/auth/signup', data, 400).then((res) => {
          expect(res.body.error).toBe(errorMessage);
        });
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

  describe('signin route', () => {
    const signinErrorCases = [
      ...errorCases,
      {
        title: 'non-existent user',
        data: { email: 'notfound@email.com', password: 'abcd1234' },
        errorMessage: 'wrong credentials',
        code: 401,
      },
    ];
    signinErrorCases.forEach(({ title, data, errorMessage, code }) => {
      it(title, async () => {
        // Act => effectuer une action, ici inscrire un user
        await testPost('/api/auth/signin', data, code || 400).then((res) => {
          expect(res.body.error).toBe(errorMessage);
        });
      });
    });

    it('wrong password', async () => {
      // Arrange => Setup
      const password = await argon2.hash('abcd1234');
      await User.create({ email: 'test@mail.com', password });
      await request(app)
        .post('/api/auth/signin')
        .send({ email: 'test@mail.com', password: 'badpass!' })
        .expect('Content-Type', /json/)
        .expect(401)
        .then((res) => {
          expect(res.body.error).toBe('wrong credentials');
        });
    });

    it('happy path', async () => {
      // Arrange => Setup
      const password = await argon2.hash('abcd1234');
      await User.create({ email: 'test@mail.com', password });
      await request(app)
        .post('/api/auth/signin')
        .send({ email: 'test@mail.com', password: 'abcd1234' })
        .expect('Content-Type', /json/)
        .expect(200)
        .then((res) => {
          expect(Object.keys(res.body)).toEqual(['userId', 'jwt']);
        });
    });
  });
});
