import { getVisibleSortedPosts, getPostSlug, formatDate, readingMinutes } from '../utils/posts';

export async function GET(): Promise<Response> {
  const posts = await getVisibleSortedPosts();
  const index = posts.map((post) => ({
    id: getPostSlug(post),
    title: post.data.title,
    date: formatDate(post.data.date),
    tags: post.data.tags,
    minutes: readingMinutes(post.body ?? ''),
    excerpt: post.data.excerpt || '',
  }));

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
}
