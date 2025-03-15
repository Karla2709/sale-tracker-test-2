# Sales Tracker MVP

A SaaS tool for tracking potential clients in the IT consulting sector, focusing on Container Shipping, Drop Shipping, and E-commerce industries.

## Features

- Dashboard with key metrics and activity
- Lead management
- Company tracking
- Deal pipeline
- Interaction history

## Tech Stack

- **Frontend**: Next.js, TypeScript, Ant Design, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth

## Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Supabase account

### Setting Up Supabase

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Save your database password securely
4. Once your project is created, navigate to the Settings > API section to find your API keys
5. Copy the URL and anon key for the next step

### Environment Setup

1. Create a `.env` file in the `backend` directory:

```
# Supabase Connection
SUPABASE_URL=https://your-project-url.supabase.co
SUPABASE_ANON_KEY=your-supabase-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key

# Server Configuration
PORT=3001
NODE_ENV=development
```

2. Create a `.env.local` file in the `frontend` directory:

```
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=https://your-project-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Database Initialization

#### Option 1: Using the Supabase SQL Editor (Recommended)

1. Generate the SQL scripts for manual execution:

```bash
npm run export-sql
```

2. Copy the contents of `backend/src/db/combined-sql.sql` and paste it into the Supabase SQL Editor
3. Execute the SQL to set up your database schema and seed data

#### Option 2: Using the API (Requires proper configuration)

1. Run the database initialization script to set up the schema:

```bash
npm run init-db
```

2. Seed the database with sample data:

```bash
npm run seed-db
```

### Installation

1. Install all dependencies:

```bash
npm run install-all
```

### Running the Application

1. Start both the backend and frontend servers:

```bash
npm run dev
```

2. Open your browser and navigate to `http://localhost:3000`

## Development

### Project Structure

```
sales-tracker-mvp/
├── backend/                # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── controllers/    # API controllers
│   │   ├── db/             # Database scripts and models
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   └── index.ts        # Entry point
│   └── package.json
│
├── frontend/               # Next.js frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   ├── pages/          # Next.js pages
│   │   └── styles/         # CSS styles
│   └── package.json
│
└── package.json            # Root package.json for running both services
```

## Supabase Database Schema

The database schema includes the following tables:

- `users`: User profiles linked to Supabase Auth
- `companies`: Companies/organizations
- `leads`: Potential client contacts
- `interactions`: Communication history with leads
- `deals`: Sales opportunities and their status
- `tasks`: Tasks related to leads

## License

This project is licensed under the MIT License - see the LICENSE file for details. 