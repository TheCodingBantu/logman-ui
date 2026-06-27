<p align="center">
  <img src="public/imgs/logman_logo.png" alt="LogMan" width="420" />
</p>

<h1 align="center">LogMan — Frontend</h1>

<p align="center">Stream your server logs in real time, straight from the browser.</p>

<p align="center">
  <img src="https://img.shields.io/badge/vue-3-42b883" alt="Vue 3" />
  <img src="https://img.shields.io/badge/vite-4-646cff" alt="Vite" />
  <img src="https://img.shields.io/badge/tailwindcss-3-38bdf8" alt="Tailwind CSS" />
</p>

---

## Overview

This is the **Vue 3 + Vite** single-page app for LogMan. It authenticates
against the API, lets you manage **sources** and **SSH connections**, and opens
a live WebSocket stream of any source's logs (with ANSI colour rendering,
search, pause and line limits).

The backend lives in the [`logman_backend`](https://github.com/devngugi/logman_backend)
repository — it must be running for the app to work.

## Features

- 🔐 JWT login.
- 📺 Real-time log streaming over WebSockets, with ANSI colour, search and pause.
- 🗂️ Source management shown as cards — normal users see only the title; super
  admins see full details and controls.
- 🔌 SSH connection management with **password or SSH-key** authentication.
- 👑 Role-aware UI: **Connections** and **Users** are visible to super admins only.

## Tech stack

- Vue 3 (`<script setup>`) + Vue Router + Pinia
- Vite build tooling
- Tailwind CSS
- Axios

## Prerequisites

- Node.js 16+ and npm
- A running [LogMan backend](https://github.com/devngugi/logman_backend)

## Getting started

### 1. Install dependencies

```bash
git clone <repo-url> logman-ui
cd logman-ui
npm install
```

### 2. Configure the environment

```bash
cp .env.example .env
```

Only two variables are used by the app:

| Variable | Description | Example |
| --- | --- | --- |
| `VITE_API_ENDPOINT` | REST API base (note the trailing slash) | `http://127.0.0.1:8000/api/v1/` |
| `VITE_WS_ENDPOINT` | WebSocket log endpoint — a full `http(s)`/`ws(s)` URL or a bare path | `http://127.0.0.1:8000/ws/log/` |

`VITE_WS_ENDPOINT` may be a full URL (its scheme is auto-upgraded — `https → wss`,
`http → ws`) or a path like `/ws/log/` (host + scheme are taken from the current
page). Vite inlines env values **at build time**, so re-run the build after any
change.

### 3. Run the dev server

```bash
npm run dev
```

The app is served on Vite's default port (printed in the terminal).

## Build for production

```bash
npm run build      # outputs static files to dist/
npm run preview    # optional: preview the production build locally
```

Serve the contents of `dist/` with any static web server (nginx, etc.) and make
sure it can reach the backend at `VITE_API_ENDPOINT` / `VITE_WS_ENDPOINT`.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server |
| `npm run build` | Build to `dist/` |
| `npm run preview` | Preview the production build |
| `npm run lint` | Lint and auto-fix |
| `npm run format` | Format with Prettier |

## Project structure

```
src/
  views/        # Sources, Connections, Users, Profile, LogView, Login
  components/    # Reusable UI (cards, forms, buttons…)
  stores/        # Pinia stores (auth, darkMode, main)
  services/      # Axios API client
  router/        # Routes + auth/role guards
public/imgs/     # Brand assets (logman_logo.png)
```

## Contributors

- [Charles Swaleh](https://github.com/mashm3ll0w)
- [Philemon Ngugi](https://github.com/phil-ngugi)
