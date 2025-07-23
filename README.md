# Garmin Dashboard Ajo

This project contains a simple Express API for fetching Garmin data and a frontend built with React and Vite. The API stores daily metrics in InfluxDB, exposes a weekly history endpoint and runs a scheduled fetch each night.

## Commit Message Guidelines

Write commit messages in the present-tense imperative, describing what the commit does. Keep the summary short and descriptive. For example:

- "Add port configuration"
- "Fix login redirect logic"

### Commit Message Enforcement

Husky is used to enforce this guideline. After installing dependencies, run
`npm run prepare` to install the Git hooks. Commits with messages longer than
60 characters or using past tense will be rejected by the `commit-msg` hook.

## Setup

1. Create a Garmin Connect session file:

   ```bash
   GARMIN_EMAIL=you@example.com \
   GARMIN_PASSWORD=yourPassword \
   node scripts/save-garmin-session.js ~/garmin_session.json
   ```

   The script logs in and saves your cookies at `~/garmin_session.json`.

2. Copy the environment template and edit it:

   ```bash
   cp .env.example .env
   ```

   Open `.env` and set `GARMIN_COOKIE_PATH` to the session file path. Fill in the InfluxDB variables and adjust `PORT` if needed (defaults to `3002`).

3. Install API dependencies and start the server:

   ```bash
   cd api
   npm install
   npm start
   ```

4. In another terminal start the React app:

   ```bash
   cd frontend/react-app
   npm install
   npm run dev
   ```

5. Vite proxies `/api` requests to `http://localhost:3002` and the server schedules a Garmin sync each midnight. Historical data is available at `/api/weekly`.
6. The daily cron job uses the server's local timezone. Set `TZ` before starting the app or adjust the cron expression in `api/index.js` to change it.

## Running Tests

1. Install dependencies in both the `api` and `frontend/react-app` folders.
2. Execute `npm test` from the repository root to run Jest for the API and Vitest for the frontend.


### Required Environment Variables

Set the following variable before starting the API:
- `GARMIN_EMAIL` and `GARMIN_PASSWORD` credentials used by `save-garmin-session.js`

- `GARMIN_COOKIE_PATH` path to the saved session JSON

## License

This project is licensed under the [MIT License](LICENSE).


\nTest change
