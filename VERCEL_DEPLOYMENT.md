# Deploying the Express Backend to Vercel

This guide outlines how to deploy the Express backend of the Sales Tracker MVP to Vercel, while connecting it to a Netlify-hosted frontend and a Supabase database.

## Overview

In this setup:
- Frontend: Hosted on Netlify
- Backend API: Hosted on Vercel
- Database: Hosted on Supabase Cloud

## Prerequisites

1. Vercel account
2. Vercel CLI installed (`npm i -g vercel`)
3. GitHub repository with your code
4. Supabase cloud project already set up

## Configuration Files

The following files in the repository are configured for Vercel deployment:

1. `backend/vercel.json` - Vercel configuration file
```json
{
  "version": 2,
  "builds": [
    {
      "src": "dist/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "dist/index.js"
    }
  ]
}
```

2. `backend/package.json` - Added Vercel-specific build script
```json
{
  "scripts": {
    // ... other scripts
    "vercel-build": "tsc"
  },
  "engines": {
    "node": ">=18.x"
  }
}
```

3. `backend/src/index.ts` - Modified to handle Vercel deployment
```typescript
// Server setup conditional to not start server during Vercel build
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

// Export the Express app for Vercel
export default app;
```

4. `backend/.env.production` - Environment variables for production
```
PORT=3001
NODE_ENV=production
VERCEL=1
FRONTEND_URL=https://sale-tracker-mvp.netlify.app
```

## Deployment Steps

### 1. Push Your Code to GitHub

Ensure your code is pushed to a GitHub repository.

### 2. Connect to Vercel

From the backend directory:

```bash
cd backend
vercel login
vercel
```

Follow the prompts to connect your repository.

### 3. Configure Environment Variables

Set the following environment variables in the Vercel dashboard:

- `SUPABASE_URL`: Your Supabase project URL
- `SUPABASE_ANON_KEY`: Your Supabase anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
- `FRONTEND_URL`: The URL of your Netlify frontend (for CORS)
- `VERCEL`: Set to "1" to indicate Vercel environment
- `NODE_ENV`: Set to "production"

### 4. Deploy

Trigger a deployment from the Vercel dashboard or via the CLI:

```bash
vercel --prod
```

### 5. Update Frontend Environment Variables

Update the frontend `.env.production` file to point to your new Vercel backend:

```
NEXT_PUBLIC_API_URL=https://your-vercel-app-name.vercel.app
```

### 6. Redeploy Frontend

Redeploy your frontend to Netlify to use the new API URL:

```bash
cd ../frontend
npm run build
cd ..
netlify deploy --prod
```

## CORS Configuration

The backend is configured to allow requests from the Netlify frontend. The CORS configuration in `backend/src/index.ts` includes:

```typescript
const allowedOrigins = [
  'https://sale-tracker-mvp.netlify.app',    // Production frontend
  'http://localhost:3000',                   // Local frontend development
  process.env.FRONTEND_URL || '',            // Environment variable based frontend URL
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true
}));
```

## Troubleshooting

### 1. CORS Issues

If you encounter CORS issues:
- Check that the `FRONTEND_URL` is correctly set in Vercel environment variables
- Ensure the allowed origins list in your CORS configuration includes your frontend URL
- Verify that your frontend is using the correct API URL

### 2. Database Connection Issues

If the backend cannot connect to Supabase:
- Verify that `SUPABASE_URL`, `SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` are correctly set in Vercel
- Check that your Supabase project has the correct IP permissions

### 3. Deployment Failures

If deployment fails:
- Check the Vercel build logs for specific error messages
- Ensure that the `vercel-build` script is properly configured to compile TypeScript
- Verify that your `vercel.json` configuration is correct

## Local Testing

To test the Vercel configuration locally:

```bash
cd backend
npm run build
vercel dev
```

This will simulate the Vercel environment locally.

## Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Express.js on Vercel](https://vercel.com/guides/using-express-with-vercel)
- [Environment Variables on Vercel](https://vercel.com/docs/concepts/projects/environment-variables) 