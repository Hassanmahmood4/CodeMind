# CodeMind – AI Code Review Platform

Full-stack app: paste code, get AI feedback on bugs, security, performance, and readability. **CodeMind** is the product name; use it consistently everywhere.

## Quick start

**macOS / Linux:**
```bash
cd ai-code-reviewer
./start.sh
```
Then open **http://localhost:3000**. Ctrl+C stops both.

**Windows:** run `start.bat` (opens two terminal windows).

## Tech stack

- **Frontend:** Next.js 14, Tailwind, Monaco Editor
- **Backend:** FastAPI, SQLAlchemy (async), JWT
- **AI:** Ollama (default) or OpenAI

## Manual run

**Backend:** `cd backend && source .venv/bin/activate && pip install -r requirements.txt && uvicorn main:app --reload --port 8000`

**Frontend:** `cd frontend && npm install && npm run dev`

## Project structure

```
ai-code-reviewer/
├── .cursor/rules/       # Cursor AI rules (commits, project standards)
├── backend/
│   ├── app/
│   │   ├── core/        # config, security (JWT)
│   │   ├── models/      # User, Review
│   │   ├── routes/      # auth, reviews, deps
│   │   ├── schemas/     # Pydantic request/response
│   │   └── services/    # ai_service (Ollama/OpenAI)
│   ├── main.py
│   └── requirements.txt
├── frontend/
│   ├── app/             # Next.js App Router (pages, layout)
│   ├── components/      # CodemindLogo (CodeMind branding), CodeEditor, AuthProvider
│   ├── lib/             # api client
│   └── public/
│        └── codemind/   # codemind-logo.png (brand asset)
├── start.sh / start.bat
└── README.md
```

## Env

- `backend/.env`: copy from `.env.example`. Set `SECRET_KEY`. For AI: `AI_PROVIDER=ollama` (default) or `openai`; if Ollama, run `ollama pull codellama`.
