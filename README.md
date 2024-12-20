# K-Pop Quiz Project

## Overview
This is a monorepo for a K-Pop quiz application. The platform allows users to:

- **Sign Up & Log In:** Create an account and manage a personal library of favorite K-Pop songs.
- **Quiz Features:** Test your knowledge in unlimited mode or try a 5-round quiz mode, and track your performance.
- **Admin Panel (If Admin):** Add or delete songs in the database, accessible only to admin users.

**Tech Stack:**
- **Backend:** Node.js, Express, Prisma, Postgres
- **Frontend:** Next.js 13 (App Router), React, Tailwind CSS
- **Database:** PostgreSQL (run via Docker or local installation)

## Repository Structure
project-root/
├─ docker-compose.yml            # If using Docker for Postgres
├─ README.md                     # Documentation for setup and usage
├─ .gitignore                    # Ignored files listing
└─ packages/
   ├─ backend/                   # Backend code (Express, Prisma)
   │  ├─ src/
   │  │  ├─ controllers/         # All controllers (e.g., authController.ts)
   │  │  ├─ routes/              # Express route definitions (e.g., auth.ts, admin.ts)
   │  │  ├─ services/            # Business logic (e.g., authService.ts)
   │  │  ├─ db/                  # Prisma client, schema, etc.
   │  │  └─ ... other backend code ...
   │  ├─ prisma/
   │  │  ├─ schema.prisma        # Prisma schema
   │  │  └─ migrations/          # Migration files
   │  ├─ .env.example            # Backend environment variables template
   │  ├─ package.json
   │  └─ ... other backend files (e.g., tsconfig.json) ...
   └─ frontend/                  # Frontend code (Next.js, Tailwind)
      ├─ app/                    # Next.js App Router pages, components, layouts
      │  ├─ page.tsx            # Landing page
      │  ├─ layout.tsx          # Root layout
      │  ├─ global.css          # Global CSS (Tailwind imports)
      │  ├─ quiz/
      │  │  └─ page.tsx         # Quiz page
      │  ├─ songs/
      │  │  └─ page.tsx         # Songs or Library page
      │  ├─ signup/
      │  │  └─ page.tsx         # Signup page
      │  └─ login/
      │     └─ page.tsx         # Login page
      ├─ public/                # Public assets (images, etc.)
      ├─ .env.example           # Frontend environment variables template
      ├─ package.json
      └─ ... other frontend files (e.g., tailwind.config.js, tsconfig.json) ...


## Prerequisites
- **Node.js:** Use LTS version
- **Yarn:** For package management
- **Docker (optional):** To run Postgres easily, or have Postgres installed locally

## Setup Instructions

### 1. Environment Variables
Copy `.env.example` in both `packages/backend` and `packages/frontend` to `.env` and fill in your values.

**Backend `.env` (example):**
```env
DATABASE_URL=postgres://user:password@localhost:5432/kpopquiz
JWT_SECRET=supersecretjwtkey


Frontend .env (example):
NEXT_PUBLIC_API_URL=http://localhost:4000/api

Do not commit .env files to the repository. They are in .gitignore to keep secrets safe. The .env.example files show what variables are needed without revealing real credentials.

2. Install Dependencies
From the project root:
yarn install

3. Start the Database
If you have docker-compose.yml setup:
docker-compose up -d
This starts a Postgres container on localhost:5432. Alternatively, use your own Postgres instance.

4. Run Migrations
Apply Prisma migrations to set up the database schema:
cd packages/backend
yarn prisma migrate dev --name init
This creates the necessary tables (User, Song, etc.).

5. Start the Backend
From packages/backend:
yarn dev
The backend runs on http://localhost:4000.

6. Start the Frontend
In another terminal, from packages/frontend:
yarn dev
This starts the Next.js app on http://localhost:3000.

7. Using the App
Visit http://localhost:3000 to access the landing page.
Sign Up or Log In to manage your library and access quiz features.
If you have an admin user, you’ll see an “Admin” tab to add/delete songs.

Branching & Contributions
Main Branch: main is stable.
Feature Branches: Create branches like feature/add-library from main.
Pull Requests: Submit PRs for review before merging into main.