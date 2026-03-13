# CodeMind

AI-powered code reviewer that analyzes code and suggests improvements.

## Stack

- **Frontend:** React + Vite, TailwindCSS, React Markdown, rehype-highlight
- **Backend:** Node.js, Express
- **Auth:** Clerk Authentication
- **AI:** Gemini API
- **Database:** Supabase (optional, for conversation history)

## Setup

### 1. Environment

Copy the example env and fill in your keys:

```bash
cp .env.example .env
```

Edit `.env` and set:

- `GEMINI_API_KEY` – from [Google AI Studio](https://aistudio.google.com/)
- `SUPABASE_URL` and `SUPABASE_ANON_KEY` – from [Supabase](https://supabase.com/) project settings
- `CLERK_SECRET_KEY` – from [Clerk](https://clerk.com/) dashboard (Backend API)

For the frontend, create `codemind/frontend/.env` with:

- `VITE_CLERK_PUBLISHABLE_KEY` – from Clerk (Frontend API)
- `VITE_API_URL` – optional, defaults to `http://localhost:5000`

### 2. Supabase

Create two tables (Supabase SQL editor):

```sql
-- Optional: users table
create table if not exists users (
  id uuid default gen_random_uuid() primary key,
  clerk_id text unique not null,
  created_at timestamptz default now()
);

-- Conversations (chat messages)
create table if not exists conversations (
  id uuid default gen_random_uuid() primary key,
  user_id text not null,
  role text not null,
  content text not null,
  created_at timestamptz default now()
);

-- RLS: allow service to insert (backend uses anon key or service role)
alter table conversations enable row level security;
create policy "Allow insert for authenticated" on conversations
  for insert with check (true);
create policy "Allow select own" on conversations
  for select using (auth.uid()::text = user_id or true);
```

Adjust RLS policies to match your auth (e.g. map Clerk `user_id` to a Supabase user if you use Supabase Auth).

### 3. Backend

```bash
cd codemind/backend
npm install
npm run dev
```

Server runs at **http://localhost:5000**.

### 4. Frontend

```bash
cd codemind/frontend
npm install
npm run dev
```

App runs at **http://localhost:5173**.

## Scripts

| Location   | Command      | Description        |
|----------|---------------|--------------------|
| backend  | `npm run dev` | Nodemon on port 5000 |
| backend  | `npm start`  | Production start   |
| frontend | `npm run dev` | Vite dev server (5173) |
| frontend | `npm run build` | Production build |

## Project structure

```
project-root/
├── codemind/
│   ├── frontend/           # React + Vite
│   │   ├── src/
│   │   │   ├── components
│   │   │   ├── pages
│   │   │   ├── hooks
│   │   │   └── main.jsx
│   │   ├── package.json
│   │   └── vite.config.js
│   └── backend/            # Express API
│       ├── routes
│       ├── config
│       ├── middleware
│       ├── server.js
│       └── package.json
├── RUN.md                  # Detailed run & troubleshooting
├── .env.example
├── .gitignore
└── README.md
```

For step-by-step run instructions and troubleshooting (Clerk keys, ports, token issues), see **RUN.md**.
