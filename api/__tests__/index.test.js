const request = require('supertest');

jest.mock('../scraper', () => ({
  fetchGarminSummary: jest.fn().mockResolvedValue({ steps: 1 }),
  fetchWeeklySummary: jest.fn().mockResolvedValue([{ time: '2024-01-01', steps: 1 }])
}));

const app = require('../index');
const { fetchGarminSummary, fetchWeeklySummary } = require('../scraper');

describe('GET /api/summary', () => {
  it('responds with summary json', async () => {
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ steps: 1 });
    expect(fetchGarminSummary).toHaveBeenCalled();
  });
});

describe('GET /api/weekly', () => {
  it('responds with weekly data', async () => {
    const res = await request(app).get('/api/weekly');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ time: '2024-01-01', steps: 1 }]);
    expect(fetchWeeklySummary).toHaveBeenCalled();
  });
});

describe('Unknown routes', () => {
  it('responds with 404', async () => {
    const res = await request(app).get('/does/not/exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
