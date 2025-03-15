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
- Docker (for local Supabase)

### Setting Up Supabase

#### Option 1: Local Development with Supabase CLI (Recommended)

1. Start the local Supabase services:

```bash
npx supabase start
```

2. This will provide you with local URLs and keys for Supabase services:
   - API URL: http://127.0.0.1:54321
   - Studio URL: http://127.0.0.1:54323
   - Anon Key and Service Role Key will be displayed in the terminal

3. Apply the database migrations and seed data:

```bash
npx supabase db reset
```

#### Option 2: Using Supabase Cloud

1. Create a Supabase account at [supabase.com](https://supabase.com)
2. Create a new project
3. Save your database password securely
4. Once your project is created, navigate to the Settings > API section to find your API keys
5. Copy the URL and anon key for the next step

### Environment Setup

1. Create a `.env` file in the `backend` directory (or copy from `.env.example`):

```
# Server configuration
PORT=3001

# Supabase configuration
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Other configuration
NODE_ENV=development
```

2. Create a `.env.local` file in the `frontend` directory (or copy from `.env.example`):

```
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
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
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migrations
│   ├── seed.sql            # Seed data
│   └── config.toml         # Supabase configuration
│
└── package.json            # Root package.json for running both services
```

## Supabase Database Schema

The database schema includes the following tables:

- `companies`: Companies/organizations
- `leads`: Potential client contacts
- `interactions`: Communication history with leads
- `deals`: Sales opportunities and their status
- `tasks`: Tasks related to leads

## License

This project is licensed under the MIT License - see the LICENSE file for details. 