# Habit Tracker — Frontend

React (Vite) frontend for the Personal Habit & Daily Activity Tracker.

## Run locally

```bash
npm install
npm run dev
```

Runs on http://localhost:5173. API calls to `/api/*` are proxied to
`http://localhost:5000` in dev (see `vite.config.js`) — change
`VITE_BACKEND_URL` if your Express server runs on a different port.

## Build for production

```bash
npm run build
```

Outputs static files to `dist/`, which Nginx (or any static host) can serve.
Set `VITE_API_URL` at build time if the backend lives on a different domain
than the frontend (see `.env.example`).

## Expected backend API

The frontend assumes these Express routes exist (JSON in/out, JWT auth via
`Authorization: Bearer <token>`):

| Method | Path                | Body                                  | Notes                        |
|--------|---------------------|----------------------------------------|-------------------------------|
| POST   | /api/auth/register  | `{ name, email, password }`            | returns `{ user, token }`     |
| POST   | /api/auth/login     | `{ email, password }`                  | returns `{ user, token }`     |
| GET    | /api/habits         | —                                       | returns `[{ id, name }]`      |
| POST   | /api/habits         | `{ name }`                             | returns created habit         |
| DELETE | /api/habits/:id     | —                                       | —                              |
| GET    | /api/logs           | —                                       | returns `[{ habit_id, log_date, completed }]` for current user |
| POST   | /api/logs/toggle    | `{ habit_id, log_date, completed }`    | upserts a log entry           |

`log_date` is an ISO date string (`YYYY-MM-DD`).

## Docker

A minimal multi-stage Dockerfile for this frontend:

```dockerfile
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```
