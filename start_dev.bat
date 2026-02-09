@echo off
echo Starting GAZE Web Godot Editor...

echo Installing Backend Dependencies...
cd backend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Backend npm install failed!
    pause
    exit /b %errorlevel%
)
start "GAZE Backend" cmd /k "npm run dev"
cd ..

echo Installing Frontend Dependencies...
cd frontend
call npm install
if %errorlevel% neq 0 (
    echo [ERROR] Frontend npm install failed!
    pause
    exit /b %errorlevel%
)
start "GAZE Frontend" cmd /k "npm run dev"
cd ..

echo GAZE is running!
echo Backend: http://localhost:3000
echo Frontend: http://localhost:5173
echo.
echo If windows close immediately, there is an error.
echo Check the new windows for error messages.
pause
