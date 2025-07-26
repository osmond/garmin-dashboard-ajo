#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const readline = require('readline')
const { execSync } = require('child_process')

function escapeValue(value) {
  return JSON.stringify(value).slice(1, -1)
}

function buildEnvData({
  influxUrl,
  influxToken,
  influxOrg,
  influxBucket,
  port,
  cookiePath,
}) {
  return `INFLUX_URL=${escapeValue(influxUrl)}
INFLUX_TOKEN=${escapeValue(influxToken)}
INFLUX_ORG=${escapeValue(influxOrg)}
INFLUX_BUCKET=${escapeValue(influxBucket)}
PORT=${escapeValue(port)}
GARMIN_COOKIE_PATH=${escapeValue(cookiePath)}
`
}

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
  const isTest = process.env.NODE_ENV === 'test'
  const defaults = {
    influxUrl: 'http://localhost:8086',
    influxToken: 'stub-token',
    influxOrg: 'stub-org',
    influxBucket: 'garmin',
    port: '3002',
    cookiePath: '/tmp/session.json',
  }

  const ask = async (question, def) => {
    if (isTest) return def
    const answer = await prompt(question)
    return answer || def
  }

  const influxUrl = await ask(
    'InfluxDB URL [http://localhost:8086]: ',
    defaults.influxUrl
  )
  const influxToken = await ask('InfluxDB token: ', defaults.influxToken)
  const influxOrg = await ask('InfluxDB org: ', defaults.influxOrg)
  const influxBucket = await ask(
    'InfluxDB bucket [garmin]: ',
    defaults.influxBucket
  )
  const port = await ask('API port [3002]: ', defaults.port)
  const cookiePath = await ask(
    'Path to save Garmin session JSON: ',
    defaults.cookiePath
  )

  const envData = buildEnvData({
    influxUrl,
    influxToken,
    influxOrg,
    influxBucket,
    port,
    cookiePath,
  })
  if (!isTest) {
    fs.writeFileSync(path.resolve('.env'), envData)
    console.log('Environment written to .env')
  }

  if (!isTest) {
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
  }
})()

module.exports = { buildEnvData, escapeValue }
