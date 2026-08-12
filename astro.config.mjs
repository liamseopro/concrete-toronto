import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://concrete-toronto.ca',
  trailingSlash: 'always',
  // The build output is committed to the repo and served by GitHub Pages
  // from /docs on the main branch. This is deliberate, do not change it.
  outDir: './docs',
});
