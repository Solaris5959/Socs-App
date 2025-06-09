// small tests to confirm that various aspects of our health check route work

// tests/unit/health.test.js

import request from 'supertest';
import app from '../src/server';

describe('/ authenticated routes', () => {
  test('api routes with unathorized access', async () => {
    const res = await request(app).get('/socs/api/v1/index/test_auth')
    expect(res.statusCode).toBe(401);
    expect(res.body.error).toBe("No token provided")
  });

  test('User with valid token can access protected routes', async () => {
    const user= {
      email: process.env.AUTH_USER, 
      password: process.env.AUTH_PASS, 
    };

    const login = await request(app).post('/socs/api/v1/user/login')
    .send(user)
    expect(login.statusCode).toBe(200);
    expect(login.body.message).toBe("User logged in successfully")
  
    const protectedRes = await request(app)
    .get('/socs/api/v1/index/test_auth') // Access the protected route
    .set('Authorization', `Bearer ${login.body.session.access_token}`); // Include the token in the Authorization header
    expect(protectedRes.statusCode).toBe(200);
    expect(protectedRes.body.user).toBeDefined();
    
  })

});
