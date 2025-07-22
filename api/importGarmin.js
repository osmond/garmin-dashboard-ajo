const { InfluxDB } = require('@influxdata/influxdb-client');

const url = process.env.INFLUX_URL;
const token = process.env.INFLUX_TOKEN;
const org = process.env.INFLUX_ORG;
const bucket = process.env.INFLUX_BUCKET;

const client = new InfluxDB({ url, token });
const queryApi = client.getQueryApi(org);

function fetchGarminSummary() {
  return new Promise((resolve, reject) => {
    const query = `
      from(bucket: "${bucket}")
        |> range(start: -1d)
        |> filter(fn: (r) => r._measurement == "garmin_daily")
    `;

    const summary = {
      steps: 0,
      resting_hr: 0,
      vo2max: 0,
      sleep_hours: 0,
      stepsChart: {
        labels: [],
        datasets: [
          {
            label: 'Steps',
            data: [],
            fill: true,
            backgroundColor: 'rgba(0, 123, 255, 0.1)',
            borderColor: 'rgba(0, 123, 255, 1)',
            tension: 0.3
          }
        ]
      }
    };

    queryApi.queryRows(query, {
      next(row, tableMeta) {
        const o = tableMeta.toObject(row);
        const t = new Date(o._time).toLocaleDateString('en-US', { weekday: 'short' });
        switch (o._field) {
          case 'steps':
            summary.stepsChart.labels.push(t);
            summary.stepsChart.datasets[0].data.push(o._value);
            summary.steps = o._value; // override with most recent
            break;
          case 'resting_hr':
            summary.resting_hr = o._value;
            break;
          case 'vo2max':
            summary.vo2max = o._value;
            break;
          case 'sleep_hours':
            summary.sleep_hours = o._value;
            break;
        }
      },
      error(error) {
        reject(error);
      },
      complete() {
        resolve(summary);
      }
    });
  });
}

module.exports = { fetchGarminSummary };
