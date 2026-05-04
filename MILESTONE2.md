# Milestone 2 Submission — IthacaServes

**Project:** Student Volunteering Platform for the Ithaca Community  
**Due:** April 10, 2026

---

## Overview

IthacaServes is a web platform that aggregates volunteering and shadowing opportunities in the local Ithaca community for Cornell students. It addresses the gap between broad platforms like CampusGroups and application-heavy platforms like Handshake by focusing specifically on accessible, service-oriented opportunities.

---

## Frontend Pages (5 total)

| Page | Route | Description |
|------|-------|-------------|
| Home | `/` | Hero section, category filter chips, featured opportunities pulled from the API |
| Opportunities | `/opportunities` | Full listing with search bar and sidebar category filters |
| Opportunity Detail | `/opportunities/:id` | Full view of a single opportunity; save button for logged-in users |
| Login / Register | `/login` | Tab-toggled sign-in and account creation forms |
| Student Dashboard | `/dashboard` | Shows the logged-in student's saved opportunities |

---

## Express API Routes

Base URL: `http://localhost:3001/api`

### Opportunities

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/opportunities` | List all opportunities; supports `?search=` and `?category=` query params |
| GET | `/opportunities/:id` | Get a single opportunity by ID |
| POST | `/opportunities` | Create a new opportunity (admin) — body: `{ title, organization, description, category, location, date, spots }` |
| PUT | `/opportunities/:id` | Update an existing opportunity (admin) — body: any subset of fields |
| DELETE | `/opportunities/:id` | Delete an opportunity by ID (admin) |

### Auth & User Actions

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/auth/register` | Create a new student account — body: `{ name, email, password }` |
| POST | `/auth/login` | Authenticate — body: `{ email, password }` |
| GET | `/auth/saved` | Get a user's saved opportunities — query: `?userId=` |
| POST | `/auth/saved` | Save an opportunity — body: `{ userId, opportunityId }` |
| DELETE | `/auth/saved/:opportunityId` | Remove a saved opportunity — query: `?userId=` |

**All four HTTP methods are implemented:** GET, POST, PUT, DELETE.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19 + Vite |
| Routing | React Router v6 |
| Backend | Node.js + Express |
| Data store | JSON file (`server/data.json`) — will migrate to a proper database in Week 3 |
| Styling | Plain CSS with CSS custom properties |

---

## Frontend ↔ Backend Connection

The frontend (`localhost:5173`) communicates with the Express server (`localhost:3001`) via the Fetch API. Vite's dev server proxy forwards `/api/*` requests to the backend, and CORS is enabled on the server for development.

---

## How to Run Locally

### Prerequisites
- Node.js (v18+)
- npm

### Setup

```bash
# 1. Install dependencies
cd server && npm install && cd ..
cd client && npm install && cd ..

# 2. Start the backend (Terminal 1)
cd server && node index.js
# → Server runs on http://localhost:3001
# → Seeds sample data automatically on first run

# 3. Start the frontend (Terminal 2)
cd client && npm run dev
# → App runs on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

### Or use concurrently from the root:

```bash
npm install          # install concurrently
npm run dev          # starts both server and client
```

---

## Project Structure

```
volunteer-platform/
├── server/
│   ├── index.js          # Express app entry point
│   ├── db.js             # JSON-based data store
│   ├── seed.js           # Sample data (auto-runs on startup)
│   └── routes/
│       ├── opportunities.js  # GET, POST, PUT, DELETE /api/opportunities
│       └── auth.js           # POST /register, POST /login, GET/POST/DELETE /saved
├── client/
│   ├── src/
│   │   ├── App.jsx           # Routes
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Opportunities.jsx
│   │   │   ├── OpportunityDetail.jsx
│   │   │   ├── Login.jsx
│   │   │   └── Dashboard.jsx
│   │   └── components/
│   │       ├── Navbar.jsx
│   │       └── OpportunityCard.jsx
│   └── vite.config.js
└── MILESTONE2.md
```
