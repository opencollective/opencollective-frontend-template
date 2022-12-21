import { getAllPosts, markdownToHtml } from '../lib/markdown';

export async function getStories({ collectives }) {
  return await Promise.all(
    getAllPosts()
      .map(story => ({
        ...story,
        collective: collectives.find(c => c.slug === story.collectiveSlug) ?? null,
      }))
      // Filter out stories that don't have a collective in this page
      .filter(story => story.collective)
      .map(async story => ({
        ...story,
        content: await markdownToHtml(story.content),
      })),
  );
}
