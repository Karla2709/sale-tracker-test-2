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
- **Deployment**: Netlify with Serverless Functions

## Deployment Options

This application supports multiple deployment options:

### Option 1: Separate Frontend and Backend

Deploy the Next.js frontend on Netlify and the Express backend on a separate service like Render, Railway, or Heroku.

### Option 2: Netlify Functions (Serverless)

Deploy both frontend and backend on Netlify, using Netlify Functions for the backend API. This is the recommended approach for simplicity and cost-effectiveness.

The project includes serverless functions in the `netlify/functions` directory that replace the Express backend. These functions are automatically deployed when you deploy to Netlify.

### Option 3: Supabase Functions

For simple operations, you can use Supabase's Edge Functions to handle backend logic directly in the database.

For detailed deployment instructions, see the [NETLIFY_DEPLOYMENT.md](./NETLIFY_DEPLOYMENT.md) guide.

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

## Database Migration

### Setting Up Cloud Database

Follow these steps to link your local Supabase instance to a cloud project and push your local database schema and data to the cloud:

1. Log in to Supabase CLI:

```bash
npx supabase login
```

2. List your available Supabase projects:

```bash
npx supabase projects list
```

3. Link your local instance to a cloud project:

```bash
npx supabase link --project-ref your-project-ref-id
```

4. Create a new migration file:

```bash
npx supabase migration new my_migration_name
```

5. Edit the migration file (located in `supabase/migrations/`) to include your schema and seed data with proper IF NOT EXISTS clauses to handle conflicts

6. Push the migrations to the cloud database:

```bash
npx supabase db push
```

### Environment Configuration

Two environment files control where your application connects:

- `.env.local`: For local development (points to local Supabase)
- `.env.production`: For production/cloud environment (points to cloud Supabase)

To switch between environments:

```bash
# For local development
cp .env.local .env

# For production
cp .env.production .env
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 