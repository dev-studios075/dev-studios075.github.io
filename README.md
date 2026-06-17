# ClairTrack

AI-powered dispatch & fleet management system helping shippers and transporters cut costs, boost efficiency, and scale logistics with full visibility.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS
- shadcn/ui

## Development

Requires Node.js & npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

```sh
npm install
npm run dev
```

Dev server runs at `http://localhost:8080`.

## Analytics & SEO

Copy `.env.example` to `.env` and set:

```sh
VITE_SITE_URL=https://www.fleetcodes.com
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

`VITE_GA_MEASUREMENT_ID` enables Google Analytics 4 tracking. `VITE_SITE_URL` is used for canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml`.

For GitHub Pages deployments, add these as repository variables in GitHub:

- `VITE_SITE_URL`
- `VITE_GA_MEASUREMENT_ID`

## Build

```sh
npm run build
```

Output goes to `dist/`. Static HTML is generated for `/blog` and each blog article, and a `404.html` is created for GitHub Pages SPA support.

## Deployment

The site is deployed to GitHub Pages via a GitHub Actions workflow that triggers when a version tag is pushed:

```sh
git tag v1.0.0
git push origin v1.0.0
```

The workflow builds the project and deploys `dist/` to GitHub Pages.
