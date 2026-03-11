#!/usr/bin/env bash
# Run backend + frontend from one script. Ctrl+C stops both.

set -e
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

BACKEND_PID=""
FRONTEND_PID=""
cleanup() {
  echo ""
  [ -n "$BACKEND_PID" ] && kill "$BACKEND_PID" 2>/dev/null || true
  [ -n "$FRONTEND_PID" ] && kill "$FRONTEND_PID" 2>/dev/null || true
  exit 0
}
trap cleanup INT TERM

cd "$ROOT/backend"
if [ ! -d .venv ]; then
  python3 -m venv .venv
fi
source .venv/bin/activate
pip install -r requirements.txt -q
[ -f .env ] || cp .env.example .env
uvicorn main:app --reload --host 0.0.0.0 --port 8000 &>/dev/null &
BACKEND_PID=$!
cd "$ROOT"

cd "$ROOT/frontend"
if [ ! -d node_modules ]; then
  npm install &>/dev/null
fi

echo "http://localhost:3000"
npm run dev &>/dev/null &
FRONTEND_PID=$!
wait $FRONTEND_PID 2>/dev/null || true
