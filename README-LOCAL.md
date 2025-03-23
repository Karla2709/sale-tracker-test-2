# Local Development Guide for Sales Tracker (v0.0.1)

## Starting the Application

For local development, you need to run Supabase, the backend server, and the frontend application.

### 1. Starting Supabase

```bash
# Start Supabase services
npx supabase start

# If there are database changes to apply
npx supabase db reset
```

### 2. Starting the Backend Server

```bash
# Navigate to the backend directory
cd backend

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

The backend should start on port 3001 by default.

### 3. Starting the Frontend Application

```bash
# Navigate to the frontend directory
cd frontend

# Install dependencies (if not already installed)
npm install

# Start the development server
npm run dev
```

The frontend should start on port 3000 by default.

## Restarting the Complete Application

If you need to restart all components of the application, follow these steps:

### 1. Stop all running processes

```bash
# Kill any Node.js processes
pkill -f node

# Or more specifically, kill processes running on the application ports
lsof -i :3000-3002 | awk 'NR>1 {print $2}' | xargs -r kill -9
```

### 2. Restart Supabase (if needed)

```bash
# Stop Supabase
npx supabase stop

# Start Supabase again
npx supabase start

# Optional: Reset the database
npx supabase db reset
```

### 3. Restart the Backend

```bash
cd backend
npm run dev
```

### 4. Restart the Frontend

```bash
# In a new terminal
cd frontend
npm run dev
```

## Environment Variables

### Backend (.env file in backend directory)

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

### Frontend (.env.local file in frontend directory)

```
# Supabase Connection
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:3001
```

## Application Structure

- **Frontend**: Next.js application with Ant Design and Tailwind CSS
- **Backend**: Express API server with TypeScript
- **Database**: PostgreSQL managed by Supabase

## Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:3001
- Supabase Studio: http://127.0.0.1:54323

## Common Issues and Troubleshooting

### Build Errors

If you encounter build errors, try:

```bash
# Clean node_modules and reinstall
rm -rf node_modules
npm install

# Clear Next.js cache (for frontend)
rm -rf .next
```

### Database Connection Errors

Check that Supabase is running:

```bash
npx supabase status
```

If there are issues, restart Supabase:

```bash
npx supabase stop
npx supabase start
```

### Port Conflicts

If ports are already in use, you can:

1. Kill the processes using those ports:
   ```bash
   lsof -i :3000-3002 | awk 'NR>1 {print $2}' | xargs -r kill -9
   ```

2. Or modify the ports in:
   - Frontend: `next.config.js`
   - Backend: `.env` file (PORT variable)

### API Connection Issues

If the frontend can't connect to the backend, check:

1. The backend is running on the expected port
2. The `NEXT_PUBLIC_API_URL` in frontend's `.env.local` is correct
3. There are no CORS issues (check backend logs)

## Development Tips

- Use the Supabase Studio at http://127.0.0.1:54323 to manage your database
- The backend has hot-reloading enabled for faster development
- The frontend uses Next.js App Router for modern React development patterns 