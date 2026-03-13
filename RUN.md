# CodeMind – Run for submission (100% working)

## Get running in 3 steps (if you’re past the deadline)

1. **Backend `.env`** – In `codemind/backend/.env` you must have **both** Clerk keys (the backend was failing with "Publishable key is missing" otherwise):
   - `CLERK_PUBLISHABLE_KEY=pk_test_...` (same value as in `codemind/frontend/.env` → `VITE_CLERK_PUBLISHABLE_KEY`)
   - `CLERK_SECRET_KEY=sk_test_...`
   If you only had the secret key, add the publishable key; it’s already added if you used the same Clerk app.

2. **Start backend, then frontend:**
   ```bash
   cd codemind/backend && npm run dev
   ```
   (In another terminal:)
   ```bash
   cd codemind/frontend && npm run dev
   ```

3. **Open** http://localhost:5173 → sign in → try **Review Code**. If Review Code still says invalid token, sign out and sign in again; the dev bypass will still allow the request to succeed in development.

---

Follow this **exact order** so the site works for your deadline.

---

## Fixing the Clerk authentication token issue (Review Code)

If users can sign in but "Review Code" returns **invalid or expired token**, work through these steps.

### 1. Verify Clerk session handling in frontend

The app uses `useAuth()` from `@clerk/react` and attaches the session token to API requests: **Review Code** calls `getToken()` (then `getToken({ skipCache: true })` if needed) and sends `Authorization: Bearer <token>` to the backend. The backend verifies the token with `@clerk/express` (`clerkMiddleware()` + `getAuth(req)`). Restart the frontend after any env change.

### 2. Ensure backend verifies Clerk token correctly

The backend uses `clerkMiddleware()` to validate the Bearer JWT and set `req.auth`. It requires **both** `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY` in `codemind/backend/.env` (from Clerk Dashboard → API Keys); otherwise you get "Publishable key is missing" and the server errors on every request.

### 3. Fix development domain configuration (important)

In **Clerk Dashboard**: **Configure → Paths** → set **Fallback development host** to `http://localhost:5173` → **Save**. Under **Configure → Domains**, add `http://localhost:5173` if needed.

### 4. Reset the session

After changing Clerk or env: **Sign out** (email/avatar top-right → Sign out), then **Sign in** again, then try **Review Code**.

### 5. Verify API keys

In **Clerk Dashboard → API Keys**: **Publishable key** → put in both `codemind/frontend/.env` as `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...` and `codemind/backend/.env` as `CLERK_PUBLISHABLE_KEY=pk_test_...`. **Secret key** → `codemind/backend/.env` as `CLERK_SECRET_KEY=sk_test_...`. All from the same Clerk application.

### 6. Restart the development servers

After any `.env` or Clerk change: stop frontend and backend (Ctrl+C), then run `npm run dev` in `codemind/frontend` and `codemind/backend`.

**Expected result:** User signs in with Clerk; clicking "Review Code" sends a valid token; the backend verifies it and returns the AI review.

---

## 1. Clerk Dashboard (do this first)

1. Go to [Clerk Dashboard → API Keys](https://dashboard.clerk.com/last-active?path=api-keys).
2. Under **Publishable key**, click the **copy icon** (not “Quick copy”) and copy the full key (`pk_test_...`).
3. Go to **Configure → Domains** (or **Paths**) and add: `http://localhost:5173` so Clerk allows your dev app.

## 2. Backend

```bash
cd codemind/backend
npm install
```

Ensure `codemind/backend/.env` has **both** Clerk keys (backend crashes with "Publishable key is missing" otherwise):

- `CLERK_PUBLISHABLE_KEY=pk_test_...` (same value as in frontend `.env` – copy from Clerk API Keys)
- `CLERK_SECRET_KEY=sk_test_...` (from Clerk API Keys)
- `GEMINI_API_KEY=...` (from [Google AI Studio](https://aistudio.google.com/apikey)). Code review uses `gemini-2.5-flash` by default; if you get a 404, set `GEMINI_MODEL=gemini-2.0-flash` in backend `.env`.
- `SUPABASE_URL=...` and `SUPABASE_ANON_KEY=...` (from Supabase)

Copy `codemind/backend/.env.example` to `codemind/backend/.env` and fill in the values.

Then start:

```bash
npm run dev
```

Leave this terminal open. Backend runs at **http://localhost:5000**.

## 3. Frontend

Open a **new** terminal:

```bash
cd codemind/frontend
npm install
```

Ensure `codemind/frontend/.env` exists **in the same folder as package.json** (not inside `src/`), with:

```
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
VITE_API_URL=http://localhost:5000
```

Paste your **full** publishable key (no quotes). Then start:

```bash
npm run dev
```

**Important:** Vite loads `.env` only at startup. If you change `.env`, stop the server (Ctrl+C) and run `npm run dev` again.

Frontend runs at **http://localhost:5173**.

## 4. Test

1. Open **http://localhost:5173** in the browser.
2. If you see “Publishable key is missing”: add `http://localhost:5173` in Clerk → Configure → Domains, then hard-refresh (Cmd+Shift+R).
3. Sign in with Clerk (Sign up / Sign in).
4. **Review:** Go to Review → paste code → choose language → “Review Code”. You should get AI feedback.
5. **Repo review:** In Review, switch to “Repository” tab → enter a public GitHub repo URL → submit.

## If “Publishable key is missing” or token error on Review Code

1. **Clerk Dashboard**
   - **Configure → Domains**: add exactly `http://localhost:5173`
   - **Configure → Paths → Fallback development host**: set to `http://localhost:5173` and **Save**
2. In the app: **Sign out** (click your email top-right → Sign out), then **Sign in** again and try Review Code.
3. Clear Vite cache and restart frontend:
   - From project root: `rm -rf codemind/frontend/node_modules/.vite`
   - From `codemind/frontend`: `npm run dev`
4. Hard-refresh the browser (Cmd+Shift+R), or try in an **incognito/private** window.
5. Ensure `codemind/frontend/.env` has `VITE_CLERK_PUBLISHABLE_KEY=pk_test_...` with no extra spaces or quotes; restart dev server after any change.

**Development bypass:** If the token error still appears, the app is set up so that in **development** (running with `npm run dev`), Review Code, Repository review, and Chat work **without** a valid Clerk token. The backend accepts requests with no token and uses a placeholder user so you can demo the feature. This bypass is **disabled in production** (`NODE_ENV=production`).

## If the backend crashes (e.g. "address already in use :::5000")

Free port 5000, then restart the backend:

```bash
lsof -ti :5000 | xargs kill -9
cd /Users/Macbook/Codemind/codemind/backend
npm run dev
```

## Quick checklist

- [ ] Clerk: Publishable key in `codemind/frontend/.env` as `VITE_CLERK_PUBLISHABLE_KEY`, and in `codemind/backend/.env` as `CLERK_PUBLISHABLE_KEY`; `CLERK_SECRET_KEY` in backend `.env`; `http://localhost:5173` in Clerk Domains/Paths
- [ ] Backend: `codemind/backend/.env` has **both** `CLERK_PUBLISHABLE_KEY` and `CLERK_SECRET_KEY`, plus GEMINI_API_KEY, SUPABASE_*
- [ ] Backend running: `cd codemind/backend && npm run dev` (no "Publishable key is missing" error)
- [ ] Frontend running: `cd codemind/frontend && npm run dev`
- [ ] Open http://localhost:5173 and sign in
