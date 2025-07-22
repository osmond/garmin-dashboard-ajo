# Andy's Garmin Dashboard

This is a custom dashboard hosted at `/ajo/` for visualizing Andy's Garmin data.

## Project Structure

- `frontend/`: React + Tailwind dashboard UI
- `api/`: Node.js Express API returning mock Garmin data

## Setup

1. Copy `api/.env.example` to `api/.env` and fill in your InfluxDB details.

2. Start the backend API:
```bash
cd api

npm install
node index.js

```

3. Start the frontend (via Vite or Next.js):
```bash
cd frontend
npm install
npm run dev
```

Frontend will call `/api/summary` and render charts.
