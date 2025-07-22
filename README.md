# Garmin Dashboard

This repository contains a small demo API and frontend for Garmin data.

## Configuration

An example environment file is provided at `api/.env.example`.
Copy it to `.env` inside the `api` folder and fill in your real credentials:

```bash
cp api/.env.example api/.env
```

Edit `api/.env` and replace the placeholder values for `GARMIN_EMAIL` and `GARMIN_PASSWORD`. You can adjust `PORT` if needed.

## Running the API

Install dependencies and start the server:

```bash
cd api
npm install
node index.js
```
