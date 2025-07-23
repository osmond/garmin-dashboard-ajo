const request = require('supertest');

jest.mock('../scraper', () => ({
  fetchGarminSummary: jest.fn().mockResolvedValue({ steps: 1 })
}));

const app = require('../index');
const { fetchGarminSummary } = require('../scraper');

describe('GET /api/summary', () => {
  it('responds with summary json', async () => {
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ steps: 1 });
    expect(fetchGarminSummary).toHaveBeenCalled();
  });
});
