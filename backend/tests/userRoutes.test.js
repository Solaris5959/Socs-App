/**
 * Users Routes Test Suite
 *
 * Tests all 6 authentication functions:
 * - POST /register
 * - POST /login
 * - GET /session
 * - POST /forgot-password
 * - POST /update-password
 * - POST /reset-password
 */

const request = require('supertest');
const express = require('express');

// Create mocks
const mockLogger = {
  debug: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
  warn: jest.fn()
};

const mockSupabase = {
  auth: {
    signUp: jest.fn(),
    signInWithPassword: jest.fn(),
    getUser: jest.fn(),
    resetPasswordForEmail: jest.fn(),
    updateUser: jest.fn(),
    setSession: jest.fn()
  },
  from: jest.fn()
};

const mockSupabaseAdmin = {
  auth: {
    admin: {
      updateUserById: jest.fn()
    }
  }
};

const mockJwt = {
  decode: jest.fn()
};

jest.mock('../src/logger.js',       () => mockLogger);
jest.mock('../src/lib/supabaseClient.js', () => mockSupabase);
jest.mock('../src/lib/supabaseAdmin.js',  () => mockSupabaseAdmin);
jest.mock('jsonwebtoken',           () => mockJwt);

const app = express();
app.use(express.json());
const usersRouter = require('../src/routes/userRoutes.js');
app.use('/users', usersRouter.default || usersRouter);

describe('Users Routes Test Suite', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // mock the profile update call in login
    mockSupabase.from = jest.fn(() => ({
      update: jest.fn(() => ({
        eq: jest.fn(() => ({ error: null }))
      }))
    }));

    // ⬇️ Ensure setSession is always mocked
    mockSupabase.auth.setSession.mockResolvedValue({ data: {}, error: null });
  });

  // ====== REGISTER ENDPOINT TESTS ======
  describe('POST /users/register', () => {
    it('should register user successfully', async () => {
      const mockUser = { id: 'user123', email: 'test@example.com', user_metadata: { display_name: 'Test User' } };
      mockSupabase.auth.signUp.mockResolvedValue({ data: { user: mockUser }, error: null });

      const res = await request(app)
        .post('/users/register')
        .send({ email: 'test@example.com', password: 'password123', displayname: 'Test User' });

      expect(res.status).toBe(201);
      expect(res.body).toEqual({ message: 'User registered successfully', user: mockUser });
    });

    it('should return 400 if email is missing', async () => {
      const res = await request(app).post('/users/register').send({ password: 'pw', displayname: 'Name' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing required fields' });
    });

    it('should return 400 if password is missing', async () => {
      const res = await request(app).post('/users/register').send({ email: 'me@test.com', displayname: 'Name' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing required fields' });
    });

    it('should return 400 if displayname is missing', async () => {
      const res = await request(app).post('/users/register').send({ email: 'me@test.com', password: 'pw' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing required fields' });
    });

    it('should handle Supabase auth errors', async () => {
      mockSupabase.auth.signUp.mockResolvedValue({ data: null, error: { message: 'Email exists' } });
      const res = await request(app)
        .post('/users/register')
        .send({ email: 'exists@test.com', password: 'pw', displayname: 'Name' });

      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Email exists' });
    });

    it('should handle unexpected errors', async () => {
      mockSupabase.auth.signUp.mockRejectedValue(new Error('Net err'));
      const res = await request(app)
        .post('/users/register')
        .send({ email: 'err@test.com', password: 'pw', displayname: 'Name' });

      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Internal server error' });
    });
  });

  // ====== LOGIN ENDPOINT TESTS ======
  describe('POST /users/login', () => {
    it('should login user successfully', async () => {
      const mockSession = { access_token: 'tok', refresh_token: 'ref', user: { id: 'u1', email: 'e@e.com' } };
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { session: mockSession, user: mockSession.user }, error: null });

      const res = await request(app).post('/users/login').send({ email: 'e@e.com', password: 'pw' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'User logged in successfully', session: mockSession });
    });

    it('should return 400 if email missing', async () => {
      const res = await request(app).post('/users/login').send({ password: 'pw' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing required fields' });
      expect(mockLogger.debug).toHaveBeenCalledWith('Login route missing param');
    });

    it('should return 400 if password missing', async () => {
      const res = await request(app).post('/users/login').send({ email: 'e@e.com' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Missing required fields' });
    });

    it('should handle invalid credentials', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { session: null }, error: { message: 'Bad creds' } });
      const res = await request(app).post('/users/login').send({ email: 'e@e.com', password: 'pw' });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Bad creds' });
    });

    it('should handle no session returned', async () => {
      mockSupabase.auth.signInWithPassword.mockResolvedValue({ data: { session: null }, error: null });
      const res = await request(app).post('/users/login').send({ email: 'e@e.com', password: 'pw' });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid credentials' });
      expect(mockLogger.debug).toHaveBeenCalledWith('Login Error:No session returned');
    });

    it('should handle unexpected errors', async () => {
      mockSupabase.auth.signInWithPassword.mockRejectedValue(new Error('Net err'));
      const res = await request(app).post('/users/login').send({ email: 'e@e.com', password: 'pw' });
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Internal server error' });
    });
  });

  // ====== SESSION TESTS ======
  describe('GET /users/session', () => {
    it('validates session', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: { id: 'u1', email: 'e@e.com' } }, error: null });
      const res = await request(app).get('/users/session').set('Authorization', 'Bearer tok');
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ user: { id: 'u1', email: 'e@e.com' } });
    });
    it('401 missing header', async () => {
      const res = await request(app).get('/users/session');
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Missing or invalid authorization header' });
    });
    it('401 bad format', async () => {
      const res = await request(app).get('/users/session').set('Authorization', 'Bad tok');
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Missing or invalid authorization header' });
    });
    it('401 invalid token', async () => {
      mockSupabase.auth.getUser.mockResolvedValue({ data: { user: null }, error: { message: 'Expired' } });
      const res = await request(app).get('/users/session').set('Authorization', 'Bearer bad');
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Invalid or expired token' });
    });
    it('handles errors', async () => {
      mockSupabase.auth.getUser.mockRejectedValue(new Error('Net'));
      const res = await request(app).get('/users/session').set('Authorization', 'Bearer tok');
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Internal server error' });
    });
  });

  // ====== FORGOT-PASSWORD TESTS ======
  describe('POST /users/forgot-password', () => {
    it('sends reset link', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: null });
      const res = await request(app).post('/users/forgot-password').send({ email: 'e@e.com' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Check your email for the password reset link' });
    });
    it('400 missing email', async () => {
      const res = await request(app).post('/users/forgot-password').send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Email is required' });
    });
    it('400 supabase error', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockResolvedValue({ error: { message: 'Not found' } });
      const res = await request(app).post('/users/forgot-password').send({ email: 'no@no.com' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Not found' });
    });
    it('handles errors', async () => {
      mockSupabase.auth.resetPasswordForEmail.mockRejectedValue(new Error('SMTP err'));
      const res = await request(app).post('/users/forgot-password').send({ email: 'e@e.com' });
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Internal server error' });
    });
  });

  // ====== UPDATE-PASSWORD TESTS ======
  describe('POST /users/update-password', () => {
    it('updates password', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({ error: null });
      // setSession already mocked in beforeEach
      const res = await request(app)
        .post('/users/update-password')
        .set('Authorization', 'Bearer tok')
        .send({ newPassword: 'newpw' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Password updated successfully' });
    });
    it('401 missing header', async () => {
      const res = await request(app).post('/users/update-password').send({ newPassword: 'newpw' });
      expect(res.status).toBe(401);
      expect(res.body).toEqual({ message: 'Missing or invalid authorization header' });
    });
    it('400 missing newPassword', async () => {
      const res = await request(app)
        .post('/users/update-password')
        .set('Authorization', 'Bearer tok')
        .send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'New password is required' });
    });
    it('handles supabase error', async () => {
      mockSupabase.auth.updateUser.mockResolvedValue({ error: { message: 'Weak' } });
      const res = await request(app)
        .post('/users/update-password')
        .set('Authorization', 'Bearer tok')
        .send({ newPassword: '123' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Weak' });
    });
  });

  // ====== RESET-PASSWORD TESTS ======
  describe('POST /users/reset-password', () => {
    it('resets password', async () => {
      const decoded = { sub: 'u1' };
      mockJwt.decode.mockReturnValue(decoded);
      mockSupabaseAdmin.auth.admin.updateUserById.mockResolvedValue({ error: null });
      const res = await request(app)
        .post('/users/reset-password')
        .send({ token: 'tok', newPassword: 'newpw' });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ message: 'Password has been reset successfully' });
    });
    it('400 missing token/newPassword', async () => {
      const res = await request(app).post('/users/reset-password').send({});
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Token and new password are required' });
    });
    it('400 invalid token', async () => {
      mockJwt.decode.mockReturnValue(null);
      const res = await request(app)
        .post('/users/reset-password')
        .send({ token: 'bad', newPassword: 'newpw' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid token' });
    });
    it('400 no sub field', async () => {
      mockJwt.decode.mockReturnValue({ foo: 'bar' });
      const res = await request(app)
        .post('/users/reset-password')
        .send({ token: 'tok', newPassword: 'newpw' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Invalid token' });
    });
    it('handles admin errors', async () => {
      mockJwt.decode.mockReturnValue({ sub: 'u1' });
      mockSupabaseAdmin.auth.admin.updateUserById.mockResolvedValue({ error: { message: 'Not found' } });
      const res = await request(app)
        .post('/users/reset-password')
        .send({ token: 'tok', newPassword: 'newpw' });
      expect(res.status).toBe(400);
      expect(res.body).toEqual({ message: 'Not found' });
    });
    it('handles unexpected errors', async () => {
      mockJwt.decode.mockImplementation(() => { throw new Error('fail'); });
      const res = await request(app)
        .post('/users/reset-password')
        .send({ token: 'tok', newPassword: 'newpw' });
      expect(res.status).toBe(500);
      expect(res.body).toEqual({ message: 'Internal server error' });
    });
  });
});
