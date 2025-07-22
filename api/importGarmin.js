import fs from 'fs'
import path from 'path'
import { writeGarminSummary } from './influx.js'

const filePath = process.argv[2]
if (!filePath) {
  console.error('Usage: node importGarmin.js <path-to-json>')
  process.exit(1)
}

const rawData = fs.readFileSync(filePath)
const data = JSON.parse(rawData)

writeGarminSummary({
  steps: data.steps,
  vo2max: data.vo2max,
  resting_hr: data.resting_hr,
  sleep_hours: data.sleep_hours
}).then(() => {
  console.log('Data written to InfluxDB.')
})
