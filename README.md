# Concrete Toronto (concrete-toronto.ca)

Static Astro site for Concrete Toronto, a Toronto concrete contractor (driveways,
patios, walkways, sidewalks, porches, steps, foundations, slabs, repair,
replacement, parging) serving Toronto and the GTA.

## Build

```sh
npm ci
npm run build
```

The build outputs to `docs/`, which is committed on purpose: GitHub Pages serves
the site from `docs/` on the `main` branch (custom domain via `docs/CNAME`).
`docs/` is intentionally not in `.gitignore`.

## Notes

- No analytics / GTM on this site.
- The quote form posts to an n8n webhook
  (`https://n8n.londonseopro.ca/webhook/concrete-toronto-lead`). With JS it is a
  fetch POST that redirects to `/thank-you/` or `/quote-error/`; without JS the
  form does a plain POST and the backend meta-refreshes to `/thank-you/`.
- `public/sitemap.xml` is static except `<lastmod>`, which the build
  regenerates from git history (`scripts/sitemap-lastmod.mjs`, runs before
  `astro build`). The same dates feed per-page `WebPage.dateModified` schema
  via `src/data/lastmod.json`. If you add or remove a page, update the sitemap
  (and `public/llms.txt`) to match; lastmod then takes care of itself.
