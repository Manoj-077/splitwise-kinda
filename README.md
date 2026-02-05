# splitwise-kinda

Splitwise-like expense sharing web app built with **Angular v15**, JSON Server, and ng2-charts/Chart.js.

## Prerequisites
- Node.js 18+ and npm
- Angular CLI ^15 (`npm i -g @angular/cli@15`)

## Install & Run
```bash
npm install
npm run json-server   # starts mock API at http://localhost:3000
npm start             # serves Angular app at http://localhost:4200 (proxied to /api)
```

### Sample credentials
- alice@example.com / password
- bob@example.com / password
- carol@example.com / password

## Scripts
- `npm start` – `ng serve` with proxy to JSON Server
- `npm run json-server` – start mock backend (`db.json`)
- `npm run build` – production build to `dist/`
- `npm test` – unit tests

## Features
- Mock authentication with route guards
- Groups, expenses, settlements (JSON Server backed)
- Add/Edit/Delete expenses with equal split
- Balance calculation & suggested settlements
- User and group analytics via Chart.js / ng2-charts
- Responsive layout with top/bottom navigation

## Project structure (key folders)
- `src/app/core` – guards, interceptors
- `src/app/shared` – reusable UI components
- `src/app/features` – auth, dashboard, groups, expenses, analytics (lazy-loaded)
- `src/app/services` – API/data/analytics services
- `src/app/models` – TypeScript interfaces
- `db.json` – JSON Server data
