#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });
const { login, writeToInflux, gcClient } = require('../api/scraper');

if (!process.env.GARMIN_COOKIE_PATH) {
  const sessionPath = path.resolve(__dirname, '../.session');
  if (fs.existsSync(sessionPath)) {
    process.env.GARMIN_COOKIE_PATH = sessionPath;
  }
}

if (!process.env.GARMIN_COOKIE_PATH) {
  console.error('GARMIN_COOKIE_PATH not set and no .session file found');
  process.exit(1);
}

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

  for (
    let d = new Date(start);
    d <= end;
    d.setDate(d.getDate() + 1)
  ) {
    const dateStr = d.toISOString().slice(0, 10);
    console.log(`Backfilling ${dateStr}...`);
    try {
      const steps = await gcClient.getSteps(d);
      const hr = await gcClient.getHeartRate(d);
      const sleep = await gcClient.getSleepData(d);
      const summary = {
        steps,
        resting_hr: hr.restingHeartRate,
        vo2max: hr.vo2max || 0,
        sleep_hours: (sleep.dailySleepDTO.sleepTimeSeconds || 0) / 3600,
        time: d.toISOString(),
      };
      await writeToInflux(summary);
      console.log(`Stored data for ${dateStr}`);
    } catch (err) {
      console.error(`Failed to backfill ${dateStr}:`, err.message);
    }
  }
})();
