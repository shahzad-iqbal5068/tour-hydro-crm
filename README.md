# Hydro CRM

**Full-stack CRM for cruise & tourism operations** — inquiries, star and group bookings, attendance, and role-based admin. Built with Next.js App Router, TypeScript, MongoDB, and a scalable API + React Query architecture.

---

## Highlights

- **Next.js 16** (App Router), **React 19**, **TypeScript** — type-safe end-to-end
- **Scalable data layer** — all API calls in `src/lib/api`; React Query hooks in `src/hooks/api`; shared types in `src/types`
- **JWT auth** (httpOnly-style cookies), **MongoDB + Mongoose**, **Tailwind CSS**
- **TanStack Query** for server state (caching, mutations, loading/error); **React Table** for sortable, filterable tables
- **Role-based access** — permission matrix for admin, attendance, and user management

---

## Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Framework** | Next.js 16 (App Router), React 19 |
| **Language** | TypeScript |
| **Styling** | Tailwind CSS 4 |
| **Data & state** | TanStack Query (React Query), React Hook Form |
| **Database** | MongoDB, Mongoose |
| **Auth** | JWT (cookie), bcrypt |
| **UI** | Lucide React, Recharts, Framer Motion, react-hot-toast |

---

## Architecture

- **API layer** (`src/lib/api`) — all HTTP/upload and external calls (auth, attendance, upload, admin, geocoding). Components and hooks do not call `fetch` directly.
- **React Query hooks** (`src/hooks/api`) — `useQuery` / `useMutation` per domain (inquiries, bookings, attendance, admin). Shared `queryHelpers` (stale times, `normalizeQueryError`, `wrapMutationResult`).
- **Types** (`src/types`) — dedicated files per domain (user, inquiry, booking, attendance, groupDashboard, admin); imported where used.
- **Server logic** — API routes in `src/app/api/*`; UI components stay presentational and use hooks + `lib/api`.

---

## Features

- **Dashboard** — KPI cards (inquiries, bookings by category), period filter (today/weekly/monthly/yearly).
- **Inquiries** — CRUD table + form, search, filters, pagination.
- **Bookings** — 4–5 Star and 3 Star booking flows; table + form; full CRUD via API.
- **Group bookings** — Dedicated model and UI; group dashboard with leads, follow-ups, reminders.
- **Attendance** — Check-in/check-out with camera (Cloudinary), GPS → reverse geocode (Nominatim); admin list with date/role filters.
- **Admin** — User management (roles, create/update); performance dashboard (conversion, leaderboard, time series).
- **Permissions** — Role × permission matrix; API and UI guarded by `requirePermission` and hooks.

---

## Getting Started

### Prerequisites

- **Node.js 20+**
- **pnpm**
- **MongoDB** (local or Atlas)
- (Optional) **Cloudinary** for profile and attendance images

### Install & run

```bash
git clone <repo-url>
cd hydro-crm
pnpm install
cp .env.example .env.local   # set MONGODB_URI, JWT_SECRET, Cloudinary vars
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Use the credentials of your first super-admin user to log in.

### Build for production

```bash
pnpm build
pnpm start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Development server |
| `pnpm build` | Production build |
| `pnpm start` | Production server |
| `pnpm lint` | ESLint |

---

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/                # REST route handlers (auth, inquiries, bookings, attendance, admin)
│   ├── admin/              # Admin users, attendance, performance
│   ├── attendance/         # My attendance
│   ├── bookings/           # Star & group bookings, group dashboard
│   ├── inqueries/          # Inquiries
│   └── login/
├── components/             # UI (layout, attendance, bookings, group-dashboard, ui)
├── hooks/
│   └── api/                # React Query hooks + queryKeys, queryHelpers
├── lib/
│   └── api/                # API client (attendance, auth, upload, profile, admin, geocoding)
├── models/                 # Mongoose schemas
└── types/                  # TypeScript types by domain
```

---

## API Overview

| Area | Endpoints |
|------|-----------|
| **Auth** | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| **Profile** | `PUT /api/profile` |
| **Inquiries** | `GET/POST /api/inquiries`, `GET/PUT/DELETE /api/inquiries/[id]` |
| **Star bookings** | `GET/POST /api/star-bookings`, `GET/PUT/DELETE /api/star-bookings/[id]`, `PUT .../followup` |
| **Group bookings** | `GET/POST /api/group-bookings`, `GET/PUT/DELETE /api/group-bookings/[id]` |
| **Group dashboard leads** | `GET/POST /api/group-dashboard-leads` |
| **Dashboard** | `GET /api/dashboard/stats?period=...` |
| **Attendance** | `GET /api/attendance/mine`, `POST /api/attendance/start`, `POST /api/attendance/end`, `GET /api/attendance/mine/history`, `GET /api/attendance` (admin) |
| **Admin** | `GET/POST /api/admin/users`, `GET /api/admin/performance?range=...` |
| **Upload** | `POST /api/upload/image` |

---

## CI

GitHub Actions: on push/PR to `main` — `pnpm install --frozen-lockfile`, `pnpm lint`, `pnpm build` (with dummy env for DB).

---

## License

Private / per repository terms.
