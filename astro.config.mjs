// Astro config for the portfolio.
// `site` must match the GitHub Pages address so canonical URLs and the sitemap are correct.
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://melvinmathew9991.github.io',
  // React powers the interactive project filter. Everything else is static HTML.
  integrations: [react(), sitemap({ filter: (page) => !page.includes('/404') })],
  build: {
    // Inline the (small) stylesheet into each page: one fewer request, faster first paint.
    inlineStylesheets: 'always',
  },
});
