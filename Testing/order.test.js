const request = require('supertest');
const app = require('../../src/app');

describe('Order API Endpoints', () => {
  it('should successfully place a guest order via v1 API', async () => {
    const res = await request(app)
      .post('/api/v1/orders/confirm')
      .send({
        totalAmount: 199.99,
        items: [
          { name: 'Wireless Mouse', price: 49.99 },
          { name: 'Mechanical Keyboard', price: 150.00 }
        ]
      });
    
    expect(res.statusCode).toEqual(200);
    expect(res.body.success).toBe(true);
    expect(res.body.message).toMatch(/Order placed/);
  });

  it('should fail to place an order without required payload', async () => {
    const res = await request(app).post('/api/v1/orders/confirm').send({});
    
    // Server should handle bad requests safely
    expect([400, 500]).toContain(res.statusCode);
  });
});