import request from 'supertest';

import app from '../../src/app';

describe('auth controller', () => {
  describe('signup route', () => {
    it('happy path', async () => {
      await request(app)
        .post('/api/auth/signup')
        // .send({ email: `test${Date.now()}@mail.com`, password: 'abcd1234' })
        .send({ email: 'test@mail.com', password: 'abcd1234' })
        .expect('Content-Type', /json/)
        .expect(201);
    });
  });
});
