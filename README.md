# Garmin Dashboard AJO

A small dashboard that collects your Garmin activity data. The backend is an Express API that stores daily summaries in InfluxDB and exposes history endpoints. The frontend lives in `frontend-next` and is a Next.js app styled with Tailwind CSS and shadcn-ui.

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

3. **Install dependencies and start the Next.js app**

   ```bash
   npm install
   npm install --prefix api
   npm install --prefix frontend-next
   npm start    # starts both the API and Next.js dev server
   ```

   The Next.js app lives in `frontend-next` and already includes Tailwind CSS and shadcn-ui.

Next.js serves pages from `frontend-next`. The API fetches new data each midnight and exposes a weekly history at `/api/weekly`.
An additional endpoint `/api/activity/:id` returns GPX coordinates for a specific activity.

### Running Tests

Install dependencies in the root and API workspace before running tests:

```bash
npm install                # root dev tools
npm install --prefix api   # API dependencies
```

The frontend has no tests yet, so the root `npm test` script only runs the API tests.

Run API tests with:

```bash
npm test   # runs "npm test --prefix api"
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
