
import { GarminConnect } from 'garmin-connect';
import { InfluxDB, Point } from '@influxdata/influxdb-client';
import fs from 'fs';
import path from 'path';
import { XMLParser } from 'fast-xml-parser';

const gcClient = new GarminConnect({ username: '', password: '' });

let sessionLoaded = false;
let lastTokenMtime = 0;

async function login() {
  if (!process.env.GARMIN_COOKIE_PATH) {
    throw new Error('GARMIN_COOKIE_PATH is required');
  }
  if (!path.isAbsolute(process.env.GARMIN_COOKIE_PATH)) {
    throw new Error('GARMIN_COOKIE_PATH must be an absolute path');
  }
  let stat;
  try {
    stat = await fs.promises.stat(process.env.GARMIN_COOKIE_PATH);
  } catch {
    throw new Error(
      `Cookie file not found: ${process.env.GARMIN_COOKIE_PATH}`
    );
  }
  if (sessionLoaded && lastTokenMtime === stat.mtimeMs) {
    return;
  }
  const file = await fs.promises.readFile(
    process.env.GARMIN_COOKIE_PATH,
    'utf8'
  );
  const data = JSON.parse(file);
  if (typeof gcClient.setSession === 'function') {
    gcClient.setSession(data);
  } else if (typeof gcClient.loadToken === 'function') {
    gcClient.loadToken(data.oauth1, data.oauth2);
  }
  sessionLoaded = true;
  lastTokenMtime = stat.mtimeMs;
}

async function writeToInflux(summary) {
  if (
    !process.env.INFLUX_URL ||
    !process.env.INFLUX_TOKEN ||
    !process.env.INFLUX_ORG ||
    !process.env.INFLUX_BUCKET
  ) {
    return;
  }

  const influx = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
  });
  const writeApi = influx.getWriteApi(
    process.env.INFLUX_ORG,
    process.env.INFLUX_BUCKET
  );
  const point = new Point('garmin_summary')
    .floatField('steps', summary.steps)
    .floatField('resting_hr', summary.resting_hr)
    .floatField('vo2max', summary.vo2max || 0)
    .floatField('sleep_hours', summary.sleep_hours);

  if (summary.time) {
    point.timestamp(new Date(summary.time));
  }

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
  };

  await writeToInflux(summary);
  return summary;
}

async function fetchHistory(days = 7) {
  if (!process.env.INFLUX_URL || !process.env.INFLUX_TOKEN || !process.env.INFLUX_ORG || !process.env.INFLUX_BUCKET) {
    return [];
  }
  const influx = new InfluxDB({ url: process.env.INFLUX_URL, token: process.env.INFLUX_TOKEN });
  const queryApi = influx.getQueryApi(process.env.INFLUX_ORG);
  const query = `from(bucket: "${process.env.INFLUX_BUCKET}")
    |> range(start: -${days}d)
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
    });
  });
  return results;
}


async function fetchWeeklySummary() {
  return fetchHistory(7);
}

async function fetchActivityRoute(activityId) {
  await login();
  let gpx;
  try {
    gpx = await gcClient.client.get(
      gcClient.url.DOWNLOAD_GPX + activityId
    );
  } catch (err) {
    console.error('Error downloading GPX', err);
    throw err;
  }
  if (!gpx) {
    console.error('No GPX returned for activity', activityId);
    throw new Error('Invalid GPX data');
  }
  let data;
  try {
    const parser = new XMLParser({ ignoreAttributes: false });
    data = parser.parse(gpx);
  } catch (err) {
    console.error('Failed to parse GPX:', err);
    console.error('GPX response:', gpx);
    throw new Error('Invalid GPX data');
  }
  const trkpts = data?.gpx?.trk?.trkseg?.trkpt;
  const arr = Array.isArray(trkpts) ? trkpts : trkpts ? [trkpts] : [];
  const points = arr.map(p => ({
    lat: parseFloat(p['@_lat']),
    lon: parseFloat(p['@_lon']),
  }));
  return points;
}
async function fetchRecentActivities(limit = 10) {
  await login();
  const acts = await gcClient.getActivities(0, limit);
  return acts.map(a => ({
    id: String(a.activityId),
    name: a.activityName || `Activity ${a.activityId}`,
    date: a.startTimeLocal || a.startTime || null,
  }));
}

export {
  fetchGarminSummary,
  fetchWeeklySummary,
  fetchHistory,
  fetchActivityRoute,
  fetchRecentActivities,
  login,
  writeToInflux,
  gcClient,
};

