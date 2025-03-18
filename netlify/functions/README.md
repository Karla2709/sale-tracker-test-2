# Sales Tracker Netlify Functions

This directory contains serverless functions that power the Sales Tracker API. These functions are deployed to Netlify and provide a serverless backend for the application.

## Function Structure

Each API endpoint is implemented as a separate serverless function:

- `health.ts` - Health check endpoint
- `leads.ts` - CRUD operations for leads
- `companies.ts` - CRUD operations for companies
- `interactions.ts` - CRUD operations for interactions
- `deals.ts` - CRUD operations for deals
- `tasks.ts` - CRUD operations for tasks

## Utility Modules

- `utils/api.ts` - Utility functions for API responses, CORS, and error handling
- `utils/supabase.ts` - Supabase client configuration

## How It Works

When a request is made to an API endpoint like `/api/leads`, Netlify's redirect rules (defined in `netlify.toml`) route the request to the appropriate function at `/.netlify/functions/leads`.

Each function supports multiple HTTP methods (GET, POST, PUT, DELETE) and implements the appropriate CRUD operations using Supabase.

## Local Development

To run these functions locally:

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Install dependencies:
   ```bash
   cd netlify/functions
   npm install
   ```

3. Create a `.env` file in the project root with your Supabase credentials:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

4. Start the local development server:
   ```bash
   netlify dev
   ```

This will run the Next.js frontend and the Netlify Functions together.

## Testing the Functions

You can test the functions locally with curl:

```bash
# Get all leads
curl http://localhost:8888/api/leads

# Create a new lead
curl -X POST http://localhost:8888/api/leads \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","company_id":"1"}'

# Update a lead
curl -X PUT http://localhost:8888/api/leads/123 \
  -H "Content-Type: application/json" \
  -d '{"name":"Jane Doe"}'

# Delete a lead
curl -X DELETE http://localhost:8888/api/leads/123
```

## Deployment

When you deploy your site to Netlify, these functions will be automatically built and deployed alongside your frontend.

## Environment Variables

Make sure to set these environment variables in your Netlify site:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` 