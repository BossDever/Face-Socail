@echo off
echo Starting FaceSocial Development Environment...

REM Start Backend in a new window
start "Backend" cmd /c "cd /d D:\FinalProject\Face-Socail\backend && npm run dev"

REM Start AI Server in a new window
start "AI Server" cmd /c "cd /d D:\FinalProject\Face-Socail\ai-server && python simple-app.py"

REM Start Frontend in a new window
start "Frontend" cmd /c "cd /d D:\FinalProject\Face-Socail\frontend && npm run dev"

echo All services started!
echo Backend: http://localhost:3001
echo AI Server: http://localhost:3002
echo Frontend: http://localhost:3000
