# Sponsored Shortcut Statistics - Admin Access

## Summary
All sponsored shortcut click data is being tracked and stored in Supabase, ready for you to query.

## ⚠️ IMPORTANT: Create the Table First!
Before you can track shortcuts, you need to create the `sponsored_clicks` table in Supabase.

### How to Create the Table:
1. Go to your Supabase project: https://supabase.com/dashboard/project/fvmpnqaoympgmrullemj
2. Click **"SQL Editor"** in the left sidebar
3. Click **"New query"**
4. Copy and paste the SQL from `ethicly/database/create-sponsored-clicks-table.sql`
5. Click **"Run"** (or press Ctrl+Enter)
6. The table is now created and ready to track clicks!

## What's Stored in Supabase

### Table: `sponsored_clicks`
Every time a user clicks on a sponsored shortcut, a record is created with:
- `user_id` - Who clicked (or anonymous ID)
- `shortcut_name` - Name of the shortcut (e.g., "Zeeks", "Reface")
- `shortcut Picture_url` - The URL that was clicked
- `donation_amount` - $0.50 per click
- `created_at` - Timestamp of the click

## How to Access the Data

### Option 1: Supabase Dashboard
1. Go to your Supabase project: https://supabase.com/dashboard/project/fvmpnqaoympgmrullemj
2. Navigate to "Table Editor"
3. Open the `sponsored_clicks` table
4. View all click data or filter by date, shortcut name, etc.

### Option 2: SQL Query
Use this query in Supabase SQL Editor to get statistics:

```sql
-- Get statistics for each shortcut
SELECT 
  shortcut_name,
  shortcut_url,
  COUNT(*) as total_clicks,
  SUM(donation_amount) as total_donations,
  MAX(created_at) as last_click
FROM sponsored_clicks
GROUP BY shortcut_name, shortcut_url
ORDER BY total_clicks DESC;
```

### Option 3: API Function (in your code)
Use the function I created in `src/lib/supabase.ts`:

```typescript
const { data, error } = await sponsoredTracker.getShortcutStats();
// Returns: Array of shortcuts with clicks and donations
```

## What You Can Track
- **Total clicks per shortcut** - See which shortcuts get the most engagement
- **Total donations per shortcut** - Revenue generated per shortcut  
- **Click trends over time** - Filter by date to see daily/weekly/monthly stats
- **User behavior** - See how many clicks per user (if you want to track user engagement)

## Next Steps
- Access the data from Supabase dashboard or SQL editor
- This data is **separate from Ethicly ads** (which are tracked in the `ads` table)
- You have full admin access to this data

