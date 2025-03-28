# Sales Tracker MVP (v0.1.0)

A SaaS tool for tracking potential clients in the IT consulting sector, focusing on Container Shipping, Ecommerce, Healthcare and other industries.

## Features

- Dashboard with key metrics and activity
- Lead management with status tracking
- Comprehensive filtering and search capabilities
- Color-coded status and domain visualization
- Improved UI/UX with separate search and filter panels
- Expandable rows with detailed lead information
- Advanced search with multiple term support
- Multi-select filters for domains and statuses
- Pagination for managing large lead datasets

## Tech Stack

- **Frontend**: Next.js, TypeScript, Ant Design, Tailwind CSS, TanStack Table
- **Backend**: Node.js, Express, TypeScript
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth

## Local Development Setup

### Prerequisites

- Node.js (v16+)
- npm or yarn
- Docker (for local Supabase)

### Setting Up Supabase

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

### Environment Setup

1. Create a `.env` file in the `backend` directory (or copy from `.env.example`):

```
# Server configuration
PORT=3001

# Supabase configuration
SUPABASE_URL=http://127.0.0.1:54321
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImV4cCI6MTk4MzgxMjk5Nn0.EGIM96RAZx35lJzdJsyH-qQwv8Hdp7fsn3W0YpN81IU

# Other configuration
NODE_ENV=development
```

2. Create a `.env.local` file in the `frontend` directory (or copy from `.env.example`):

```
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

### Running the Application

1. Start the backend server:

```bash
cd backend && npm run dev
```

2. In a new terminal, start the frontend server:

```bash
cd frontend && npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Lead Management Features

The application includes a comprehensive lead management system with the following features:

- **TanStack Table**: Modern, responsive table with expandable rows for detailed information
- **Status Tracking**: Track leads through various stages (New, Reached Out, Meeting Scheduled, etc.)
- **Color Coding**: Visual indicators for lead status and client domain
- **Advanced Search**: Search across name, email, and phone with support for multiple search terms using `/` as separator
- **Multi-select Filtering**: Filter leads by multiple domains and statuses simultaneously
- **Expandable Details**: Click on the row expander to view detailed information and notes
- **Pagination**: Navigate through large datasets with configurable page sizes
- **CRUD Operations**: Create, read, update, and delete leads with a modern UI

### Lead Statuses

The system tracks leads through the following statuses:

- New
- Reached Out
- Meeting Scheduled
- First Meeting Complete
- Second Meeting Completed
- In Dilligence
- Close Deal
- Prospect Decline

### Client Domains

Leads are categorized into the following domains:

- Container Shipping
- Ecommerce
- Healthcare
- Others

## UI Improvements (v0.1.0)

- Implemented TanStack Table for a modern, responsive data grid
- Added expandable rows with detailed lead information
- Enhanced search functionality with multiple term support
- Integrated multi-select filtering for both domains and statuses
- Added a dedicated search and filter bar above the table
- Improved pagination with configurable page sizes
- Enhanced status and domain tag colors for better visual distinction
- Optimized padding and spacing for better information density
- Implemented reset filters functionality
- Added empty state handling for filtered results
- Made UI elements fully responsive for all screen sizes

## API Endpoints

The backend provides the following API endpoints for lead management:

- `GET /api/leads`: Get all leads with pagination and filtering
- `GET /api/leads/:id`: Get a specific lead by ID
- `POST /api/leads`: Create a new lead
- `PUT /api/leads/:id`: Update an existing lead
- `DELETE /api/leads/:id`: Delete a lead

## Project Structure

```
sales-tracker-mvp/
├── backend/                # Backend API server
│   ├── src/
│   │   ├── config/         # Configuration files
│   │   ├── routes/         # API routes
│   │   ├── services/       # Business logic
│   │   ├── scripts/        # Utility scripts
│   │   └── index.ts        # Entry point
│   └── package.json
│
├── frontend/               # Next.js frontend
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── app/            # Next.js app router
│   │   ├── components/     # React components
│   │   │   ├── leads/      # Lead management components
│   │   │   └── ...         # Other UI components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # Utility functions
│   │   └── styles/         # CSS styles
│   └── package.json
│
├── supabase/               # Supabase configuration
│   ├── migrations/         # Database migrations
│   └── config.toml         # Supabase configuration
│
└── package.json            # Root package.json for running both services
```

## Data Generation

The application includes a script to generate sample data for testing:

```bash
cd backend && npx ts-node src/scripts/generate-sample-leads.ts [count]
```

This script will create the specified number of sample leads with realistic data including:
- Random names, emails, and phone numbers
- Varied statuses and domains
- Realistic notes and contact information
- Randomized creation and last contact dates

## Troubleshooting

If you encounter any issues, try the following:

1. Reset the database:
```bash
npx supabase db reset
```

2. Restart the backend and frontend:
```bash
# Kill any running processes
lsof -i :3000-3002 | awk 'NR>1 {print $2}' | xargs -r kill -9

# Restart backend
cd backend && npm run dev

# Restart frontend
cd frontend && npm run dev
```

3. Check the health of the backend API:
```bash
curl http://localhost:3001/api/health
```

## License

This project is licensed under the MIT License - see the LICENSE file for details. 