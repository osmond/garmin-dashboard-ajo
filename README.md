# Garmin Dashboard ajo.n

A small dashboard that collects your Garmin activity data. The backend is an Express API that stores daily summaries in InfluxDB and exposes history endpoints. A single-page React app built with Vite displays the results. Tailwind CSS and shadcn-ui are preconfigured.

## Quick start

1. **Save your Garmin session**

   ```bash
   GARMIN_EMAIL=you@example.com \
   GARMIN_PASSWORD=yourPassword \
   node scripts/save-garmin-session.js ~/garmin_session.json
   ```

   This generates `~/garmin_session.json` containing your login cookies.

2. **Create and edit `.env`** (keep it in the repository root so the API can load `../.env`)

   ```bash
   cp .env.example .env
   ```

   Set `GARMIN_COOKIE_PATH` to the session file and fill in the InfluxDB
   options. The path must be absolute (for example
   `GARMIN_COOKIE_PATH=$HOME/garmin_session.json`) or it will be resolved
   relative to `api/` when running `npm start`. Change `PORT` if you need a
   different API port (defaults to `3002`).

3. **Install dependencies and start the single-page app**

   ```bash
   npm install
   npm install --prefix api
   npm install --prefix frontend
   npm start    # starts both the API and React dev server
   ```

   The React app lives in `frontend` and already includes Tailwind CSS and shadcn-ui.

The single-page React app uses Vite to proxy `/api` requests to your running API server. The API fetches new data each midnight and exposes a weekly history at `/api/weekly`.
An additional endpoint `/api/activity/:id` returns GPX coordinates for a specific activity.

### Running Tests

Before running tests or preparing Git hooks, install dependencies in each
workspace. The frontend dependencies must be installed or `npm test` will fail:

```bash
npm install                # root dev tools
npm install --prefix api   # API dependencies
npm install --prefix frontend   # React app dependencies
```

Run all API and React tests with:

```bash
npm test   # runs "npm test --prefix api" and "npm test --prefix frontend"
```

### Required environment variables

- `GARMIN_EMAIL` and `GARMIN_PASSWORD` for `save-garmin-session.js`
- `GARMIN_COOKIE_PATH` location of the saved session

### Backfill historical data

Use `scripts/backfill-garmin-history.js` to populate InfluxDB with data from
past dates. Provide a start and end date or a number of days to backfill.

```bash
# backfill between two dates (inclusive)
node scripts/backfill-garmin-history.js 2024-01-01 2024-01-07

# or backfill the last 30 days
node scripts/backfill-garmin-history.js --days 30
```

## License

[MIT](LICENSE)
