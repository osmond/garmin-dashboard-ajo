# Garmin Dashboard Ajo

This project contains a simple Express API for fetching Garmin data and a frontend built with React and Vite.

## Commit Message Guidelines

Write commit messages in the present-tense imperative, describing what the commit does. Keep the summary short and descriptive. For example:

- "Add port configuration"
- "Fix login redirect logic"

### Commit Message Enforcement

Husky is used to enforce this guideline. After installing dependencies, run
`npm run prepare` to install the Git hooks. Commits with messages longer than
60 characters or using past tense will be rejected by the `commit-msg` hook.

## Setup

1. Copy `.env.example` to `.env` and fill in `GARMIN_EMAIL` and `GARMIN_PASSWORD` with your Garmin credentials. Add your InfluxDB connection details and optional `PORT` for the API (defaults to 3002).
2. Run `npm install` in the `api` folder.
3. Start the API with `npm start` in the `api` folder.
4. From `frontend/react-app`, run `npm install` then `npm run dev` to start the React app.
5. Requests to `/api` from the React dev server are proxied to `http://localhost:3002`.

## Running Tests

1. Install dependencies in both the `api` and `frontend/react-app` folders.
2. Execute `npm test` from the repository root to run Jest for the API and Vitest for the frontend.


### Required Environment Variables

Set the following variables with your Garmin credentials before starting the API:

- `GARMIN_EMAIL`
- `GARMIN_PASSWORD`

## License

This project is licensed under the [MIT License](LICENSE).


