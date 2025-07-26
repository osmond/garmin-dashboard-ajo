#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { login, gcClient } = require('../api/scraper');
const { InfluxDB, Point } = require('@influxdata/influxdb-client');

const args = process.argv.slice(2);

let checkpointPath = path.resolve('.backfill-checkpoint');
const ckIdx = args.indexOf('--checkpoint');
if (ckIdx !== -1) {
  checkpointPath = path.resolve(args[ckIdx + 1]);
  args.splice(ckIdx, 2);
}

const resetIdx = args.indexOf('--reset');
const reset = resetIdx !== -1;
if (reset) {
  args.splice(resetIdx, 1);
  if (fs.existsSync(checkpointPath)) {
    fs.unlinkSync(checkpointPath);
  }
}

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

if (!reset && fs.existsSync(checkpointPath)) {
  const lastStr = fs.readFileSync(checkpointPath, 'utf8').trim();
  const last = new Date(lastStr);
  if (!isNaN(last)) {
    const next = new Date(last);
    next.setDate(next.getDate() + 1);
    if (next > start) {
      start = next;
    }
  }
}

if (start > end) {
  console.log('Nothing to backfill');
  process.exit(0);
}

(async () => {
  try {
    await login();
  } catch (err) {
    console.error('Login failed:', err.message);
    process.exit(1);
  }
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

  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    const date = new Date(d);
    const dateStr = date.toISOString().slice(0, 10);
    console.log(`Backfilling ${dateStr}...`);
    try {
      const [steps, hr, sleep] = await Promise.all([
        gcClient.getSteps(date),
        gcClient.getHeartRate(date),
        gcClient.getSleepData(date),
      ]);
      const summary = {
        steps,
        resting_hr: hr.restingHeartRate,
        vo2max: hr.vo2max || 0,
        sleep_hours: (sleep.dailySleepDTO.sleepTimeSeconds || 0) / 3600,
        time: date.toISOString(),
      };
      const writeApi = influx.getWriteApi(
        process.env.INFLUX_ORG,
        process.env.INFLUX_BUCKET
      );
      const p = new Point('garmin_summary')
        .floatField('steps', summary.steps)
        .floatField('resting_hr', summary.resting_hr)
        .floatField('vo2max', summary.vo2max || 0)
        .floatField('sleep_hours', summary.sleep_hours);
      if (summary.time) {
        p.timestamp(new Date(summary.time));
      }
      writeApi.writePoint(p);
      await writeApi.close();
      fs.writeFileSync(checkpointPath, dateStr);
      console.log(`Stored ${dateStr}`);
    } catch (err) {
      console.error(`Failed to backfill ${dateStr}:`, err.message);
    }
  }
})();
