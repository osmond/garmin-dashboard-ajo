const mockSteps = 1234;
const mockHr = { restingHeartRate: 60, vo2max: 50 };
const mockSleep = { dailySleepDTO: { sleepTimeSeconds: 28800 } };
const mockStepsData = [
  { startGMT: new Date('2024-01-01T00:00:00Z').toISOString(), steps: 100 },
];

let fetchGarminSummary;
let fetchActivityRoute;
let fetchRecentActivities;
let gcClient;

jest.mock('garmin-connect', () => {
  const instance = {
    setSession: jest.fn(),
    getSteps: jest.fn().mockResolvedValue(mockSteps),
    getHeartRate: jest.fn().mockResolvedValue(mockHr),
    getSleepData: jest.fn().mockResolvedValue(mockSleep),
    client: { get: jest.fn() },
    url: { DOWNLOAD_GPX: 'gpx/' },
  };
  return { GarminConnect: jest.fn(() => instance), instance };
});



describe('fetchGarminSummary', () => {
  beforeEach(async () => {
    delete process.env.INFLUX_URL;
    delete process.env.GARMIN_COOKIE_PATH;
    jest.resetModules();
    ({ fetchGarminSummary, fetchActivityRoute, fetchRecentActivities } = require('../scraper'));
    ({ instance: gcClient } = require('garmin-connect'));
    const fs = require('fs');
    const path = require('path');
    const cookiePath = path.join(__dirname, 'session.json');
    await fs.promises.writeFile(
      cookiePath,
      JSON.stringify({ oauth1: 'a', oauth2: 'b' })
    );
    process.env.GARMIN_COOKIE_PATH = cookiePath;
  });

  afterEach(async () => {
    const fs = require('fs');
    const path = require('path');
    const cookiePath = path.join(__dirname, 'session.json');
    try {
      await fs.promises.unlink(cookiePath);
    } catch {}
  });

  it('returns formatted summary', async () => {
    const summary = await fetchGarminSummary();
    expect(summary).toHaveProperty('steps', mockSteps);
    expect(summary).toHaveProperty('resting_hr', mockHr.restingHeartRate);
    expect(summary).toHaveProperty('vo2max', mockHr.vo2max);
    expect(summary).toHaveProperty('sleep_hours', 8);
  });

  it('uses cookie file when present', async () => {
    await fetchGarminSummary();
    expect(gcClient.setSession).toHaveBeenCalledWith({ oauth1: 'a', oauth2: 'b' });
  });

  it('throws when cookie missing', async () => {
    process.env.GARMIN_COOKIE_PATH = '/no/such/file.json';
    await expect(fetchGarminSummary()).rejects.toThrow('Cookie file not found');
  });
});

describe('fetchActivityRoute', () => {
  beforeEach(async () => {
    const fs = require('fs');
    const path = require('path');
    const cookiePath = path.join(__dirname, 'session.json');
    await fs.promises.writeFile(
      cookiePath,
      JSON.stringify({ oauth1: 'a', oauth2: 'b' })
    );
    process.env.GARMIN_COOKIE_PATH = cookiePath;
    gcClient.client.get.mockResolvedValue(
      '<gpx><trk><trkseg><trkpt lat="1" lon="2" /></trkseg></trk></gpx>'
    );
  });

  afterEach(async () => {
    const fs = require('fs');
    const path = require('path');
    const cookiePath = path.join(__dirname, 'session.json');
    try {
      await fs.promises.unlink(cookiePath);
    } catch {}
  });

  it('parses gpx data', async () => {
    const points = await fetchActivityRoute('123');
    expect(points).toEqual([{ lat: 1, lon: 2 }]);
    expect(gcClient.client.get).toHaveBeenCalledWith('gpx/123');
  });
});

describe('fetchRecentActivities', () => {
  beforeEach(async () => {
    const fs = require('fs');
    const path = require('path');
    const cookiePath = path.join(__dirname, 'session.json');
    await fs.promises.writeFile(
      cookiePath,
      JSON.stringify({ oauth1: 'a', oauth2: 'b' })
    );
    process.env.GARMIN_COOKIE_PATH = cookiePath;
    gcClient.getActivities = jest.fn().mockResolvedValue([
      {
        activityId: 1,
        activityName: 'Run',
        startTimeLocal: '2024-01-01T00:00:00',
      },
      {
        activityId: 2,
        activityName: 'Ride',
        startTimeLocal: '2024-01-02T00:00:00',
      },
    ]);
  });

  afterEach(async () => {
    const fs = require('fs');
    const path = require('path');
    const cookiePath = path.join(__dirname, 'session.json');
    try {
      await fs.promises.unlink(cookiePath);
    } catch {}
  });

  it('returns simplified activity list', async () => {
    const acts = await fetchRecentActivities();
    expect(acts).toEqual([
      { id: '1', name: 'Run', date: '2024-01-01T00:00:00' },
      { id: '2', name: 'Ride', date: '2024-01-02T00:00:00' },
    ]);
    expect(gcClient.getActivities).toHaveBeenCalledWith(0, 10);
  });

  it('uses provided limit', async () => {
    await fetchRecentActivities(5);
    expect(gcClient.getActivities).toHaveBeenCalledWith(0, 5);
  });
});
