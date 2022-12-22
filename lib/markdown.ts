import fs from 'fs';
import { join } from 'path';

import matter from 'gray-matter';
import { remark } from 'remark';
import html from 'remark-html';

const postsDirectory = join(process.cwd(), '_stories');

export function getPostSlugs() {
  return fs.readdirSync(join(postsDirectory));
}

export function getPostBySlug(slug: string) {
  const realSlug = slug.replace(/\.md$/, '');
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, 'utf8');
  const { data, content } = matter(fileContents);

  type Post = {
    content?: string;
    slug?: string;
    video?: object;
    tags?: string[];
    location?: string;
    date?: string;
    collectiveSlug?: string;
    published?: boolean;
  };

  const post: Post = {
    ...data,
    slug: realSlug,
    published: data.published ?? true,
    content,
  };

  return post;
}

export function getAllPosts() {
  try {
    const slugs = getPostSlugs();
    const posts = slugs
      .map(slug => getPostBySlug(slug))
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
