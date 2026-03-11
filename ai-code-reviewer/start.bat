@echo off
cd /d "%~dp0"
echo === Backend ===
cd backend
if not exist .venv python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt -q
if not exist .env copy .env.example .env
start "Backend" cmd /k "cd /d %cd% && .venv\Scripts\activate && uvicorn main:app --reload --host 0.0.0.0 --port 8000"
cd ..
echo === Frontend ===
cd frontend
if not exist node_modules npm install
start "Frontend" cmd /k "cd /d %cd% && npm run dev"
cd ..
echo Open http://localhost:3000
pause
