
const { GarminConnect } = require('garmin-connect');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const gcClient = new GarminConnect();

async function login() {
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
    .floatField('sleep_hours', summary.sleep_hours);
  writeApi.writePoint(point);
  await writeApi.close();
}

async function fetchGarminSummary() {
  await login();

  const today = new Date();
  const steps = await gcClient.getSteps(today);
  const hr = await gcClient.getHeartRate(today);
  const sleep = await gcClient.getSleepData(today);

  const summary = {
    steps,
    resting_hr: hr.restingHeartRate,
    vo2max: hr.vo2max || 0,
    sleep_hours: (sleep.dailySleepDTO.sleepTimeSeconds || 0) / 3600,
    stepsChart: {
      labels: [],
      datasets: [{
        label: 'Steps',
        data: [],
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

module.exports = { fetchGarminSummary };
