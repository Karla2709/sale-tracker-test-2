# Deploying the Sales Tracker to Netlify

This guide will help you deploy your Sales Tracker application to Netlify.

## Prerequisites

- A Netlify account (create one at [netlify.com](https://netlify.com) if needed)
- Git repository for your project
- Supabase project already set up

## Option 1: Deploy Frontend Only

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

## Option 2: Deploy with Netlify Functions (Recommended)

This project is pre-configured to use Netlify Functions as a serverless backend:

1. **Connect your repository to Netlify**
   - Log in to your Netlify account
   - Click "New site from Git"
   - Select your Git provider
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
     - `SUPABASE_URL`: Your Supabase URL (same as above)
     - `SUPABASE_ANON_KEY`: Your Supabase anon key (same as above)
     - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key

3. **The project already includes**:
   - Netlify Functions in the `netlify/functions` directory
   - Redirect rules in `netlify.toml` to route API calls to the functions
   - The required Netlify Next.js plugin

4. **Deploy your site**
   - Your Netlify Functions will be automatically deployed with your site

5. **Testing your functions**
   - You can test your API at `https://your-site-name.netlify.app/api/leads`

## Option 3: Deploy Backend Separately

You can also deploy your backend separately on a service like:
- [Render](https://render.com)
- [Railway](https://railway.app)
- [Heroku](https://heroku.com)

Then update your frontend code to point to your deployed backend URL.

## Local Development with Netlify Functions

To test the Netlify Functions locally:

1. Install the Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Create a `.env` file in the project root with your Supabase credentials:
   ```
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-supabase-service-role-key
   ```

3. Start the local development server:
   ```bash
   netlify dev
   ```

4. This will serve:
   - Your Next.js frontend at `http://localhost:8888`
   - Your Netlify Functions at `http://localhost:8888/.netlify/functions/leads` etc.
   - The redirects will work too, so you can use `http://localhost:8888/api/leads`

## Important Notes

1. **Environment Variables**: Make sure to set all required environment variables in Netlify.
2. **CORS Configuration**: The Netlify Functions already include CORS headers.
3. **Database Connection**: Ensure your Supabase database allows connections from Netlify's IP ranges.
4. **Build Hook**: Consider setting up a build hook to trigger redeploys when your backend or database schema changes.

## Testing Your Deployment

After deployment, thoroughly test all functionality to ensure everything is working as expected in the production environment. 