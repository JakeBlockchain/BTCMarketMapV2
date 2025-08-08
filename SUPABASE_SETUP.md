# Supabase Setup Guide

This guide will help you complete Step 2 of the project plan: Supabase Project Creation and Integration.

## Prerequisites

- A Supabase account (sign up at [supabase.com](https://supabase.com))
- Docker Desktop (for local development) OR a cloud Supabase project

## Option 1: Cloud Supabase Setup (Recommended)

### 1. Create a New Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Fill in project details:
   - **Name**: `btc-market-map` (or your preferred name)
   - **Database Password**: Generate a strong password and save it
   - **Region**: Choose the region closest to your users
5. Click "Create new project"

### 2. Get Your Project Credentials

1. Once your project is created, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (looks like `https://your-project-id.supabase.co`)
   - **anon public** key (starts with `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`)

### 3. Get Your Database URL

1. Go to **Settings** → **Database**
2. Scroll down to **Connection string**
3. Select **URI** tab
4. Copy the connection string (it will look like `postgresql://postgres:[YOUR-PASSWORD]@db.your-project-id.supabase.co:5432/postgres`)
5. Replace `[YOUR-PASSWORD]` with the database password you created in step 1

### 4. Update Your Environment Variables

Open your `.env.local` file and update these values:

```env
# Replace with your actual Supabase project URL
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co

# Replace with your actual anon key
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Replace with your actual database connection string
DATABASE_URL=postgresql://postgres:your-password@db.your-project-id.supabase.co:5432/postgres
```

## Option 2: Local Development Setup

### 1. Start Docker Desktop

Make sure Docker Desktop is running on your machine.

### 2. Start Local Supabase

```bash
npm run db:local
```

This will start a local Supabase instance with the following default credentials:

### 3. Update Environment Variables for Local Development

```env
# Local Supabase URL
NEXT_PUBLIC_SUPABASE_URL=http://127.0.0.1:54321

# Local Supabase anon key (this is the default local key)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0

# Local database URL
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:54322/postgres
```

## Testing Your Setup

Once you've configured your environment variables, test the connection:

```bash
npm run db:test
```

You should see:

```
Testing Supabase client initialization...
✅ Supabase client initialized successfully!
```

If you see an error, double-check your environment variables.

## Next Steps

After completing this setup:

1. ✅ **Step 2 Complete**: Supabase Project Creation and Integration
2. **Next**: Proceed to Step 3 - Drizzle ORM Setup and Schema Definition

## Troubleshooting

### "Invalid API key" Error

- Double-check that you copied the correct anon key from your Supabase project settings
- Make sure there are no extra spaces or characters in your `.env.local` file

### "Connection refused" Error

- For local development: Make sure Docker Desktop is running and `npm run db:local` completed successfully
- For cloud: Check that your database URL is correct and includes the right password

### Environment Variables Not Loading

- Make sure your `.env.local` file is in the root of the `BTCMarketMapV2` directory
- Restart your development server after updating environment variables
- Check that `.env.local` is listed in your `.gitignore` file (it should be)

## Security Notes

- Never commit your `.env.local` file to version control
- The anon key is safe to use in client-side code (it's designed for that)
- Keep your service role key (if you get one later) secret and server-side only
