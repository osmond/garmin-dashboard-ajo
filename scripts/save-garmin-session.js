#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
let GarminConnect;
try {
  ({ GarminConnect } = require('garmin-connect'));
} catch (e) {
  ({ GarminConnect } = require('../api/node_modules/garmin-connect'));
}

const args = process.argv.slice(2);
const outputArg = args[0] && !args[0].startsWith('--') ? args[0] : undefined;
// Use path from argument or GARMIN_COOKIE_PATH when the argument is omitted
const output = outputArg
  ? path.resolve(outputArg)
  : process.env.GARMIN_COOKIE_PATH
    ? path.resolve(process.env.GARMIN_COOKIE_PATH)
    : undefined;
if (!output) {
  console.error('Usage: node scripts/save-garmin-session.js [output-file] [--email <email>] [--password <password>]');
  console.error('Provide an output file or set GARMIN_COOKIE_PATH');
  process.exit(1);
}
function getArg(flag) {
  const index = args.indexOf(flag);
  return index !== -1 ? args[index + 1] : undefined;
}
const email = getArg('--email') || process.env.GARMIN_EMAIL;
const password = getArg('--password') || process.env.GARMIN_PASSWORD;

if (!email || !password) {
  console.error('GARMIN_EMAIL and GARMIN_PASSWORD are required');
  process.exit(1);
}

(async () => {
  try {
    const client = new GarminConnect({ username: email, password });
    await client.login();
    const tokens = client.exportToken();
    fs.writeFileSync(output, JSON.stringify(tokens, null, 2));
    console.log(`Session saved to ${output}`);
  } catch (err) {
    console.error('Failed to save session:', err.message);
    process.exit(1);
  }
})();
