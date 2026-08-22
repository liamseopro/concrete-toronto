#!/usr/bin/env node
// Injects <lastmod> into public/sitemap.xml and writes src/data/lastmod.json
// (consumed by Base.astro for per-page WebPage dateModified). Dates come from
// git history — the last commit that touched each page's source file — so the
// freshness signals stay truthful as the site changes. Runs before astro build.
import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync, statSync } from 'node:fs';

const SITEMAP = 'public/sitemap.xml';
let xml = readFileSync(SITEMAP, 'utf8');
const map = {};

function gitDate(file) {
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
      encoding: 'utf8',
    }).trim();
    if (out) return out;
  } catch {
    // fall through to mtime
  }
  return new Date(statSync(file).mtime).toISOString().slice(0, 10);
}

xml = xml.replace(/\s*<lastmod>[^<]*<\/lastmod>/g, ''); // drop stale entries first
xml = xml.replace(/<url><loc>([^<]+)<\/loc>/g, (whole, loc) => {
  const path = new URL(loc).pathname;
  const file =
    path === '/' ? 'src/pages/index.astro' : `src/pages${path.replace(/\/$/, '')}/index.astro`;
  let date;
  try {
    date = gitDate(file);
  } catch {
    return whole; // no source file, leave the entry untouched
  }
  map[path] = date;
  return `<url><loc>${loc}</loc><lastmod>${date}</lastmod>`;
});

writeFileSync(SITEMAP, xml);
writeFileSync('src/data/lastmod.json', JSON.stringify(map, null, 2) + '\n');
console.log(`sitemap-lastmod: wrote ${Object.keys(map).length} lastmod entry(ies)`);
