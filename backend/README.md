# Sales Tracker Backend

This is the backend for the Sales Tracker application, which provides APIs for managing leads, companies, interactions, and deals.

## Database Schema

The database schema includes the following tables:

- **users**: User information (extends Supabase auth.users)
- **companies**: Company/organization information
- **leads**: Sales leads information with the following key fields:
  - `created_at`: The date when the lead was created
  - `last_contact_date`: The date when the lead was last contacted
- **interactions**: Records of interactions with leads
- **deals**: Potential sales opportunities with the following key fields:
  - `created_at`: The date when the deal was created
  - `last_contact_date`: The date when the deal was last contacted
- **tasks**: Tasks related to leads

## Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` and update with your Supabase credentials
3. Install dependencies:
   ```
   npm install
   ```

## Database Initialization and Seeding

### Option 1: Using the Supabase SQL Editor (Recommended)

To generate a combined SQL file for manual execution in the Supabase SQL editor:

```
npm run export-sql
```

This will create a file at `src/db/combined-sql.sql` that you can copy and paste into the Supabase SQL editor.

### Option 2: Using the API (Requires proper configuration)

To initialize the database schema:

```
npm run init-db
```

To seed the database with sample data (50 leads):

```
npm run seed-db
```

## Development

To start the development server:

```
npm run dev
```

## Building for Production

To build the application for production:

```
npm run build
```

To start the production server:

```
npm start
``` 