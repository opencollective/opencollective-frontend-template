import fs from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = join(process.cwd(), '_stories');

export function getPostSlugs() {
  return fs.readdirSync(join(postsDirectory));
}

export function getPostBySlug(slug: string, fields: string[] = []) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  type Items = {
    // [key: string]: string | string[];
    content?: string;
    video?: object;
    tags?: string[];
    location?: string;
    date?: string;
    collectiveSlug?: string;
    published?: boolean;
  };

  const items: Items = {};

  // Ensure only the minimal needed data is exposed
  fields.forEach(field => {
    if (field === 'slug') {
      items[field] = realSlug;
    }
    if (field === 'content') {
      items[field] = content;
    }

    if (typeof data[field] !== 'undefined') {
      items[field] = data[field];
    }
  });
  // If published is defined, use that, otherwise default to true
  items.published = data.published ?? true;

  return items;
}

export function getAllPosts(fields: string[] = []) {
  try {
    const slugs = getPostSlugs();
    const posts = slugs
      .map(slug => getPostBySlug(slug, fields))
      .filter(post => post.published)
      // sort posts by date in descending order
      .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
    return posts;
  } catch (e) {
    return [];
  }
}

export async function markdownToHtml(markdown: string) {
  const result = await remark().use(html).process(markdown);
  return result.toString();
}
