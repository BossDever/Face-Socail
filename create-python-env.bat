@echo off
cd /d D:\FinalProject\Face-Socail\ai-server
echo Creating new Python virtual environment...
python -m venv .venv
call .venv\Scripts\activate.bat
pip install -r requirements.txt
echo Environment setup complete!
pause
