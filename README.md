# Fleetcodes Website

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

`VITE_GA_MEASUREMENT_ID` places Google's tag immediately after `<head>` on the built site. Analytics storage stays off until the visitor accepts it. `VITE_SITE_URL` is used for canonical URLs, Open Graph URLs, `robots.txt`, and `sitemap.xml`.

For GitHub Pages deployments, add these as repository variables in GitHub:

- `VITE_SITE_URL`
- `VITE_GA_MEASUREMENT_ID`

## Build

```sh
npm run build
```

Output goes to `dist/`. Static HTML is generated for `/blog` and each English blog article. Each `/hi/blog/{slug}` page is prerendered Hindi chrome: the article body stays English, the canonical points at the English URL, and the page is `noindex`. A `404.html` is created for GitHub Pages SPA support.

## Publishing Blog Posts

After adding a new markdown file in `src/content/blog` and its cover image in `public/uploads`, run:

```sh
npm run blog:prepare
npm run build
```

`blog:prepare` optimizes PNG blog cover images to lighter JPG files, updates the blog frontmatter, and reports any remaining oversized upload images. It also rejects a cover that is not exactly 1200×800.

### Cover layout

Generate every new cover to match `public/uploads/blog93.jpg`. Cards crop the image with `object-cover` at 16/10, which hides about 25px at the top and 25px at the bottom of a 1200×800 file.

- Canvas: exactly 1200×800 px (3:2). A 1200×675 / 16:9 file gets cropped on the sides and clips the title.
- Logo: Fleetcodes mark and wordmark, top left, about x=42, y=43, 246×113 px.
- Label: `FLEETCODES INSIGHTS` directly under the logo.
- Title: dark, left-aligned with the logo, first line near y=184, kept on the left half. The person and the yard stay on the right.
- Keep the logo and title inside y=25 to y=775 so the card crop does not cut them.
- Do not letterbox a shorter image onto the canvas (that pushes the logo down) and do not zoom the photo to fill 1200×800 (that enlarges the subject and cuts the scene).
- The category pill, date, and reading time are HTML. Leave them out of the image.

## Deployment

Pull requests run CI: lint, typecheck, and build. The site is deployed to GitHub Pages via a GitHub Actions workflow that triggers when a `release-main-*` tag is pushed:

```sh
git tag release-main-2026-06-19
git push origin release-main-2026-06-19
```

The workflow builds the project and deploys `dist/` to GitHub Pages.
