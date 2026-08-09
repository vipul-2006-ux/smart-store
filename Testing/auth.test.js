const request = require('supertest');
const app = require('../../src/app');

describe('Auth API Endpoints', () => {
  it('should register a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser',
        email: 'test@smartstore.com',
        password: 'Password123!',
        role: 'USER'
      });
    
    // We expect 201 Created or 200 OK depending on implementation
    expect([200, 201]).toContain(res.statusCode);
    expect(res.body).toHaveProperty('success', true);
  });

  it('should not allow registration with existing email', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        username: 'testuser2',
        email: 'test@smartstore.com',
        password: 'Password123!'
      });
    
    expect(res.statusCode).toEqual(400);
    expect(res.body.success).toBe(false);
  });

  it('should login user and return JWT token', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        username: 'testuser',
        password: 'Password123!'
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('token');
  });
});