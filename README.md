# Hydro CRM

A CRM for tourist cruise operations: manage inquiries, 4–5 star and 3 star bookings, attendance, and users—with JWT auth, MongoDB, and a responsive dashboard.

---

## Tech stack

- **Framework:** Next.js 16 (App Router)
- **UI:** React 19, Tailwind CSS 4
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT in cookies, bcrypt for passwords
- **Forms:** react-hook-form, react-hot-toast
- **Icons:** Lucide React

---

## Features

### Dashboard (Home)

- **Stats cards:** Inquiries and Bookings counts from the database.
- **Period filter:** Today, Weekly, Monthly, Yearly (dropdown).
- **Bookings breakdown:** In one card: 4–5 Star, 3 Star, and Total.
- **Layout:** 4 cards in one row on large screens; 2 on tablet; 1 on mobile.

### Inquiries

- **List:** Table with date, shift, WhatsApp name, remarks; filter by WhatsApp name; sort by date; search; pagination; print.
- **Form:** Same page (side-by-side on desktop): add/edit with date, shift, WhatsApp name, remarks; validation and toasts.
- **Actions:** Edit (pencil) and Delete (trash) with confirmation modal; API: GET, POST, PUT, DELETE.

### Bookings (4–5 Star & 3 Star)

- **Two sections:** “4–5 Stars Booking” and “3 Stars Booking” in the sidebar.
- **Table:** Time, Pax, Guest name, Number, Collection, Paid, Balance, Deck, Remarks, Calling remarks; Edit and Delete per row.
- **Form:** Side panel to add/edit; create/update/delete via `/api/star-bookings` (full CRUD).
- **Storage:** MongoDB `StarBooking` model; category `"4-5"` or `"3"`.

### Attendance

- **My Attendance:** Check in (camera + optional GPS, photo to Cloudinary), check out; today’s status and live elapsed time; recent history table.
- **Admin Attendance:** Table of all staff attendance; filters: date, month, year, role; columns: date, name, role, check-in/out, duration, location, photo link.

### Admin – Users

- **User management:** Table of users; add/edit roles (SUPER_ADMIN, ADMIN, MANAGER, CEO, SALES_EXEC, CALL_PERSON).
- **Layout:** Table and form side-by-side (same as inquiries).

### Permissions (roles)

- **Roles:** SUPER_ADMIN, ADMIN, MANAGER, CEO, SALES_EXEC, CALL_PERSON.
- **Enforcement:** API routes use `requirePermission(Permission.…)` (e.g. `MANAGE_USERS` for admin users, `VIEW_ALL_ATTENDANCE` for attendance list). UI hides the Admin sidebar section for roles that lack `MANAGE_USERS` or `VIEW_ALL_ATTENDANCE`.
- **Docs:** See [PERMISSIONS.md](./PERMISSIONS.md) for the full role × permission matrix and how to use permissions in API and UI (creating documents, protecting routes, showing/hiding by role).
- **Config:** Single source of truth: `src/lib/permissions-config.ts` (client-safe); server helpers in `src/lib/permissions.ts`.

### UI / UX

- **Theme:** Light/dark toggle in navbar (class-based, no flash).
- **Sidebar:** Icon bar + expandable sub-sidebar with section links; mobile overlay with burger menu.
- **Responsive:** Layout and cards adapt for mobile, tablet, and desktop.

---

## Project setup

### Prerequisites

- Node.js 20+
- pnpm
- MongoDB (local or Atlas)
- (Optional) Cloudinary for profile and attendance photos

### 1. Clone and install

```bash
git clone <repository-url>
cd hydro-crm
pnpm install
```

### 2. Environment variables

Copy the example env and set values:

```bash
cp .env.example .env.local
```

Edit `.env.local`:

| Variable | Description |
|----------|-------------|
| `MONGODB_URI` | MongoDB connection string (Atlas or e.g. `mongodb://127.0.0.1:27017/tourhydro`) |
| `JWT_SECRET` | Secret for signing JWTs (use a long random string in production) |
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name (profile/attendance images) |
| `NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET` | Cloudinary unsigned upload preset |

See `.env.example` for commented examples.

### 3. Run locally

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Log in (first user with the configured super-admin email becomes SUPER_ADMIN).

### 4. Build and start (production)

```bash
pnpm build
pnpm start
```

---

## Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start dev server |
| `pnpm build` | Production build |
| `pnpm start` | Start production server |
| `pnpm lint` | Run ESLint |

---

## API overview

| Area | Endpoints |
|------|-----------|
| **Auth** | `POST /api/auth/login`, `POST /api/auth/logout`, `GET /api/auth/me` |
| **Profile** | `GET /api/profile`, `PUT /api/profile` (avatar URL, re-issue JWT) |
| **Inquiries** | `GET /api/inquiries`, `POST /api/inquiries`, `GET /api/inquiries/[id]`, `PUT /api/inquiries/[id]`, `DELETE /api/inquiries/[id]` |
| **Star bookings** | `GET /api/star-bookings?category=4-5|3`, `POST /api/star-bookings`, `GET/PUT/DELETE /api/star-bookings/[id]` |
| **Dashboard** | `GET /api/dashboard/stats?period=today|weekly|monthly|yearly` (inquiries + bookings4to5, bookings3, bookingsTotal) |
| **Attendance** | `GET /api/attendance/mine`, `POST /api/attendance/start`, `POST /api/attendance/end`, `GET /api/attendance/mine/history`, `GET /api/attendance` (admin, with filters) |
| **Admin users** | `GET /api/admin/users`, `POST /api/admin/users` (create/update) |

---

## Project structure (main parts)

```
hydro-crm/
├── .env.example          # Env template
├── .github/workflows/    # CI (lint + build)
├── src/
│   ├── app/
│   │   ├── api/          # Route handlers (auth, inquiries, star-bookings, attendance, dashboard, admin)
│   │   ├── admin/        # Admin users, admin attendance
│   │   ├── attendance/   # My attendance
│   │   ├── bookings/     # 4-5 stars, 3 stars
│   │   ├── inqueries/    # Inquiries table + form
│   │   ├── login/
│   │   ├── AppShell.tsx  # Layout, sidebar, navbar, auth guard
│   │   ├── HomeStats.tsx # Dashboard stats cards + period
│   │   ├── layout.tsx
│   │   └── page.tsx      # Home/dashboard
│   ├── components/
│   │   ├── layout/       # Sidebar, Navbar, Profile modals
│   │   ├── attendance/   # AttendanceClient, AdminAttendanceClient
│   │   └── bookings/     # BookingClient
│   ├── lib/              # mongodb, auth (JWT)
│   ├── models/           # User, Inquiry, StarBooking, Attendance
│   └── types/            # Shared TypeScript types
└── package.json
```

---

## CI (GitHub Actions)

Workflow **Next.js CI (pnpm)** runs on:

- **Push:** `main`, `feature/**`
- **Pull request:** target branch `main`

Steps: checkout → Node 20 + pnpm cache → `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm build`.  
Build uses dummy `MONGODB_URI` and `JWT_SECRET` so it does not need a real database.

---

## License

Private / as per your repository terms.
