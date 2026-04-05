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

## Build

```sh
npm run build
```

Output goes to `dist/`. A `404.html` is automatically created for GitHub Pages SPA support.

## Deployment

The site is deployed to GitHub Pages via a GitHub Actions workflow that triggers when a version tag is pushed:

```sh
git tag v1.0.0
git push origin v1.0.0
```

The workflow builds the project and deploys `dist/` to GitHub Pages.
