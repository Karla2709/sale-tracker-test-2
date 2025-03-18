# Deploying the Sales Tracker to Netlify

This guide will help you deploy your Sales Tracker application to Netlify.

## Prerequisites

- A Netlify account (create one at [netlify.com](https://netlify.com) if needed)
- Git repository for your project
- Supabase project already set up

## Option 1: Deploy Frontend Only (Recommended for Quick Start)

This approach deploys only your Next.js frontend to Netlify and keeps your backend running separately.

1. **Connect your repository to Netlify**
   - Log in to your Netlify account
   - Click "New site from Git"
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Select your repository
   - Use these build settings:
     - Base directory: `frontend`
     - Build command: `npm run build`
     - Publish directory: `.next`
   - Click "Deploy site"

2. **Configure environment variables**
   - In your Netlify site dashboard, go to Site settings > Build & deploy > Environment
   - Add the following environment variables:
     - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
     - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
     - Add any other environment variables required by your application

3. **Update your backend URL in your frontend code**
   - You'll need to update your API calls to point to your backend URL wherever it's hosted

## Option 2: Deploy Backend Using Netlify Functions

If you want to host both frontend and backend on Netlify:

1. **Create a `netlify/functions` directory in your root**
```bash
mkdir -p netlify/functions
```

2. **Create serverless functions that mirror your backend endpoints**
   - Create individual functions for each endpoint
   - You'll need to adapt your existing backend code to work as serverless functions

3. **Update the `netlify.toml` file to include the functions directory**
   - Uncomment the redirects section in the existing netlify.toml file

4. **Update your frontend API calls to use the Netlify Functions endpoints**
   - Replace backend URLs with `/.netlify/functions/[function-name]`

## Option 3: Deploy Backend Separately

You can also deploy your backend separately on a service like:
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Heroku](https://heroku.com)

Then update your frontend code to point to your deployed backend URL.

## Important Notes

1. **Environment Variables**: Make sure to set all required environment variables in Netlify.
2. **CORS Configuration**: If you're hosting the backend separately, you'll need to configure CORS to allow requests from your Netlify domain.
3. **Database Connection**: Ensure your backend can connect to your Supabase database from its deployed location.
4. **Build Hook**: Consider setting up a build hook to trigger redeploys when your backend or database schema changes.

## Testing Your Deployment

After deployment, thoroughly test all functionality to ensure everything is working as expected in the production environment. 