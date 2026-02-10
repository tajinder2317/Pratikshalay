# Pratikshalay Backend API

Simple Node.js + Express + SQLite backend for college presentation.

## Setup

```bash
cd backend
npm install
npm run seed
npm run dev
```

API will start on `http://localhost:4000`.

## Endpoints

- `GET /api/doctors?q=&specialty=&sortBy=distance|rating`
- `GET /api/doctors/:id`
- `GET /api/favorites?userId=`
- `POST /api/favorites` { userId, doctorId }
- `DELETE /api/favorites/:doctorId?userId=`
- `GET /api/bookings?userId=`
- `POST /api/bookings` { userId, doctorId, date, time }

## Notes
- Defaults `userId` to `guest` for quick demos.
- Data is seeded from `src/seed.js`.
