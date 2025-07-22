const { InfluxDB, Point } = require('@influxdata/influxdb-client');
const dotenv = require('dotenv');
dotenv.config();

const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url: process.env.INFLUX_URL, token });

const writeApi = client.getWriteApi(org, bucket, 'ns');
writeApi.useDefaultTags({ host: 'host1' });

function writeGarminSummary({ steps, vo2max, resting_hr, sleep_hours }) {
  const point = new Point('daily_summary')
    .intField('steps', steps)
    .intField('vo2max', vo2max)
    .intField('resting_hr', resting_hr)
    .floatField('sleep_hours', sleep_hours);

  writeApi.writePoint(point);
  return writeApi.flush();
}

const queryApi = client.getQueryApi(org);

async function fetchGarminSummary() {
  const query = `
    from(bucket: "${bucket}")
      |> range(start: -1d)
      |> filter(fn: (r) => r._measurement == "garmin")
      |> filter(fn: (r) => r._field == "steps" or r._field == "resting_hr" or r._field == "vo2max" or r._field == "sleep_hours")
      |> last()
  `;

  const summary = {
    steps: null,
    resting_hr: null,
    vo2max: null,
    sleep_hours: null,
  };

  await queryApi.collectRows(query, {
    next(row, tableMeta) {
      const o = tableMeta.toObject(row);
      summary[o._field] = o._value;
    },
    error(error) {
      console.error('Query error', error);
    },
    complete() {
      console.log('Query complete');
    },
  });

  return summary;
}

module.exports = { writeGarminSummary, fetchGarminSummary };
