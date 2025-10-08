// @ts-check

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import { defineConfig } from 'astro/config';

// Set timezone for consistent SSR/client rendering
// This prevents hydration mismatches when rendering date strings
process.env.TZ = process.env.TZ || 'America/Denver';

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  integrations: [react(), sitemap()],
  image: {
    service: {
      entrypoint: 'astro/assets/services/sharp',
    },
  },
});
