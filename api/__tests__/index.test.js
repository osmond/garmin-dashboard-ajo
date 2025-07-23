const request = require('supertest');

jest.mock('../scraper', () => ({
  fetchGarminSummary: jest.fn(),
  fetchWeeklySummary: jest.fn(),
  fetchHistory: jest.fn(),
  fetchActivityRoute: jest.fn(),
  fetchRecentActivities: jest.fn(),
}));

const app = require('../index');
const {
  fetchGarminSummary,
  fetchWeeklySummary,
  fetchHistory,
  fetchActivityRoute,
  fetchRecentActivities,
} = require('../scraper');

describe('GET /api/summary', () => {
  it('responds with summary json', async () => {
    fetchGarminSummary.mockResolvedValue({ steps: 1 });
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ steps: 1 });
  });

  it('returns 500 on error', async () => {
    fetchGarminSummary.mockRejectedValue(new Error('boom'));
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(500);
    expect(res.body).toEqual({ error: 'Failed to fetch Garmin data' });
  });
});

describe('GET /api/weekly', () => {
  it('responds with weekly data', async () => {
    fetchWeeklySummary.mockResolvedValue([{ time: '2024-01-01', steps: 1 }]);
    const res = await request(app).get('/api/weekly');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ time: '2024-01-01', steps: 1 }]);
  });
});

describe('GET /api/history', () => {
  it('responds with history data', async () => {
    fetchHistory.mockResolvedValue([{ time: '2024-01-01', steps: 1 }]);
    const res = await request(app).get('/api/history?days=30');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ time: '2024-01-01', steps: 1 }]);
    expect(fetchHistory).toHaveBeenCalledWith(30);
  });
});

describe('GET /api/activity/:id', () => {
  it('responds with route points', async () => {
    fetchActivityRoute.mockResolvedValue([{ lat: 1, lon: 2 }]);
    const res = await request(app).get('/api/activity/123');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ lat: 1, lon: 2 }]);
    expect(fetchActivityRoute).toHaveBeenCalledWith('123');
  });
});

describe('GET /api/activities', () => {
  it('returns recent activities', async () => {
    fetchRecentActivities.mockResolvedValue([{ id: '1', name: 'Run' }]);
    const res = await request(app).get('/api/activities');
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: '1', name: 'Run' }]);
  });

  it('passes limit query parameter', async () => {
    fetchRecentActivities.mockResolvedValue([]);
    const res = await request(app).get('/api/activities?limit=5');
    expect(res.status).toBe(200);
    expect(fetchRecentActivities).toHaveBeenCalledWith(5);
  });
});

describe('Unknown routes', () => {
  it('responds with 404', async () => {
    const res = await request(app).get('/does/not/exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
