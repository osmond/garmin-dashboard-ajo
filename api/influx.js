import { InfluxDB, Point } from '@influxdata/influxdb-client'
import dotenv from 'dotenv'
dotenv.config()

const url = process.env.INFLUX_URL
const token = process.env.INFLUX_TOKEN
const org = process.env.INFLUX_ORG
const bucket = process.env.INFLUX_BUCKET

const client = new InfluxDB({ url, token })
const writeApi = client.getWriteApi(org, bucket, 'ns')
writeApi.useDefaultTags({ host: 'host1' })

export function writeGarminSummary({ steps, vo2max, resting_hr, sleep_hours }) {
  const point = new Point('daily_summary')
    .intField('steps', steps)
    .intField('vo2max', vo2max)
    .intField('resting_hr', resting_hr)
    .floatField('sleep_hours', sleep_hours)

  writeApi.writePoint(point)
  return writeApi.flush()
}
