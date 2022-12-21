import { getCategoryTags } from './tag-transforms';

const countTags = (collectives, groupTags?: { [key: string]: string[] }): { [key: string]: number } => {
  return collectives.reduce((acc, collective) => {
    const tags = groupTags ? getCategoryTags(collective.tags, groupTags) : collective.tags;

    tags?.forEach(tag => {
      if (!acc[tag]) {
        acc[tag] = 0;
      }
      acc[tag]++;
    });
    return acc;
  }, {});
};

export const getTagCounts = (collectives, groupTags) => {
  const groupedTagCounts = countTags(collectives, groupTags);
  const ungroupedTagCounts = countTags(collectives);

  const tagCounts: { [key: string]: number } = Object.keys(ungroupedTagCounts).reduce((acc, tag) => {
    acc[tag] = groupedTagCounts[tag] || ungroupedTagCounts[tag];
    return acc;
  }, {});

  return tagCounts;
};
