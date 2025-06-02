// small tests to confirm that various aspects of our health check route work

// tests/unit/health.test.js

import request from 'supertest';


import app from '../src/server';
// Get the version and author from our package.json

describe('/ health check', () => {
  test('should return HTTP 200 response', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBe(200);
  });
});
