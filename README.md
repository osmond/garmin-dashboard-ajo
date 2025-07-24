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

3. **Install dependencies and start the app**

   ```bash
   npm install
   npm install --prefix api
   npm install --prefix frontend-next
   # runs both servers concurrently
   npm start
   ```

   This starts the Express API on port `3002` and the Next.js dev server on
   port `3000`. The Next.js app lives in `frontend-next` and already includes
   Tailwind CSS and shadcn-ui.

Next.js serves pages from `frontend-next`. The API fetches new data each midnight and exposes a weekly history at `/api/weekly`.
An additional endpoint `/api/activity/:id` returns GPX coordinates for a specific activity.

### Mock mode

The dashboard defaults to loading sample data from `frontend-next/src/data/mockData.json` via the
`useMockData` hook. When the environment variable `NEXT_PUBLIC_MOCK_MODE` is set to `false`
in `.env`, `useMockData` is bypassed and the frontend fetches live data from the API endpoints
(`/api/summary`, `/api/weekly`, etc.). Restart the app after changing this variable.

### Running Tests

Install dependencies in the root and workspaces before running tests:

```bash
npm install                # root dev tools
npm install --prefix api            # API dependencies
npm install --prefix frontend-next  # frontend dependencies
```

Run all tests from the repository root:

```bash
npm test   # runs API and frontend tests
```

Run just the API or frontend tests with:

```bash
npm test --prefix api
npm test --prefix frontend-next
```

### Storybook

Run Storybook to preview isolated UI components:

```bash
npm run storybook --prefix frontend-next
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
