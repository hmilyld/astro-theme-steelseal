import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITE } from '../config';
import { getVisibleSortedPosts, getPostSlug } from '../utils/posts';

export async function GET(context: APIContext) {
  const posts = await getVisibleSortedPosts();
  const items = posts.map((post) => ({
    title: post.data.title,
    description: post.data.excerpt || '',
    pubDate: post.data.date,
    link: `/posts/${getPostSlug(post)}`,
    categories: post.data.tags,
  }));

  return rss({
    title: SITE.title,
    description: SITE.description,
    site: context.site!,
    items,
    customData: '<language>zh-CN</language>',
  });
}
