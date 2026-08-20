# EventHub

EventHub is an event ticketing application where visitors can browse published events, view ticket tiers, create bookings, and manage tickets in their wallet. Organizers can create and manage events from the dashboard.

## Stack

- React 18 and TypeScript
- Vite and Tailwind CSS
- Zustand for client state
- Supabase Database and Auth
- Optional Flask API in `api/`

## Requirements

- Node.js 18 or newer
- npm
- Python 3.10 or newer for the optional Flask API
- A Supabase project

## Frontend setup

Install dependencies from the project root:

```bash
npm install
```

The Supabase project URL and anonymous key are configured in `src/lib/supabase.ts`. Update them with the values from Supabase Dashboard -> Project Settings -> API before running the application.

Start the development server:

```bash
npm run dev
```

Vite prints the local URL in the terminal. The application includes routes for the home page, event catalog, event details, login, wallet, and organizer dashboard.

## Supabase setup

The SQL migrations in `supabase/migrations/` create the events, ticket tiers, bookings, and attendees tables, seed sample data, configure RLS, and add atomic booking operations.

Apply the migrations to your Supabase project in filename order using the Supabase SQL Editor or the Supabase CLI. The duplicate diagnostic migration `003_add_tiers.sql` was removed; apply `003_ticket_tiers.sql` as migration `003`.

After the migrations are applied, create the demo Auth user through the Auth API. Auth users must not be inserted directly into `auth.users`:

```powershell
Copy-Item api\.env.example api\.env
# Edit api\.env with your Supabase URL, service-role key, and demo password
Push-Location api
python -m pip install -r requirements.txt
python create_demo_user.py
Pop-Location
```

The script creates or finds the demo user and replaces the seeded `demo-organizer` placeholder IDs with that user's real Auth UUID. Keep `SUPABASE_SERVICE_ROLE_KEY` server-side. Never add it to frontend code or commit `api/.env`.

## Optional Flask API

Install the API dependencies and run the development server:

```powershell
Push-Location api
python -m pip install -r requirements.txt
python app.py
Pop-Location
```

The API listens on `http://localhost:5000` and exposes `/api/health`, event, ticket-tier, booking, attendee, and analytics endpoints. Set `SUPABASE_URL` and `SUPABASE_KEY` in the API environment before using it.

## Project checks

```bash
npm run check   # TypeScript validation
npm run lint    # ESLint
npm run build   # Production build
```

Python files can be compiled with:

```bash
python -m py_compile api/app.py api/create_demo_user.py
```

## Security notes

- The frontend may use only the Supabase anonymous key.
- The service-role key is required only by the demo-user bootstrap script and must remain private.
- Apply the RLS migrations before using real data.
- Booking and cancellation inventory changes run through database-side transactional functions.
