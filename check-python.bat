@echo off
echo Python version and location:
where python
python --version

echo.
echo Checking Flask installation:
python -c "import sys; print(sys.path)"
python -c "import flask; print(f'Flask is installed at: {flask.__file__}')" 2>nul
if %errorlevel% neq 0 echo Flask installation not found in current Python path!

echo.
echo Installing Flask directly:
python -m pip install flask flask-cors python-dotenv

pause
