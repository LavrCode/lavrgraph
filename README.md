# LavrGraph

Редактор по аналогу Telegra.ph, но с более приятным стилем.

## Предварительные требования

- Node.js (рекомендуется v16 или выше)
- npm (рекомендуется v7 или выше)
- База данных MySQL

## Установка

### Клонирование репозитория

```bash
git clone https://github.com/LavrCode/lavrgraph
cd lavrgraph
```

### Настройка фронтенда

1. Установка зависимостей:
   ```bash
   npm install
   ```

2. Создание файла окружения:
   ```bash
   cp .env.example .env
   ```

3. При необходимости отредактируйте файл `.env` (по умолчанию он указывает на `http://localhost:5000/api`)

### Настройка бэкенда

1. Перейдите в директорию сервера и установите зависимости:
   ```bash
   cd server
   npm install
   ```

2. Создайте файл окружения:
   ```bash
   cp .env.example .env
   ```

3. Настройте файл `.env` с вашими учетными данными для MySQL:
   ```
   DB_HOST=localhost
   DB_USER=ваш_пользователь
   DB_PASSWORD=ваш_пароль
   DB_NAME=имя_вашей_базы_данных
   DB_PORT=3306
   PORT=5000
   ```

4. Убедитесь, что ваша база данных MySQL запущена и вы создали базу данных, указанную в вашем файле `.env`.

## Запуск приложения

### Windows

Запустите включенный batch-скрипт:
```bash
start-app.bat
```

### Linux/Mac

Сделайте shell-скрипт исполняемым и запустите его:
```bash
chmod +x start-app.sh
./start-app.sh
```

### Запуск вручную

Если вы предпочитаете запускать сервисы вручную:

1. Запустите сервер бэкенда:
   ```bash
   cd server
   npm run dev
   ```

2. В отдельном терминале запустите фронтенд:
   ```bash
   npm start
   ```

Фронтенд будет доступен по адресу http://localhost:3000, а API бэкенда по адресу http://localhost:5000/api.

## Сборка для продакшена

### Сборка бэкенда
```bash
cd server
npm run build
```

### Сборка фронтенда
```bash
npm run build
```

Артефакты сборки будут храниться в директории `build/`.

## Структура проекта

- `src/` - Frontend-приложение на React
- `server/` - Backend-API на Express
- `server/src/routes/` - API-маршруты
- `server/src/models/` - Модели базы данных

## Автор

- Разработано с ❤️ [https://lavrcode.t.me/][LavrCode]

## Лицензия

MIT