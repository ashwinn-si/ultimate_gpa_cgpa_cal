# 🚀 Quick Setup Guide

## Database Setup is Required!

You're seeing the error because the database tables haven't been created yet. Follow these steps:

---

## Step 1: Get Supabase API Keys

1. Go to: https://supabase.com/dashboard/project/ebitiqspadyazixoglod/settings/api
2. Copy the following values:
   - **Project URL** (looks like: `https://ebitiqspadyazixoglod.supabase.co`)
   - **anon/public key** (long string starting with `eyJ...`)
   - **service_role key** (another long string)

3. Open `.env.local` in this project
4. Replace `your-anon-key-here` with your actual anon key
5. Replace `your-service-role-key-here` with your actual service role key

---

## Step 2: Create Database Tables

1. Go to: https://supabase.com/dashboard/project/ebitiqspadyazixoglod/editor
2. Click **SQL Editor** in the left sidebar
3. Click **+ New query**
4. Open the `supabase_schema.sql` file in this project
5. Copy ALL the SQL code
6. Paste it into the Supabase SQL Editor
7. Click **Run** (or press Cmd/Ctrl + Enter)
8. Wait for success message (should see "Success. No rows returned")

---

## Step 3: Verify Setup

1. Go to: https://supabase.com/dashboard/project/ebitiqspadyazixoglod/editor
2. Click **Table Editor**
3. You should see these tables:
   - ✅ semesters
   - ✅ subjects
   - ✅ grade_configs
   - ✅ user_settings

---

## Step 4: Restart Dev Server

```bash
# Stop the current server (Ctrl+C)
# Then restart:
npm run dev
```

---

## Step 5: Test the App

1. Go to: http://localhost:3000
2. Click **Register** and create an account
3. Check your email and verify (or check Supabase Auth users)
4. Log in
5. You should now see the dashboard! 🎉

---

## Troubleshooting

### Still getting "Could not find table" error?

1. Make sure you ran the ENTIRE SQL script (all tables)
2. Check if tables exist in Supabase Table Editor
3. Make sure your `.env.local` has correct API keys
4. Restart the dev server after updating `.env.local`

### Can't see email verification?

1. Go to Supabase dashboard
2. Click **Authentication** → **Users**
3. Find your user and click the **...** menu
4. Click **Send magic link** or manually verify

### Need to reset database?

```sql
-- Run this in SQL Editor to drop all tables:
DROP TABLE IF EXISTS subjects CASCADE;
DROP TABLE IF EXISTS semesters CASCADE;
DROP TABLE IF EXISTS grade_configs CASCADE;
DROP TABLE IF EXISTS user_settings CASCADE;

-- Then run the schema again
```

---

## Quick Links

- 📊 [Supabase Dashboard](https://supabase.com/dashboard/project/ebitiqspadyazixoglod)
- 🔑 [API Settings](https://supabase.com/dashboard/project/ebitiqspadyazixoglod/settings/api)
- 📝 [SQL Editor](https://supabase.com/dashboard/project/ebitiqspadyazixoglod/editor)
- 📋 [Table Editor](https://supabase.com/dashboard/project/ebitiqspadyazixoglod/editor)
- 👥 [Auth Users](https://supabase.com/dashboard/project/ebitiqspadyazixoglod/auth/users)
