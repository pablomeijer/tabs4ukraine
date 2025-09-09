# Disable Email Confirmation in Supabase

To fix the authentication flow and make signup work immediately, you need to disable email confirmation in Supabase.

## Steps:

1. **Go to Supabase Dashboard**
   - Open your Supabase project dashboard
   - Navigate to: **Authentication** → **Settings**

2. **Disable Email Confirmation**
   - Find the section "User Signups"
   - **Uncheck** "Enable email confirmations"
   - Click **Save**

3. **Test the Extension**
   - Build and reload the extension: `npx vite build`
   - Try signing up with a new account
   - The user should be immediately signed in
   - Profile icon should turn green
   - Sign up button should disappear

## Alternative: Keep Email Confirmation

If you want to keep email confirmation enabled:

1. **Sign up** with a new account
2. **Check your email** for the confirmation link
3. **Click the confirmation link**
4. **Return to the extension** and sign in
5. **Profile should update** to show logged-in state

## Why This Happens

- Supabase requires email confirmation by default
- Without confirmation, users aren't automatically signed in
- The UI shows guest state until the user is authenticated
- Disabling confirmation allows immediate signup and login
