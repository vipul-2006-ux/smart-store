const request = require('supertest');
const app = require('../../src/app');

describe('Product API Endpoints', () => {
  it('should fetch all products successfully', async () => {
    const res = await request(app).get('/api/products');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
  });

  it('should fetch categories successfully', async () => {
    const res = await request(app).get('/api/products/categories');
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toBeDefined();
  });
});