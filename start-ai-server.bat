@echo off
cd /d D:\FinalProject\Face-Socail\ai-server
if not exist venv (
  echo Creating new virtual environment...
  python -m venv venv
)
call venv\Scripts\activate.bat
pip install -r requirements.txt
python app.py
