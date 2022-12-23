import { pickColorForCategory } from './colors';
import { getTagCounts } from './tag-counts';
import { getGroupTagKeys } from './tag-helpers';

export const createCategories = ({
  collectives,
  host,
}): {
  label: string;
  color: { name: string; hex: string };
  tag?: string;
  count?: number;
  options?: { tag: string; count: number }[];
}[] => {
  const { groupTags, includeCategoryTags, excludeCategoryTags } = host;
  const tagCounts = getTagCounts(collectives, groupTags);

  const subGroupTags = Object.keys(groupTags).reduce((acc, groupKey) => {
    acc.push(...groupTags[groupKey].filter(tag => tag !== groupKey));
    return acc;
  }, []);

  excludeCategoryTags.push(...subGroupTags);

  // Create categoryTags
  // First add the host's includeCategoryTags
  // Then go through collectives and add the most popular tag as a category
  // then filter away collectives with that tag and see what is the most popular after that
  // This is to reduce having many categories that are essentially the same
  const categoryTags = [];
  let collectivesNotCategorized = collectives;
  for (let i = 0; i < 6; i++) {
    let tag;

    if (includeCategoryTags[i]) {
      tag = includeCategoryTags[i];
    } else {
      const tagCounts = getTagCounts(collectivesNotCategorized, groupTags);

      const [topTag] = Object.keys(tagCounts)
        .sort((a, b) => tagCounts[b] - tagCounts[a])
        .filter(tag => !excludeCategoryTags.includes(tag));
      tag = topTag;
    }

    categoryTags.push(tag);

    // Filter away collectives that are part of the tag just added
    collectivesNotCategorized = collectivesNotCategorized.filter(
      coll => !getGroupTagKeys(coll.tags, groupTags)?.includes(tag),
    );
  }

  // Add All category and add colors and counts
  const categories = [
    { label: 'All Categories', tag: 'ALL', count: collectives.length },
    // Add categories
    ...categoryTags
      .map(tag => ({
        // Capitalize first letter in all words for the label, and use & instead of "and"
        label: tag
          .split(' ')
          .map(word => (word === 'and' ? '&' : word.charAt(0).toUpperCase() + word.slice(1)))
          .join(' '),
        tag,
        count: tagCounts[tag],
      }))
      .sort((a, b) => b.count - a.count),
    {
      label: 'More...',
      // Add More... category with options containing all tags that have more than 3 collectives
      options: Object.keys(tagCounts)
        .sort((a, b) => tagCounts[b] - tagCounts[a])
        .map(tag => ({ tag, count: tagCounts[tag] }))
        .filter(({ tag, count }) => count >= 3 && !categoryTags.includes(tag)),
    },
  ];

  return categories.map((category, i, arr) => ({
    ...category,
    color: pickColorForCategory(host.color.closestPaletteColor, i, arr.length),
  }));
};
