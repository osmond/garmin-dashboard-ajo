# Garmin Dashboard Ajo

This project contains a simple Express API for fetching Garmin data and a frontend built with React and Vite.

## Commit Message Guidelines

Write commit messages in the present-tense imperative, describing what the commit does. Keep the summary short and descriptive. For example:

- "Add port configuration"
- "Fix login redirect logic"

## Setup

1. Copy `.env.example` to `.env` and fill in `GARMIN_EMAIL` and `GARMIN_PASSWORD` with your Garmin credentials. Add your InfluxDB connection details and optional `PORT` for the API (defaults to 3002).
2. Run `npm install` in the `api` folder.
3. Start the API with `npm start` in the `api` folder.
4. From `frontend/react-app`, run `npm install` then `npm run dev` to start the React app.
5. Requests to `/api` from the React dev server are proxied to `http://localhost:3002`.
