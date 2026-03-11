# How to Run

## One command (recommended)

**macOS / Linux:**
```bash
cd ai-code-reviewer
./start.sh
```
Open **http://localhost:3000**. Press Ctrl+C to stop.

**Windows:** Double-click `start.bat` or run it from cmd. Two windows open (backend + frontend). Open http://localhost:3000.

## Manual (two terminals)

**Terminal 1 – Backend**
```bash
cd ai-code-reviewer/backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

**Terminal 2 – Frontend**
```bash
cd ai-code-reviewer/frontend
npm install
npm run dev
```

Then open http://localhost:3000. Sign up, log in, and use **New review** to paste code and run AI review.

## Ollama (optional)

For real local AI: install [Ollama](https://ollama.com), then `ollama pull codellama`. Backend uses it by default.
