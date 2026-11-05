# ЛР-2. Компоненти, дерево компонентів і пропси

Стартовий проєкт лабораторної роботи № 2 курсу «Розробка вебзастосунків на
React»: сторінка «Команда проєкту». Інструкція:
https://denysmatsevych.github.io/web-development-2026/react/labs/lab-2/

У проєкті вже є налаштування ESLint і Prettier з ЛР-1, стилі сторінки
(`src/index.css`), дані команди (`src/data.js`) і аватари
(`public/avatars/`). Компоненти ви пишете самі, у теці `src/components/`.

## Команди

`npm install` виконуйте в корені репозиторію `react-labs`, решту — у теці
`lab-2/`:

- `npm run dev`: dev-сервер на http://localhost:5173
- `npm run lint`: ESLint
- `npm run format:check`: перевірка форматування Prettier
- `npm run build`: production-збірка в `dist/`

## Дерево рендерингу

За вкладкою **Components ⚛** у React DevTools (§4.6).

```text
App
├── Header
├── Card «Тімлід»
│   └── Avatar          size={120}
└── Card «Команда»
    ├── Profile         key=1
    │   ├── Avatar
    │   └── Badge       «Тімлідка» (лише для isLead)
    ├── Profile         key=2
    │   └── Avatar
    ├── Profile         key=3
    │   └── Avatar
    └── Profile         key=4
        └── Avatar
```

## Дерево залежностей модулів

За рядками `import` у файлах `src/` (§4.6). Пакети `react` і `react-dom`
не показано. `Avatar.jsx` імпортують два модулі, тому він стоїть під
кожним із них.

```text
main.jsx
├── index.css
└── App.jsx
    ├── components/Header.jsx
    ├── components/Avatar.jsx
    ├── components/Profile.jsx
    │   ├── components/Avatar.jsx
    │   └── components/Badge.jsx
    ├── components/Card.jsx
    └── data.js
```
