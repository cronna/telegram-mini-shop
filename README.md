### Telegram Mini Shop — демо мини‑приложение магазина

- **Фронтенд**: Vite + React + TypeScript + TailwindCSS
- **Бэкенд**: Node.js + Express + Prisma (SQLite)
- **Фичи**: каталог, поиск/фильтры, карточка товара, корзина, оформление заказа, профиль/история заказов, проверка Telegram WebApp initData, демо‑оплата (опционально через Telegram Invoices)

#### Запуск локально
1. Backend
   - `cd backend`
   - `npm i`
   - `cp .env.example .env`
   - `npm run prisma:generate`
   - `npm run prisma:migrate`
   - `npm run prisma:seed`
   - `npm run dev`
2. Frontend
   - `cd frontend`
   - `npm i`
   - `npm run dev`

Фронтенд: `http://localhost:5173`. API: `http://localhost:4000/api`.

В браузере без Telegram WebApp включён демо‑режим.

### Деплой как Telegram Mini App (без затрат)

1) GitHub Pages для фронтенда
- Создай репозиторий и запушь код в ветку `main`.
- В репозитории: Settings → Pages → Build and deployment → Source: GitHub Actions.
- Задай переменную репозитория `VITE_API_URL` в Settings → Actions → Variables (URL API после деплоя backend).
- По желанию, задай `VITE_BASE=/<repo>/` если используешь Pages в формате `https://<user>.github.io/<repo>`.
- Workflow `.github/workflows/deploy-frontend.yml` автоматически соберёт и задеплоит фронт. Адрес: `https://<user>.github.io/<repo>`.

2) Render (free) для backend
- Импортируй репозиторий на Render → New Web Service → укажи `rootDir: backend`.
- В переменных окружения Render задай: `DATABASE_URL=file:./dev.db`, `ORIGIN=https://<user>.github.io/<repo>`, `WEBAPP_URL=https://<user>.github.io/<repo>`, (опционально оплаты), `NODE_VERSION=20`, `NODE_ENV=production`.
- После билда получишь публичный API, например `https://mini-backend.onrender.com`. Эту ссылку вставь в `VITE_API_URL` переменную GitHub.

3) Настройка бота
- В @BotFather: Menu Button → Web App:
  - Title: Mini Shop
  - URL: `https://<user>.github.io/<repo>/shop`
- В backend переменных `WEBAPP_URL` укажи тот же адрес.
- Бот готов открывать Mini App.
