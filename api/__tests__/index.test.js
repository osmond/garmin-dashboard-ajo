const request = require('supertest');

jest.mock('../scraper.ts', () => ({
  fetchGarminSummary: jest.fn(),
  fetchWeeklySummary: jest.fn(),
  fetchHistory: jest.fn(),
  fetchActivityRoute: jest.fn(),
  fetchRecentActivities: jest.fn(),
}));

// Avoid loading the real config which uses ES module syntax
jest.mock('../config', () => ({}));

let app;
let fetchGarminSummary;
let fetchWeeklySummary;
let fetchHistory;
let fetchActivityRoute;
let fetchRecentActivities;

beforeEach(() => {
  jest.resetModules();
  ({
    fetchGarminSummary,
    fetchWeeklySummary,
    fetchHistory,
    fetchActivityRoute,
    fetchRecentActivities,
  } = require('../scraper.ts'));
  app = require('../index.ts').default;
});

describe('GET /api/summary', () => {
  it('responds with summary json', async () => {
    fetchGarminSummary.mockResolvedValue({ steps: 1 });
    const res = await request(app).get('/api/summary');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ steps: 1 });
  });

  it('uses cached result on subsequent requests', async () => {
    fetchGarminSummary.mockResolvedValue({ steps: 2 });
    const first = await request(app).get('/api/summary');
    expect(first.body).toEqual({ steps: 2 });

    fetchGarminSummary.mockClear();
    const second = await request(app).get('/api/summary');
    expect(second.status).toBe(200);
    expect(second.body).toEqual({ steps: 2 });
    expect(fetchGarminSummary).not.toHaveBeenCalled();
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

  it('defaults to 7 days when parameter is missing', async () => {
    fetchHistory.mockResolvedValue([{ time: '2024-01-01', steps: 1 }]);
    const res = await request(app).get('/api/history');
    expect(res.status).toBe(200);
    expect(fetchHistory).toHaveBeenCalledWith(7);
  });

  it('returns 400 when days parameter is invalid', async () => {
    const res = await request(app).get('/api/history?days=-5');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid days parameter' });
    expect(fetchHistory).not.toHaveBeenCalled();
  });

  it('returns 400 when days parameter exceeds maximum', async () => {
    const res = await request(app).get('/api/history?days=4000');
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ error: 'Invalid days parameter' });
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

describe('GET /api/health', () => {
  it('responds with ok status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: 'ok' });
  });
});

describe('Unknown routes', () => {
  it('responds with 404', async () => {
    const res = await request(app).get('/does/not/exist');
    expect(res.status).toBe(404);
    expect(res.body).toEqual({ error: 'Not found' });
  });
});
