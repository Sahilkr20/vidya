@echo off
echo ========================================================
echo Starting Vidya Setu Django REST API Backend (Port 8000)
echo Connected to MySQL Server: vidyasetu_db on 127.0.0.1:3306
echo ========================================================
cd backend
"C:\Users\sahil\AppData\Local\Programs\Python\Python312\python.exe" manage.py runserver 127.0.0.1:8000
