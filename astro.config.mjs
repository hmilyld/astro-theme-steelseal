// @ts-check
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

// 标了 hidden: true 的文章不进 sitemap（页面本身照常构建，但带 noindex）
const postsDir = fileURLToPath(new URL('./src/content/posts/', import.meta.url));
const hiddenPaths = readdirSync(postsDir).flatMap((file) => {
  if (!file.endsWith('.md')) return [];
  const source = readFileSync(postsDir + file, 'utf8');
  const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? '';
  if (!/^hidden:\s*true\s*$/m.test(frontmatter)) return [];
  const slug = frontmatter.match(/^slug:\s*['"]?([^'"\n]+?)['"]?\s*$/m)?.[1] ?? file.slice(0, -3);
  return [`/posts/${slug}`];
});

/**
 * 搜索页、标签详情页、隐藏文章都是 noindex，不该出现在 sitemap 里
 * @param {string} page
 */
function excludedFromSitemap(page) {
  const path = new URL(page).pathname.replace(/\/$/, '');
  if (path === '/search') return true;
  if (/^\/tags\/[^/]+$/.test(path)) return true;
  return hiddenPaths.includes(path);
}

export default defineConfig({
  // 上线前改成你自己的域名：canonical、og:url、RSS 与 sitemap 都从这里取
  site: 'https://example.com',

  vite: {
    plugins: [tailwindcss()],
  },

  markdown: {
    shikiConfig: {
      theme: 'github-dark',
    },
  },

  integrations: [sitemap({ filter: (page) => !excludedFromSitemap(page) })],
});
