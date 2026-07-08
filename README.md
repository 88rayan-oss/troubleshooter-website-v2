# Troubleshooter Website

React + Vite build of the Troubleshooter marketing site.

## Run locally

```
npm install
npm run dev
```

Opens at http://localhost:5173

## Build for production

```
npm run build
```

Outputs static files to `dist/` — ready to deploy anywhere that serves static files.

## Deploying to Vercel

This project includes `vercel.json` with build settings pre-configured.
Push to GitHub, then import the repo at vercel.com/new — Vercel auto-detects
the Vite framework and deploys with zero additional configuration.

## Logo

The logo lives at `src/assets/logo.png`. It's currently the processed white
Troubleshooter wordmark. Replace this file with your final logo (same filename)
and rebuild — no code changes needed.

## Formspree

The audit request form posts to Formspree. Open `src/TroubleshooterSite.jsx`,
search for `YOUR_FORM_ID`, and replace it with your real Formspree form ID
after signing up at formspree.io.

## Project structure

```
ts-website/
├── index.html              fonts + meta tags
├── src/
│   ├── main.jsx             mounts the site, wires in the logo
│   ├── TroubleshooterSite.jsx   the full site component
│   └── assets/
│       └── logo.png         swap this file to change the logo
├── public/
│   └── favicon.png          replace with your own favicon
└── vite.config.js
```
