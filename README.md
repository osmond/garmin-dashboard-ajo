# Garmin Dashboard AJO

Personal Garmin data viewer that stores your stats in InfluxDB and shows them in a simple Next.js dashboard. These instructions assume you want to run the project just for yourself.

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

1. **Clone and install**

   ```bash
   git clone https://github.com/yourname/garmin-dashboard-ajo.git
   cd garmin-dashboard-ajo
   npm install
   ```

2. **Create your `.env` file**

   ```bash
   cp .env.example .env
   ```
   Edit the file to fill in your InfluxDB details.

3. **Save your Garmin session**

   ```bash
   node scripts/save-garmin-session.js ~/garmin_session.json --email you@example.com --password yourPassword
   ```
   Update `GARMIN_COOKIE_PATH` in `.env` to point to the newly created `garmin_session.json`.

4. **Start the dashboard**

   ```bash
   npm start
   ```

Open [http://localhost:3000](http://localhost:3000) in your browser. If your phone is on the same network, visit `http://<your-computer-ip>:3000` to view it there too.

## Docker
Use Docker if you prefer a single command deployment. The compose file builds
the image and runs both the API and frontend containers. Copy `.env.example`
to `.env` and fill in all variables just like the local setup:

```bash
cp .env.example .env
# edit INFLUX_URL, INFLUX_TOKEN, INFLUX_ORG, INFLUX_BUCKET, PORT,
# GARMIN_COOKIE_PATH, GARMIN_EMAIL and GARMIN_PASSWORD
```

Build and start the stack:

```bash
docker-compose build
docker-compose --env-file .env up
```

The dashboard will be available on ports `3000` and `3002` as defined in the compose file.

## Interactive Setup

Run `npm run setup` for a guided configuration. This script asks for your
InfluxDB details and where to save the Garmin session. It writes everything to
`.env` and attempts to store the session for you.

## Mock Mode (tests only)

The repository includes a small mock dataset for Jest tests. Setting
`NEXT_PUBLIC_MOCK_MODE=true` makes the `useDashboardData` hook return this
static data instead of hitting the Garmin API. You generally will not use this
flag in day‑to‑day runs, but the tests rely on it to simulate stable results.

## Backfill History

Populate InfluxDB with older data using `scripts/backfill-garmin-history.js`:

```bash
# backfill a range of dates
node scripts/backfill-garmin-history.js 2024-01-01 2024-01-07

# or the last 30 days
node scripts/backfill-garmin-history.js --days 30

# specify a custom checkpoint file or reset progress
node scripts/backfill-garmin-history.js --checkpoint state.txt --days 30
node scripts/backfill-garmin-history.js --reset 2024-01-01 2024-01-31
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
npm test
```

## License

[MIT](LICENSE)
