#!/usr/bin/env node
const { login, gcClient } = require('../api/scraper');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const pLimit = require('p-limit');

const args = process.argv.slice(2);

function usage() {
  console.error('Usage: node scripts/backfill-garmin-history.js <start> <end>');
  console.error('   or: node scripts/backfill-garmin-history.js --days <n>');
  process.exit(1);
}

let start;
let end;

if (args.includes('--days')) {
  const idx = args.indexOf('--days');
  const days = parseInt(args[idx + 1], 10);
  if (isNaN(days) || days <= 0) usage();
  end = new Date();
  end.setHours(0, 0, 0, 0);
  start = new Date(end);
  start.setDate(start.getDate() - days + 1);
} else if (args.length >= 2) {
  start = new Date(args[0]);
  end = new Date(args[1]);
  if (isNaN(start) || isNaN(end)) usage();
  start.setHours(0, 0, 0, 0);
  end.setHours(0, 0, 0, 0);
  if (start > end) usage();
} else {
  usage();
}

(async () => {
  try {
    await login();
  } catch (err) {
    console.error('Login failed:', err.message);
    process.exit(1);
  }
  const dates = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    dates.push(new Date(d));
  }

  const limit = pLimit(5);
  const results = await Promise.all(
    dates.map(date =>
      limit(async () => {
        const dateStr = date.toISOString().slice(0, 10);
        console.log(`Backfilling ${dateStr}...`);
        try {
          const [steps, hr, sleep] = await Promise.all([
            gcClient.getSteps(date),
            gcClient.getHeartRate(date),
            gcClient.getSleepData(date),
          ]);
          return {
            steps,
            resting_hr: hr.restingHeartRate,
            vo2max: hr.vo2max || 0,
            sleep_hours: (sleep.dailySleepDTO.sleepTimeSeconds || 0) / 3600,
            time: date.toISOString(),
          };
        } catch (err) {
          console.error(`Failed to backfill ${dateStr}:`, err.message);
          return null;
        }
      })
    )
  );

  const summaries = results.filter(Boolean);

  if (
    !process.env.INFLUX_URL ||
    !process.env.INFLUX_TOKEN ||
    !process.env.INFLUX_ORG ||
    !process.env.INFLUX_BUCKET
  ) {
    console.error('InfluxDB environment variables not set; skipping write');
    return;
  }

  const influx = new InfluxDB({
    url: process.env.INFLUX_URL,
    token: process.env.INFLUX_TOKEN,
  });
  const BATCH_SIZE = 50;

  for (let i = 0; i < summaries.length; i += BATCH_SIZE) {
    const batch = summaries.slice(i, i + BATCH_SIZE);
    const writeApi = influx.getWriteApi(
      process.env.INFLUX_ORG,
      process.env.INFLUX_BUCKET
    );
    const points = batch.map(s => {
      const p = new Point('garmin_summary')
        .floatField('steps', s.steps)
        .floatField('resting_hr', s.resting_hr)
        .floatField('vo2max', s.vo2max || 0)
        .floatField('sleep_hours', s.sleep_hours);
      if (s.time) {
        p.timestamp(new Date(s.time));
      }
      return p;
    });
    writeApi.writePoints(points);
    await writeApi.close();
    console.log(`Stored ${batch.length} days`);
  }
})();
