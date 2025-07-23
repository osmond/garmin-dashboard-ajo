
const { GarminConnect } = require('garmin-connect');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const gcClient = new GarminConnect();

function ensureGarminCredentials() {
  if (!process.env.GARMIN_EMAIL) {
    throw new Error('Missing GARMIN_EMAIL environment variable.');
  }
  if (!process.env.GARMIN_PASSWORD) {
    throw new Error('Missing GARMIN_PASSWORD environment variable.');
  }
}

function toDateString(date) {
  const offset = date.getTimezoneOffset();
  const offsetDate = new Date(date.getTime() - offset * 60 * 1000);
  return offsetDate.toISOString().split('T')[0];
}

async function getStepsData(date) {
  const profile = await gcClient.getUserProfile();
  const dateString = toDateString(date);
  const url = `${gcClient.url.GC_API}/wellness-service/wellness/dailySummaryChart/${profile.displayName}`;
  return gcClient.client.get(url, { params: { date: dateString } });
}

async function getIntensityMinutes(date) {
  const profile = await gcClient.getUserProfile();
  const dateString = toDateString(date);
  const url = `${gcClient.url.GC_API}/wellness-service/wellness/dailyIntensityMinutes/${profile.displayName}`;
  const data = await gcClient.client.get(url, { params: { date: dateString } });
  return data.intensityMinutes || 0;
}

async function getTrainingLoad(date) {
  const dateString = toDateString(date);
  const url = `${gcClient.url.GC_API}/training-service/v2/athlete/trainingload/${dateString}`;
  const data = await gcClient.client.get(url);
  return data.trainingLoad || 0;
}

async function getBodyBattery(date) {
  const profile = await gcClient.getUserProfile();
  const dateString = toDateString(date);
  const url = `${gcClient.url.GC_API}/wellness-service/wellness/bodyBattery/${profile.displayName}`;
  const data = await gcClient.client.get(url, { params: { date: dateString } });
  return data.bodyBattery || 0;
}

async function login() {
  ensureGarminCredentials();
  await gcClient.login(process.env.GARMIN_EMAIL, process.env.GARMIN_PASSWORD);
}

async function writeToInflux(summary) {
  if (!process.env.INFLUX_URL || !process.env.INFLUX_TOKEN || !process.env.INFLUX_ORG || !process.env.INFLUX_BUCKET) return;

  const influx = new InfluxDB({ url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN });
  const writeApi = influx.getWriteApi(process.env.INFLUX_ORG, process.env.INFLUX_BUCKET);
  const point = new Point('garmin_summary')
    .floatField('steps', summary.steps)
    .floatField('resting_hr', summary.resting_hr)
    .floatField('vo2max', summary.vo2max || 0)
    .floatField('sleep_hours', summary.sleep_hours)
    .floatField('intensity_minutes', summary.intensity_minutes)
    .floatField('training_load', summary.training_load)
    .floatField('body_battery', summary.body_battery);
  writeApi.writePoint(point);
  await writeApi.close();
}

async function fetchGarminSummary() {
  await login();

  const today = new Date();
  const steps = await gcClient.getSteps(today);
  const hr = await gcClient.getHeartRate(today);
  const sleep = await gcClient.getSleepData(today);
  const stepsData = await getStepsData(today);
  const intensity = await getIntensityMinutes(today);
  const training = await getTrainingLoad(today);
  const battery = await getBodyBattery(today);

  const summary = {
    steps,
    resting_hr: hr.restingHeartRate,
    vo2max: hr.vo2max || 0,
    sleep_hours: (sleep.dailySleepDTO.sleepTimeSeconds || 0) / 3600,
    intensity_minutes: intensity,
    training_load: training,
    body_battery: battery,
    stepsChart: {
      labels: stepsData.map(d => new Date(d.startGMT).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })),
      datasets: [{
        label: 'Steps',
        data: stepsData.map(d => d.steps),
        fill: true,
        backgroundColor: 'rgba(0, 123, 255, 0.1)',
        borderColor: 'rgba(0, 123, 255, 1)',
        tension: 0.3,
      }],
    },
  };

  await writeToInflux(summary);
  return summary;
}

async function fetchWeeklySummary() {
  if (!process.env.INFLUX_URL || !process.env.INFLUX_TOKEN || !process.env.INFLUX_ORG || !process.env.INFLUX_BUCKET) {
    return [];
  }
  const influx = new InfluxDB({ url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN });
  const queryApi = influx.getQueryApi(process.env.INFLUX_ORG);
  const query = `from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: -7d)
    |> filter(fn: (r) => r._measurement == "garmin_summary")
    |> pivot(rowKey:["_time"], columnKey: ["_field"], valueColumn: "_value")`;
  const results = [];
  await queryApi.collectRows(query, (row, tableMeta) => {
    const o = tableMeta.toObject(row);
    results.push({
      time: o._time,
      steps: o.steps,
      resting_hr: o.resting_hr,
      vo2max: o.vo2max,
      sleep_hours: o.sleep_hours,
      intensity_minutes: o.intensity_minutes,
      training_load: o.training_load,
      body_battery: o.body_battery,
    });
  });
  return results;
}

module.exports = { fetchGarminSummary, fetchWeeklySummary };
