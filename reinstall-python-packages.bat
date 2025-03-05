@echo off
cd /d D:\FinalProject\Face-Socail\ai-server
echo Reinstalling Python packages...
pip install --force-reinstall flask==2.3.3 flask-cors==4.0.0 python-dotenv==1.0.0 mtcnn
echo Done!
pause
