# Rynkeby Ride Companion 🚴

A mobile-first web app for Team Rynkeby Finland cyclists riding to Paris.

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser or iPhone.

## Pages

| Path | Description |
|------|-------------|
| `/` | Today's stage — route, times, hotel, SOS button |
| `/sos` | Send a help request with GPS location |
| `/translate` | Phrases in 6 languages with text-to-speech |
| `/support` | Support car dashboard — view and resolve requests |
| `/admin` | Edit stage data (saved to localStorage) |

## Tech Stack

- **Next.js 14** — App Router
- **TypeScript**
- **Tailwind CSS**
- **localStorage** for persistence (no backend needed for prototype)
- **Browser Geolocation API** — SOS GPS
- **Web Speech Synthesis API** — translation text-to-speech

## Supabase Integration (next step)

The `src/lib/data.ts` file uses localStorage — easy to swap for Supabase:

1. `npm install @supabase/supabase-js`
2. Create a `.env.local`:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
   ```
3. Replace `getHelpRequests` / `saveHelpRequests` with Supabase queries
4. Add real-time subscriptions on the Support dashboard

## Demo Cyclist Profile

- **Name**: Demo Rider
- **Team**: Team Rynkeby Finland
- **Emergency Contact**: Support Car 1

## Design

- Dark theme, high contrast, large touch targets
- Barlow Condensed for headings — athletic and legible
- Bottom navigation with 5 tabs
- iPhone Safari tested (safe-area insets, no autoplay issues)
- Team Rynkeby red (#C8102E) and yellow (#FFD700) brand colors
