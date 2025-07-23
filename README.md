# Garmin Dashboard Ajo

A small dashboard that collects your Garmin activity data. The backend is an Express API that stores daily summaries in InfluxDB and exposes history endpoints. A React app built with Vite displays the results.

## Quick start

1. **Save your Garmin session**

   ```bash
   GARMIN_EMAIL=you@example.com \
   GARMIN_PASSWORD=yourPassword \
   node scripts/save-garmin-session.js ~/garmin_session.json
   ```

   This generates `~/garmin_session.json` containing your login cookies.

2. **Create and edit `.env`**

   ```bash
   cp .env.example .env
   ```

   Set `GARMIN_COOKIE_PATH` to the session file and fill in the InfluxDB options. Change `PORT` if you need a different API port (defaults to `3002`).

3. **Run the API**

   ```bash
   cd api
   npm install
   npm start
   ```

4. **Run the React app** (in another terminal)

   ```bash
   cd frontend/react-app
   npm install
   npm run dev
   ```

Vite proxies `/api` requests to your running API server. The API fetches new data each midnight and exposes a weekly history at `/api/weekly`.

### Tests

Run all tests with:

```bash
npm test
```

### Required environment variables

- `GARMIN_EMAIL` and `GARMIN_PASSWORD` for `save-garmin-session.js`
- `GARMIN_COOKIE_PATH` location of the saved session

## License

[MIT](LICENSE)
