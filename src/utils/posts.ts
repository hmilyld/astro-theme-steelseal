import { getCollection } from 'astro:content';
import type { CollectionEntry } from 'astro:content';

export interface TagCount {
  name: string;
  count: number;
}

export interface YearGroup {
  year: number;
  posts: CollectionEntry<'posts'>[];
}

/** Get the display slug for a post (custom slug or file id). */
export function getPostSlug(post: { id: string; data: { slug?: string } }): string {
  return post.data.slug || post.id;
}

/** Format a date to YYYY-MM-DD. */
export function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Format a date to MM-DD. */
export function formatDateShort(date: Date): string {
  return date.toISOString().slice(5, 10);
}

/** Get all visible posts sorted by date (newest first). */
export async function getVisibleSortedPosts() {
  const allPosts = await getCollection('posts');
  return allPosts
    .filter((p) => !p.data.hidden)
    .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Get tag counts for all visible posts. */
export async function getAllTagCounts(): Promise<TagCount[]> {
  const posts = await getVisibleSortedPosts();
  const tagMap = new Map<string, number>();
  for (const post of posts) {
    for (const tag of post.data.tags) {
      tagMap.set(tag, (tagMap.get(tag) || 0) + 1);
    }
  }
  return [...tagMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => ({ name, count }));
}

/** Visible posts grouped by year, newest year first. */
export async function getPostsByYear(): Promise<YearGroup[]> {
  const posts = await getVisibleSortedPosts();
  const map = new Map<number, CollectionEntry<'posts'>[]>();

  for (const post of posts) {
    // 日期是 UTC 零点，用 getUTCFullYear 才不会在西半球时区掉到上一年
    const year = post.data.date.getUTCFullYear();
    const bucket = map.get(year);
    if (bucket) bucket.push(post);
    else map.set(year, [post]);
  }

  return [...map.entries()]
    .sort((a, b) => b[0] - a[0])
    .map(([year, list]) => ({ year, posts: list }));
}

/** Rough reading time in minutes — CJK by character, Latin by word. */
export function readingMinutes(body: string): number {
  const han = (body.match(/[\u4e00-\u9fff]/g) || []).length;
  const words = (body.replace(/[\u4e00-\u9fff]/g, ' ').match(/[A-Za-z0-9_]+/g) || []).length;
  return Math.max(1, Math.round(han / 400 + words / 220));
}
