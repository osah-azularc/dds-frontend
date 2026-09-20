# Ecourt Frontend

React + Vite | Migrated from Create React App

This project powers the ecourt frontend for the OSAH platform.  
Originally built with Create React App (CRA), the entire project has now been upgraded to **Vite** for dramatically faster development and optimized production builds.

---

## ⚡ Why Vite?

Vite provides:

- Near-instant dev server startup
- Fast HMR (Hot Module Replacement)

- Smaller & optimized production bundles
- Cleaner build tooling (esbuild + rollup)
- Simpler and more maintainable project structure

---

## 🚀 Getting Started

### 1️⃣ Install dependencies

```bash
npm install
```

### 2️⃣ Setup environment variables

Copy the example environment file:

```bash
cp .env.example .env.local
```

Example `.env.example`:

```
VITE_API_URL=http://localhost:9001
VITE_WS_URL=ws://localhost:9001/ws/
VITE_MUI_PRO=your-mui-pro-license-key-here
```

Vite automatically loads `.env`, `.env.local`, `.env.development`, `.env.production`, etc.

---

## ▶️ Available Commands

### Start development server

```bash
npm run dev
```

Runs at:

```
http://localhost:5173/
```

---

### Build for production

```bash
npm run build
```

Outputs the optimized production build into:

```
/dist
```

---

### Preview the production build

```bash
npm run preview
```

---

## 📁 Project Structure

```
eportal-frontend/
├── src/
│   ├── components/
│   ├── utilities/
│   ├── hooks/
│   ├── styles/
│   ├── App.jsx
│   └── main.jsx
├── index.html
├── vite.config.js
├── .env.example
└── package.json
```

---

## 🔑 Key Differences from CRA

- No `/public` directory
- Entry point changed: `src/index.js` → `src/main.jsx`
- `index.html` is now in project root (not processed by webpack)
- Environment variables now use the `VITE_` prefix
- Webpack tooling fully removed

---

## 🔧 Environment Variables

Access variables through `import.meta.env`.

Example:

```js
const apiUrl = import.meta.env.VITE_API_URL;
const wsUrl = import.meta.env.VITE_WS_URL;
```

Rules:

- Must start with `VITE_`
- Exposed only in the browser
- Node-side configuration uses `process.env`

---

## 🔌 API & WebSocket Proxy (Development)

Vite dev server proxy (inside `vite.config.js`):

```js
server: {
  proxy: {
    '/api': {
      target: env.VITE_API_URL,
      changeOrigin: true
    },
    '/ws': {
      target: env.VITE_WS_URL,
      ws: true,
      changeOrigin: true
    }
  }
}
```

This allows:

- No CORS issues
- Seamless API + WebSocket routing
- Flexible environment configuration

---

## 🗑️ Legacy Files Removed

Migrating from CRA removed:

- `config/webpack.config.js`
- `config/webpackDevServer.config.js`
- `config/modules.js`
- `config/paths.js`
- `babel.config.js`
- `/public` directory
- All CRA / webpack tooling

These are unused in Vite and intentionally removed.

---

## 🔄 Migration Notes (CRA → Vite)

Changes made:

- All React files renamed `.js` → `.jsx`
- Environment variables updated to `VITE_*`
- Entry point changed to `src/main.jsx`
- `index.html` moved to root
- CRA build system removed
- New Vite dev + build scripts added
- Proxy configuration added for API + WebSocket support

---

## 🧪 Testing the Build

Before deploying, verify:

- `npm install` runs clean
- `npm run dev` starts with no errors
- `npm run build` generates `/dist`
- `npm run preview` works
- API requests function correctly
- WebSocket connections establish
- Environment variables are loaded
- No console errors
- All existing app features continue to work

---

## 📦 Deployment

Deploy the `/dist` folder to your hosting environment.

### Example NGINX configuration

```nginx
location / {
  try_files $uri $uri/ /index.html;
}
```

This ensures SPA routing works correctly.

---

## 🛠 Troubleshooting

### Environment variables not loading?

Check:

- All keys start with `VITE_`
- File is named `.env.local` or `.env.*`
- Values do not contain extra quotes

---

### Proxy not working?

Ensure:

- Backend is running
- `.env.local` has correct URLs
- No trailing slash mismatch

---

## 📄 License

Internal project — not for public distribution.

###
