# Daily — AI fitness tracker (PWA + Supabase)

A single-page, installable PWA for tracking calories, macros, workouts,
water, weight and streaks — with optional AI logging (Claude) and
Google sign-in + cloud sync via Supabase.

## Project structure

```
index.html               # app shell, loads everything
manifest.webmanifest     # PWA manifest (installable)
sw.js                    # service worker (offline cache)
icons/icon.svg           # app icon
css/styles.css           # all styles
supabase/schema.sql      # database table + security policies
js/
  config.js              # ← paste your Supabase URL + anon key here
  data.js                # food library, exercises, goals, activity levels
  state.js               # state shape, local persistence, per-day helpers
  calc.js                # BMR / calorie / macro / projection maths
  cloud.js               # Supabase: Google auth + cloud sync
  ai.js                  # Claude calls for AI logging
  ui.js                  # shared UI helpers (sheets, charts, day nav)
  auth.js                # Google sign-in screen
  onboarding.js          # multi-step setup wizard (also edits goal)
  screens.js             # Diet / Train / Streak / You screens
  sheets.js              # food / workout / weight bottom sheets
  app.js                 # router, session boot, install prompt
```

## Run it

The app works two ways:

- **Open `index.html` directly** — runs in local-only mode (data saved on the
  device). Google sign-in and the service worker need http(s), so they're off.
- **Serve over http(s)** — full PWA: installable, offline cache, and Google
  sign-in once Supabase is configured.

  ```bash
  npx serve .          # or: python3 -m http.server 8080
  ```

## Connect Supabase (Google sign-in + sync)

1. Create a project at [supabase.com](https://supabase.com).
2. **SQL Editor** → run [`supabase/schema.sql`](supabase/schema.sql).
3. **Authentication → Providers → Google**: enable it and paste your Google
   OAuth Client ID + Secret (from Google Cloud Console). Add Supabase's callback
   URL to the Google client's authorized redirect URIs.
4. **Authentication → URL Configuration**: add your app URL(s) (e.g.
   `http://localhost:8080` and your hosted URL) to Site URL + Redirect URLs.
5. **Project Settings → API**: copy the **Project URL** and **anon public key**
   into [`js/config.js`](js/config.js).

That's it — reload and "Continue with Google" will work, with each user's data
synced to their own row in `app_state`.

## Notes

- AI meal/workout logging calls the Anthropic API directly and only works inside
  claude.ai; everywhere else it falls back gracefully to manual entry.
- The anon key is **safe to ship in the browser** — Row Level Security ensures
  users can only ever touch their own data.
