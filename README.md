# IthacaServes

A student volunteering platform for the Ithaca community, built for Cornell students to find local volunteer and shadowing opportunities.

## Quick Start

```bash
# Terminal 1 — backend
cd server && npm install && node seed.js && node index.js

# Terminal 2 — frontend
cd client && npm install && npm run dev
```

Open http://localhost:5173

## Tech Stack

- **Frontend:** React 19 + Vite + TypeScript, React Router v6
- **Backend:** Node.js + Express
- **Database:** Firebase Firestore
- **Auth:** Firebase Authentication

## Environment Setup

### Server (`server/.env`)
```
FIREBASE_PROJECT_ID=...
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
PORT=3001
```

### Client (`client/.env`)
```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/opportunities` | List all; supports `?search=` and `?category=` |
| GET | `/api/opportunities/:id` | Get a single opportunity |
| POST | `/api/opportunities` | Create (admin only) |
| PUT | `/api/opportunities/:id` | Update (admin only) |
| DELETE | `/api/opportunities/:id` | Delete (admin only) |
| POST | `/api/auth/register` | Create student account |
| GET | `/api/auth/me` | Get current user profile |
| GET | `/api/users/:uid/saved` | Get saved opportunities |
| POST | `/api/users/:uid/saved` | Save an opportunity |
| PUT | `/api/users/:uid/profile` | Update display name |
| DELETE | `/api/users/:uid/saved/:oppId` | Unsave an opportunity |

## Seed Data

Run `node seed.js` from the `server/` directory to populate 8 sample opportunities and create an admin account:

- **Admin email:** admin@ithacaserves.com
- **Admin password:** Admin1234!
