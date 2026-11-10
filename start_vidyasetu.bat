@echo off
echo ========================================================
echo Launching Vidya Setu Full Stack Platform
echo Backend:  http://127.0.0.1:8000
echo Frontend: http://localhost:5173
echo ========================================================
start "Vidya Setu Django Backend" cmd /k "run_backend.bat"
start "Vidya Setu React Frontend" cmd /k "run_frontend.bat"
echo Both servers started! Open http://localhost:5173 in your browser.
