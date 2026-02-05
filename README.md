# splitwise-kinda

Splitwise-like expense sharing web app built with Angular v15, JSON Server, ng2-charts/Chart.js.

## Prerequisites
- Node.js 18+ and npm
- Angular CLI ^15 (install globally: `npm i -g @angular/cli@15`)

## Install
```bash
npm install
```

## Local API (JSON Server)
Start the mock backend on port 3000 (uses `db.json`):
```bash
npm run json-server
```

## Run the app (dev)
In another terminal:
```bash
npm start
```
App runs at http://localhost:4200 and will proxy API calls to http://localhost:3000 (configure `environment.ts` if needed).

## Build (prod)
```bash
npm run build
```
Output is in `dist/`.

## Lint & Tests
```bash
npm run lint
npm test
```
(Configure tests as needed.)

## Project structure (key folders)
- `src/app/core` – guards, interceptors
- `src/app/shared` – reusable components/pipes
- `src/app/features` – auth, dashboard, groups, expenses, analytics (lazy-loaded modules)
- `src/app/services` – API/data services
- `src/app/models` – TypeScript interfaces
- `db.json` – JSON Server data

## Notes
- Uses Angular v15 features (no v16+ signals/control flow).
- Charts via ng2-charts/Chart.js.
- Auth is mock; adapt JSON Server middleware for real tokens if needed.

## Common scripts
- `npm start` – serve Angular app (port 4200)
- `npm run json-server` – start mock API (port 3000)
- `npm run build` – production build
- `npm run lint` – lint
