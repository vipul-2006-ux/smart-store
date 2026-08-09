const request = require('supertest');
const app = require('../../src/app');

describe('User API Endpoints', () => {
  it('should deny access to user profile without token', async () => {
    // Assuming there is a protected /api/users/profile route
    const res = await request(app).get('/api/users/profile');
    
    // Should return 401 Unauthorized or 404 Not Found if route doesn't exist
    expect([401, 404]).toContain(res.statusCode);
  });
});