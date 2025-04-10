#!/bin/bash

echo "Запуск приложения..."

cleanup() {
    echo "Остановка всех процессов..."
    kill $SERVER_PID $CLIENT_PID 2>/dev/null
    exit 0
}

trap cleanup SIGINT SIGTERM

cd server && npm run dev &
SERVER_PID=$!
echo "Сервер запущен с PID: $SERVER_PID"

sleep 2

cd ..
npm start &
CLIENT_PID=$!
echo "Клиент запущен с PID: $CLIENT_PID"

echo "Оба сервера и клиент запущены."
echo "Нажмите Ctrl+C для остановки обоих процессов."

wait $SERVER_PID $CLIENT_PID 