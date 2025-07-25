# Garmin Dashboard AJO

A small dashboard that collects your Garmin activity data. The backend is an Express API that stores daily summaries in InfluxDB and exposes history endpoints. The `frontend-next` directory contains a Next.js app with Tailwind CSS and shadcn-ui preconfigured.

## Quick start

1. **Save your Garmin session**

   The script `save-garmin-session.js` writes your login cookies to the file
   specified by `GARMIN_COOKIE_PATH`. It requires `GARMIN_EMAIL`,
   `GARMIN_PASSWORD`, and `GARMIN_COOKIE_PATH` in the environment.

   Export the variables first and then run the script:

   ```bash
   export GARMIN_EMAIL=you@example.com
   export GARMIN_PASSWORD=yourPassword
   export GARMIN_COOKIE_PATH=$HOME/garmin_session.json
   node scripts/save-garmin-session.js "$GARMIN_COOKIE_PATH"
   ```

   Or prefix the variables on a single line:

   ```bash
   GARMIN_EMAIL=you@example.com \
   GARMIN_PASSWORD=yourPassword \
   GARMIN_COOKIE_PATH=$HOME/garmin_session.json \
   node scripts/save-garmin-session.js $GARMIN_COOKIE_PATH
   ```


   This generates `~/garmin_session.json` containing your login cookies. If
   `GARMIN_COOKIE_PATH` is set, you can omit the path argument.


2. **Create and edit `.env`** (keep it in the repository root so the API can load `../.env`)

   ```bash
   cp .env.example .env
   ```

   Set `GARMIN_COOKIE_PATH` to the session file and fill in the InfluxDB
   options. The value **must** be an absolute path, for example
   `GARMIN_COOKIE_PATH=$HOME/garmin_session.json`. Login will fail if the
   path is not absolute. Change `PORT` if you need a different API
   port (defaults to `3002`).

3. **Install dependencies and start the frontend-next app**

   ```bash
   npm install
   npm install --prefix api
   npm install --legacy-peer-deps --prefix frontend-next
   npm start    # starts both the API and Next.js dev server
   ```

   The repository uses **npm** for the Next.js frontend. Any yarn lockfile
   has been removed to avoid CI warnings.

   Storybook only supports React up to v18, so installing the `frontend-next`
   package with React 19 requires the `--legacy-peer-deps` (or `--force`)
   option.

4. **Initialize shadcn-ui in frontend-next**

   Run `npx shadcn@latest init` inside the `frontend-next` directory to
   generate the `ui/` folder.

5. **(Optional) Enable mock data mode**

   Set `NEXT_PUBLIC_MOCK_MODE=true` in your `.env` file to load the sample
   metrics from `frontend-next/public/mockData.json`. Any other value or leaving
   the variable unset tells the app to fetch real Garmin data. This lets you
   explore the dashboard without configuring the backend when using the mock
   dataset.

  The `frontend-next` directory contains a Next.js app.
An additional endpoint `/api/activity/:id` returns GPX coordinates for a specific activity.

### Running Tests

Before running tests or preparing Git hooks, install dependencies in each
workspace. The frontend-next dependencies must be installed or `npm test` will fail:

```bash
npm install                # root dev tools
npm install --prefix api   # API dependencies
npm install --legacy-peer-deps --prefix frontend-next   # React app dependencies
```

The same `--legacy-peer-deps` flag is required here to avoid Storybook's
React peer dependency warnings.

Run all API and React tests with:

```bash
npm test   # runs "npm test --prefix api" and "npm test --prefix frontend-next"
```

### Required environment variables

- `GARMIN_EMAIL` and `GARMIN_PASSWORD` for `save-garmin-session.js`
- `GARMIN_COOKIE_PATH` location of the saved session
- `NEXT_PUBLIC_MOCK_MODE` set to `true` reads `frontend-next/public/mockData.json`.
  Any other value or leaving the variable unset fetches Garmin data instead.

### Backfill historical data

Use `scripts/backfill-garmin-history.js` to populate InfluxDB with data from
past dates. Provide a start and end date or a number of days to backfill.
The script also expects `GARMIN_EMAIL`, `GARMIN_PASSWORD`, and
`GARMIN_COOKIE_PATH` in the environment (or a populated `.env`).

```bash
# backfill between two dates (inclusive)
node scripts/backfill-garmin-history.js 2024-01-01 2024-01-07

# or backfill the last 30 days
node scripts/backfill-garmin-history.js --days 30
```

For large backfills (e.g. 10 years of history) set `--days` to a big number:

```bash
node scripts/backfill-garmin-history.js --days 3650
```

### Viewing long-term history

The dashboard's History tab queries `/api/history?days=N` using the number
entered in the input field. Increase the days value to load more past data
after running the backfill script.

## License

[MIT](LICENSE)
