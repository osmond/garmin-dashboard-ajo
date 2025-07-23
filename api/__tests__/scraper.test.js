const mockSteps = 1234;
const mockHr = { restingHeartRate: 60, vo2max: 50 };
const mockSleep = { dailySleepDTO: { sleepTimeSeconds: 28800 } };
const mockStepsData = [
  { startGMT: new Date('2024-01-01T00:00:00Z').toISOString(), steps: 100 },
];
const mockIntensity = 30;
const mockTraining = 500;
const mockBattery = 75;

let fetchGarminSummary;
let gcClient;

jest.mock('garmin-connect', () => {
  const instance = {
    setSession: jest.fn(),
    getSteps: jest.fn().mockResolvedValue(mockSteps),
    getHeartRate: jest.fn().mockResolvedValue(mockHr),
    getSleepData: jest.fn().mockResolvedValue(mockSleep),
    getIntensityMinutes: jest.fn().mockResolvedValue(mockIntensity),
    getTrainingLoad: jest.fn().mockResolvedValue(mockTraining),
    getBodyBattery: jest.fn().mockResolvedValue(mockBattery),
    getUserProfile: jest.fn().mockResolvedValue({ displayName: 'user' }),
    client: {
      get: jest
        .fn()
        .mockResolvedValueOnce(mockStepsData)
        .mockResolvedValueOnce({ intensityMinutes: mockIntensity })
        .mockResolvedValueOnce({ trainingLoad: mockTraining })
        .mockResolvedValueOnce({ bodyBattery: mockBattery })
    },
    url: { GC_API: 'http://mock' },
  };
  return { GarminConnect: jest.fn(() => instance), instance };
});



describe('fetchGarminSummary', () => {
  beforeEach(async () => {
    delete process.env.INFLUX_URL;
    delete process.env.GARMIN_COOKIE_PATH;
    jest.resetModules();
    ({ fetchGarminSummary } = require('../scraper'));
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
    expect(summary).toHaveProperty('intensity_minutes', mockIntensity);
    expect(summary).toHaveProperty('training_load', mockTraining);
    expect(summary).toHaveProperty('body_battery', mockBattery);
    expect(summary.stepsChart.datasets[0].data[0]).toBe(100);
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
