# Local Development Guide

This guide will help you set up and run the Sale Tracker application locally.

## Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker (for local Supabase)

## Starting the Applications

### 1. Start Supabase (Database)

```bash
npx supabase start
```

Supabase URLs and endpoints:
- Studio (Admin UI): http://127.0.0.1:54323
- API URL: http://127.0.0.1:54321
- Database URL: postgresql://postgres:postgres@127.0.0.1:54322/postgres

### 2. Start Backend Server

```bash
cd backend
npm run dev
```

Backend URLs and endpoints:
- Base URL: http://localhost:3001
- Health Check: http://localhost:3001/api/health

### 3. Start Frontend Application

```bash
cd frontend
npm run dev
```

Frontend URLs and pages:
- Home Page: http://localhost:3000
- Dashboard: http://localhost:3000/dashboard
- Settings: http://localhost:3000/dashboard/settings

## Application Structure

```
sale-tracker/
├── frontend/               # Next.js frontend
│   ├── src/
│   │   ├── app/           # Next.js app router pages
│   │   ├── components/    # React components
│   │   └── lib/          # Utilities and configurations
│   └── public/           # Static assets
│
├── backend/              # Node.js backend
│   ├── src/
│   │   ├── config/      # Configuration files
│   │   ├── controllers/ # API controllers
│   │   ├── routes/      # API routes
│   │   └── services/    # Business logic
│   └── package.json
│
└── supabase/            # Supabase configuration
    ├── migrations/      # Database migrations
    └── seed.sql        # Seed data

```

## Environment Variables

### Backend (.env)
```env
PORT=3001
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=<your-anon-key>
SUPABASE_SERVICE_ROLE_KEY=<your-service-role-key>
NODE_ENV=development
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Development Workflow

1. Start all services in the following order:
   - Supabase
   - Backend
   - Frontend

2. Access the application:
   - Start at http://localhost:3000
   - Navigate to Dashboard using the "Go to Dashboard" button
   - Access Settings from the sidebar menu

3. Database Management:
   - Use Supabase Studio at http://127.0.0.1:54323 for database management
   - Run migrations: `npx supabase db reset`
   - Export schema: `npm run export-sql`

## Troubleshooting

1. If you encounter build errors:
   - Clear Next.js cache: `cd frontend && rm -rf .next`
   - Restart the frontend application

2. If database connection fails:
   - Ensure Supabase is running: `npx supabase status`
   - Check environment variables match Supabase output

3. If API calls fail:
   - Verify backend is running on port 3001
   - Check API URL in frontend environment variables 