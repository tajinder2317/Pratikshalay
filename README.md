# Pratikshalay Backend API

Simple Node.js + Express + SQLite backend for college presentation.

## Local Setup

```bash
cd backend
npm install
npm run seed
npm run dev
```

API will start on `http://localhost:4000`.

## Endpoints

- `GET /health`
- `GET /api/doctors?q=&specialty=&sortBy=distance|rating`
- `GET /api/doctors/:id`
- `GET /api/favorites?userId=`
- `POST /api/favorites` { userId, doctorId }
- `DELETE /api/favorites/:doctorId?userId=`
- `GET /api/bookings?userId=`
- `POST /api/bookings` { userId, doctorId, date, time }

## Environment Variables

- `PORT` default `4000`
- `CORS_ORIGIN` default `*` (comma-separated for multiple origins)
- `DATA_DIR` optional sqlite folder path (use `/var/data` when Render disk is mounted)
- `DB_FILE` optional sqlite filename (default `database.sqlite`)

Copy `backend/.env.example` to `.env` for local config if needed.

## Render Deployment

1. Push the `backend` repo to GitHub.
2. In Render, create a new `Web Service` from that repo.
3. Use:
   - Build command: `npm ci`
   - Start command: `npm start`
4. Set env var `CORS_ORIGIN`:
   - Use `*` for quick testing
   - Or set your frontend URL(s), comma-separated, for stricter security.
5. Optional but recommended: attach a persistent disk and set `DATA_DIR=/var/data`.
6. Deploy and verify:
   - `https://<your-service>.onrender.com/health`

The backend auto-seeds default doctors on first start when the doctors table is empty.
