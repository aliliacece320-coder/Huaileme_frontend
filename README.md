# Huaileme · Huaileme Frontend

> Mobile-first fridge and food management app — waste less, worry less.

**Huaileme (huaileme-mobile)** helps users track food at home, use ingredients before they expire, and reduce waste. Built with Vue 3 + Vite, it includes a home risk dashboard, AI scan-to-add, use-up recipes, zero-waste stats, and family accounts.

**[简体中文](README_zh.md)**

---

## Feature Overview

| Module | Description |
|--------|--------------|
| **Home Risk Dashboard** | View food by freshness / near expiry / expired at a glance |
| **AI Scan** | Scan to add ingredients; auto-recognize and add to fridge |
| **Use-Up Recipes** | Recipe suggestions based on current ingredients to clear stock |
| **Zero-Waste Stats** | Track savings and waste trends, encourage sustainable habits |
| **Virtual Fridge** | Manage food by zone with a visual view |
| **Account & Family** | Login/register, family members, sync across devices |


---

## Tech Stack

| Category | Technology | Description |
|----------|------------|-------------|
| Framework | Vue 3 | Composition API + `<script setup>` |
| Build | Vite 5 | Dev server and production build |
| Router | Vue Router 4 | Lazy loading, auth guards |
| State | Pinia | User/login state |
| HTTP | Axios | Wrapped in `src/utils/request.js`, unified interceptors and Token |
| Styles | Tailwind CSS | Utility classes + safe-area support |

---

## Quick Start

### Environment Requirements

- Node.js 16+
- npm or pnpm

### Install and Run

```bash
# After cloning, enter project directory
cd Huaileme_frontend

# Install dependencies
npm install

# Start dev server (default http://localhost:5173)
npm run dev
```

Open **http://localhost:5173** in your browser. To use the backend, start it first (default `http://localhost:3000`); the frontend proxies `/api` to that address.

### Build & Preview

```bash
npm run build    # Production build, output to dist/
npm run preview  # Preview build locally
```

---

## Project Structure

See **[STRUCTURE.md](./STRUCTURE.md)** for the full directory tree and descriptions.

```
src/
├── api/          # API modules (auth, foods, recipes, scan, stats, etc.)
├── views/        # Page components (home, scanner, recipes, settings, etc.)
├── components/   # Shared components (bottom nav NavBar)
├── utils/        # Request wrapper, Toast, helpers
├── router/       # Routes and auth
└── stores/       # Pinia stores (user, family)
```

**API/** in the project root holds backend API docs (Markdown), aligned with `src/api/*.js`.

---

## Routes & Pages

| Path | Page | Description |
|------|------|-------------|
| `/` | Home Risk Dashboard | View food by risk level |
| `/stats` | Zero-Waste Stats | Savings/waste trends and badges |
| `/scanner` | AI Scan | Scan to add ingredients |
| `/recipes` | Use-Up Recipes | Recipe suggestions by ingredients |
| `/fridge` | Virtual Fridge | Manage food by zone |
| `/family` | Account & Family | Login/register, family members |
| `/item/:id` | Food Detail | Operations and editing for a single food item |
| `/settings` | Settings | Notifications, privacy, about us, and other sub-pages |

Bottom nav: Home, Zero-Waste, Scanner, Recipes, Settings. Virtual Fridge and Account & Family are reachable from home or settings.

---

## Environment & API Description

| Item | Description |
|------|-------------|
| Request BaseURL | `/api` (proxied to backend in dev by Vite) |
| Proxy target | Default `http://localhost:3000`; override with `VITE_API_PROXY_TARGET` |
| Response format | `{ code, data, msg }`; success when `code === '000'` |
| Auth | Token in `localStorage` key `huaileme_auth_token`; requests send `Authorization: Bearer <token>` |

For more API definitions, see **API/** (`API_SPEC.md`) and the module docs.

---

## Related Documentation

- **[STRUCTURE.md](./STRUCTURE.md)** — Full project structure description
- **[REPORT.md](./REPORT.md)** — Pre-production audit and fix summary
- **API/** — Backend API docs (`API_SPEC.md`, `API_FOODS.md`, `API_RECIPES.md`, etc.)

---

## License

This project is a private repository for learning and internal use only.
