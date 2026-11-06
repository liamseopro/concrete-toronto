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
- The quote form posts to
  `https://n8n.londonseopro.ca/webhook/concrete-toronto-lead`. Cloudflare routes
  that path to the `lsp-lead-agents` Worker (source:
  `clients/netleads/n8n-migration/replacements/lsp-lead-agents`). The old n8n
  workflow `g15PNqS8z9UTY1e5` is inactive and is not the live sender. With JS
  the form is a fetch POST that redirects to `/thank-you/` or `/quote-error/`;
  without JS it does a plain POST and the backend meta-refreshes to `/thank-you/`.
  Since 2026-11-06 the form also carries the torontoparging.ca Turnstile
  widget (`0x4AAAAAAELhmk0AstOS7Ag2`, this domain added to its allowlist);
  the Worker verifies the token on fetch() posts when its
  `TURNSTILE_SECRET_KEY` secret is set. No-JS posts skip Turnstile and rely
  on `_honey` + the Worker's Hard Spam Check, mirroring torontoparging.ca.
- Legit leads (after the spam check) SMS Tien (`+19053489888`) and Euro
  Construction / Julius (`+16479239805`) from `+16476920442`, email Tien,
  confirm the customer, and append to the shared *Lead Tracker - Toronto
  Parging* Sheet1 (`1BVt0B6Wozcoy6XoNOogesx3LM2Rn7JDXjHxROaNlE3g`, distinguish
  via `source_url`). The sheet Note is `not billable - concrete-toronto.ca`.
  Spam gets a success response, no alerts.
- Calls to `(289) 906-0097` (`+12899060097`) use the Toronto Parging Twilio
  Studio flow, which connects the caller to Euro (`+16479239805`). Qualified
  call transcripts land on the same Sheet1 with Source Url `12899060097` and
  text Euro and Tien. Those calls are delivered, not billed.
- Send every concrete-toronto lead to Euro. Do not charge the client for them.
  Only torontoparging.ca leads are billable. The inactive n8n workflow
  `Toronto Parging Invoicing` (`7huz3RW9QwAagRWX`) excludes `concrete-toronto.ca`
  sources and tracking number `289-906-0097` before a row can become a
  candidate. Keep that exclusion if the invoice workflow is turned back on.
- `public/sitemap.xml` is static except `<lastmod>`, which the build
  regenerates from git history (`scripts/sitemap-lastmod.mjs`, runs before
  `astro build`). The same dates feed per-page `WebPage.dateModified` schema
  via `src/data/lastmod.json`. If you add or remove a page, update the sitemap
  (and `public/llms.txt`) to match; lastmod then takes care of itself.
