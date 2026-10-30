import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const sitemap = `${site}sitemap-index.xml`;
  return new Response(
    `User-agent: *
Allow: /
Disallow: /search

Sitemap: ${sitemap}
`,
    { headers: { 'Content-Type': 'text/plain' } },
  );
};
