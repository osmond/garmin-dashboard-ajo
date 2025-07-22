# Andy's Garmin Dashboard

This is a custom dashboard hosted at `/ajo/` for visualizing Andy's Garmin data. The API queries an InfluxDB instance that stores the metrics.

## Project Structure

- `frontend/`: React + Tailwind dashboard UI
- `api/`: Node.js Express API that queries InfluxDB

## Configuration

Create an `.env` file inside the `api/` folder with the following variables:

```dotenv
INFLUX_URL=<your InfluxDB URL>
INFLUX_ORG=<your organization>
INFLUX_BUCKET=<your bucket>
INFLUX_TOKEN=<your access token>
PORT=3001
```

These values are required for the API to connect to InfluxDB and define the port the server listens on.

## Setup

1. Start the backend API:
```bash
cd api
node index.js
```

2. Start the frontend (via Vite or Next.js):
```bash
cd frontend
npm install
npm run dev
```

Frontend will call `/api/summary` and render charts.
