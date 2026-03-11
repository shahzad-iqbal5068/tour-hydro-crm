# Hydro CRM

A small Next.js 16 + Tailwind CSS demo app for managing tour bookings with a form and a bookings table.  
Data is stored in MongoDB via Mongoose and can use either **MongoDB Atlas (cloud)** or a **local MongoDB** instance.

---

## 1. Tech stack

- Next.js 16 (App Router, TypeScript)
- React, React Hook Form
- Tailwind CSS
- MongoDB + Mongoose
- react-hot-toast

---

## 2. Getting started

### 2.1. Install dependencies

```bash
pnpm install
```

### 2.2. Configure environment variables

Environment variables live in `.env.local` (not committed to Git).  
An example file is provided as `.env.example`.

Copy it:

```bash
cp .env.example .env.local
```

Then open `.env.local` and choose **one** connection string:

#### Option A – Use MongoDB Atlas (recommended for Vercel)

1. In MongoDB Atlas, create a cluster and a database named `tourhydro` (or any name you prefer).
2. Create a database user and get the connection string from Atlas.
3. Put it in `.env.local`:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/tourhydro?retryWrites=true&w=majority
```

This is what you should also configure as the `MONGODB_URI` environment variable in **Vercel project settings → Environment Variables**.

#### Option B – Use local MongoDB for development

Make sure you have MongoDB running locally (for example, `mongod` running on port `27017`).

In `.env.local`:

```bash
MONGODB_URI=mongodb://127.0.0.1:27017/tourhydro
```

> **Tip:**  
> - For **local development**, use the local URL above.  
> - For **Vercel / production**, switch `MONGODB_URI` to your Atlas URL.  
> - You do **not** need to change any code – only the value of `MONGODB_URI`.

The app’s database helper (`lib/mongodb.ts`) already reads:

- `process.env.MONGODB_URI`  
- and falls back to `mongodb://127.0.0.1:27017/tourhydro` if it’s missing.

---

## 3. Running the app locally

```bash
pnpm dev
```

Then open:

- `http://localhost:3000/form` – booking form
- `http://localhost:3000/table` – bookings table

---

## 4. Features

- **Sidebar + navbar layout** shared across pages.
- **Form page** (`/form`):
  - React Hook Form with validation
  - Fields: date, shift, name, email, WhatsApp package, remarks
  - Submits to `/api/bookings` (MongoDB)
  - Edit mode when opened with `?id=<bookingId>`
  - Loading state + success/error toasts
- **Table page** (`/table`):
  - Fetches bookings from `/api/bookings`
  - Filter by WhatsApp package
  - Sort by date (ascending/descending)
  - Pagination
  - Edit button opens the same record in `/form`
  - Print button (`window.print()`)

---

## 5. Deploying to Vercel

1. Push the repo to GitHub.
2. Import the project in Vercel.
3. In **Vercel → Project → Settings → Environment Variables**, add:

```bash
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster-name>.mongodb.net/tourhydro?retryWrites=true&w=majority
```

4. Trigger a new deploy.

Vercel will use the Atlas URI, while your local machine can use either Atlas or your local MongoDB by changing `MONGODB_URI` in `.env.local`.

---

## 6. Switching between Atlas and local

- **To use Atlas locally**: set `MONGODB_URI` to the Atlas URL in `.env.local`.
- **To use local MongoDB**: set `MONGODB_URI` to `mongodb://127.0.0.1:27017/tourhydro` in `.env.local`.

You don’t need to comment/uncomment any code – just change the value of `MONGODB_URI` and restart `pnpm dev` (or the Vercel deployment).

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
