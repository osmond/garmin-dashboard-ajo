# Garmin Dashboard AJO

A self-hosted dashboard that syncs your Garmin stats to InfluxDB and visualizes them in a Next.js app.

![Dashboard demo](docs/demo.gif)

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Interactive Setup](#interactive-setup)
- [Mock Mode](#mock-mode)
- [Backfill History](#backfill-history)
- [API Reference](#api-reference)
- [Testing](#testing)
- [License](#license)

## Features

- **Express API** with endpoints for daily summaries, weekly stats and individual activities
- **Next.js frontend** using Tailwind CSS and shadcn-ui
- **InfluxDB storage** for long-term metric history

## Quick Start

```bash
# clone the repo
git clone https://github.com/yourname/garmin-dashboard-ajo.git
cd garmin-dashboard-ajo

# install dependencies
npm install
npm install --prefix api
npm install --prefix frontend-next

# copy environment file and add your Garmin credentials
cp .env.example .env
# edit GARMIN_EMAIL and GARMIN_PASSWORD in .env
node scripts/save-garmin-session.js $HOME/garmin_session.json --email you@example.com --password yourPassword

# edit .env to point to the session file and your InfluxDB settings

# start API and Next.js app
npm start
```

## Interactive Setup

Run `node scripts/setup.js` for a guided configuration. This script prompts for
your InfluxDB details, port, and the location to store your Garmin cookie. It
writes these values to `.env` and then tries to call `scripts/save-garmin-session.js`
to save the Garmin session file automatically.

## Mock Mode

Set `NEXT_PUBLIC_MOCK_MODE=true` in `.env` to load metrics from `frontend-next/public/mockData.json` without contacting Garmin.

## Backfill History

Populate InfluxDB with older data using `scripts/backfill-garmin-history.js`:

```bash
# backfill a range of dates
node scripts/backfill-garmin-history.js 2024-01-01 2024-01-07

# or the last 30 days
node scripts/backfill-garmin-history.js --days 30
```

## API Reference

| Endpoint | Description |
| -------- | ----------- |
| `GET /api/health` | simple health check |
| `GET /api/summary` | fetch today"s summary |
| `GET /api/weekly` | last 7 days of data |
| `GET /api/history?days=n` | historic summaries |
| `GET /api/activities` | recent activities |
| `GET /api/activity/:id` | GPX points for an activity |

## Testing

Install dependencies and run all Jest tests:

```bash
npm install
npm install --prefix api
npm install --prefix frontend-next
npm test
```

## License

[MIT](LICENSE)
