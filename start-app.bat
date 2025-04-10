@echo off
echo Запуск приложения...

start "LavrGraph Server" cmd /c "cd server && npm run dev"

timeout /t 2 > nul

start "LavrGraph Client" cmd /c "npm start"

echo Оба сервера и клиент запущены.
echo Закройте окна или нажмите Ctrl+C в каждом окне для остановки приложения. 