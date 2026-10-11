# Foodie Market

A complete, runnable shopping + food-ordering demo site built with Node.js and
Express. It's structured to walk through the full Cognifyz task progression,
from basic forms all the way to auth, a REST API, and external API integration
— as one cohesive project rather than 8 disconnected exercises.

## Quick start

```bash
npm install
cp .env.example .env
npm start
```

Then open **http://localhost:3000**.

The first account you register automatically becomes an **admin** (role is
assigned in `routes/auth.js`), so you can immediately visit `/admin` to manage
products and see incoming orders.

## What's inside

| Area | Files |
|---|---|
| Server + routing | `server.js`, `routes/pages.js`, `routes/auth.js`, `routes/api.js` |
| Server-side rendering | `views/*.ejs` (EJS templates, partials for header/footer) |
| Client + server validation | `public/js` inline scripts per form + `middleware/validate.js` (express-validator) |
| "Database" | `config/db.js` (JSON-file store) + `data/*.json` — swap for MongoDB/MySQL without touching routes |
| Auth | `middleware/auth.js`, `routes/auth.js` — session login for pages, JWT bearer tokens for API clients |
| REST API | `routes/api.js` — full CRUD on `/api/products`, cart & orders endpoints |
| External API | `services/externalApi.js` — pulls sample products from a public API with graceful fallback |
| Caching | `services/cache.js` (node-cache), used to cache the external API call |
| Background jobs | `services/jobQueue.js` — simulates a Redis-style queue; orders are processed asynchronously after checkout |
| Middleware | `middleware/logger.js` (request logging to `data/requests.log`), rate limiting on `/api/*` in `server.js` |

## How this maps to the task list

- **Task 1 — HTML structure & basic server**: EJS views + Express routes in
  `routes/pages.js`, form submissions handled server-side (`/cart/add`,
  `/checkout`, etc.).
- **Task 2 — Inline styles, interaction, server-side validation**: inline
  `<script>` blocks in `views/register.ejs`, `views/login.ejs`,
  `views/product-detail.ejs`, `views/checkout.ejs` for client-side checks;
  `middleware/validate.js` + `express-validator` for the server-side rules
  that actually decide whether data is accepted. Validated form data is
  stored via `config/db.js`.
- **Task 3 — Advanced CSS & responsive design**: `public/css/style.css`
  (transitions, hover animation, keyframes) + Bootstrap 5 grid/components
  for a responsive layout across the whole site.
- **Task 4 — Complex validation & dynamic DOM**: password-strength meter in
  `views/register.ejs`, dynamic cart badge, and the admin dashboard's
  add/delete-product flow in `views/admin/dashboard.ejs` updates the DOM via
  `fetch()` without a full page reload.
- **Task 5 — API integration & front-end interaction**: `routes/api.js`
  exposes RESTful CRUD endpoints that the admin dashboard's front-end code
  calls directly.
- **Task 6 — Database integration & auth**: `config/db.js` as the data layer,
  `bcryptjs` password hashing, session-based login, and `apiAdmin`/
  `requireAdmin` guards protecting write endpoints and the `/admin` page.
- **Task 7 — Advanced API usage & external APIs**: `routes/auth.js`
  `/auth/token` issues JWTs (OAuth-style bearer auth) for API clients;
  `services/externalApi.js` calls a third-party API with error handling and
  a fallback; `express-rate-limit` is applied to all `/api` routes in
  `server.js`.
- **Task 8 — Advanced server-side functionality**: `middleware/logger.js`
  (request logging middleware), `services/jobQueue.js` (background job
  processing standing in for Redis/a task queue), `services/cache.js`
  (server-side caching with node-cache).

## Notes

- Data is stored as JSON files under `data/` so the project runs with zero
  external services. To use a real database, replace the two functions in
  `config/db.js` — nothing else needs to change.
- The external API call (`services/externalApi.js`) hits a public demo API;
  if it's unreachable it falls back to static sample data so the app still
  works offline.
