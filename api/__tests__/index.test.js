const request = require('supertest');

jest.mock('../scraper', () => ({
  fetchGarminSummary: jest.fn(),
  fetchWeeklySummary: jest.fn(),
  fetchSummaryByDate: jest.fn()
}));

const app = require('../index');
const { fetchGarminSummary, fetchWeeklySummary, fetchSummaryByDate } = require('../scraper');

describe('GET /api/summary', () => {
  it('responds with summary json', async () => {
    fetchGarminSummary.mockResolvedValue({ steps: 1 });
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ steps: 1 });
    expect(fetchGarminSummary).toHaveBeenCalled();
  });

  it('returns 500 on error', async () => {
    fetchGarminSummary.mockRejectedValue(new Error('boom'));
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to fetch Garmin data' });
  });

  it('returns cookie path error', async () => {
    fetchGarminSummary.mockRejectedValue(new Error('Cookie file not found'));
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Cookie file not found' });
  });
});

describe('GET /api/weekly', () => {
  it('responds with weekly data', async () => {
    fetchWeeklySummary.mockResolvedValue([{ time: '2024-01-01', steps: 1 }]);
    const res = await request(app).get('/api/weekly');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ time: '2024-01-01', steps: 1 }]);
    expect(fetchWeeklySummary).toHaveBeenCalled();
  });

  it('returns 500 on error', async () => {
    fetchWeeklySummary.mockRejectedValue(new Error('boom'));
    const res = await request(app).get('/api/weekly');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to query InfluxDB' });
  });
});

describe('GET /api/day/:date', () => {
  it('responds with daily data', async () => {
    fetchSummaryByDate.mockResolvedValue({ steps: 2 });
    const res = await request(app).get('/api/day/2024-01-01');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ steps: 2 });
    expect(fetchSummaryByDate).toHaveBeenCalledWith('2024-01-01');
  });

  it('returns 404 when missing', async () => {
    fetchSummaryByDate.mockResolvedValue(null);
    const res = await request(app).get('/api/day/2024-01-01');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'No data' });
  });

  it('returns 500 on error', async () => {
    fetchSummaryByDate.mockRejectedValue(new Error('fail'));
    const res = await request(app).get('/api/day/2024-01-01');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to query InfluxDB' });
  });
});

describe('Unknown routes', () => {
  it('responds with 404', async () => {
    const res = await request(app).get('/does/not/exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
