#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execSync } = require('child_process')

async function prompt(question) {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  })
  const answer = await new Promise((res) => rl.question(question, res))
  rl.close()
  return answer
}

;(async () => {
  const influxUrl =
    (await prompt('InfluxDB URL [http://localhost:8086]: ')) ||
    'http://localhost:8086'
  const influxToken = await prompt('InfluxDB token: ')
  const influxOrg = await prompt('InfluxDB org: ')
  const influxBucket = (await prompt('InfluxDB bucket [garmin]: ')) || 'garmin'
  const port = (await prompt('API port [3002]: ')) || '3002'
  const cookiePath = await prompt('Path to save Garmin session JSON: ')

  const envData = `INFLUX_URL=${influxUrl}
INFLUX_TOKEN=${influxToken}
INFLUX_ORG=${influxOrg}
INFLUX_BUCKET=${influxBucket}
PORT=${port}
GARMIN_COOKIE_PATH=${cookiePath}
NEXT_PUBLIC_MOCK_MODE=false
`
  fs.writeFileSync(path.resolve('.env'), envData)
  console.log('Environment written to .env')

  try {
    execSync(`node scripts/save-garmin-session.js "${cookiePath}"`, {
      stdio: 'inherit',
    })
    console.log('Garmin session saved')
  } catch (err) {
    console.error(
      'Failed to save session. Run scripts/save-garmin-session.js manually.',
      err
    )
  }
})()
