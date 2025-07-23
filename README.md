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

1. Login once using the `garmin-connect` CLI to generate a session JSON after completing MFA. Copy `.env.example` to `.env` and set `GARMIN_COOKIE_PATH` to that file. Add your InfluxDB connection details and optional `PORT` for the API (defaults to 3002).
2. Run `npm install` in the `api` folder.
3. Start the API with `npm start` in the `api` folder.
4. From `frontend/react-app`, run `npm install` then `npm run dev` to start the React app.
5. Requests to `/api` from the React dev server are proxied to `http://localhost:3002`.
6. The server schedules a daily Garmin sync at midnight and exposes `/api/weekly` for historical data.

## Running Tests

1. Install dependencies in both the `api` and `frontend/react-app` folders.
2. Execute `npm test` from the repository root to run Jest for the API and Vitest for the frontend.


### Required Environment Variables

Set the following variable before starting the API:

- `GARMIN_COOKIE_PATH` path to the saved session JSON

## License

This project is licensed under the [MIT License](LICENSE).


