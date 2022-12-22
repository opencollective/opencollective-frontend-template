import { transformToGroupTags } from './tag-transforms';

// Function that returns tag counts for a list of collectives. if a tag is the key of a group, it will return the count of the group
export const getTagCounts = (collectives, groupTags?: { [key: string]: string[] }): { [key: string]: number } => {
  const { groupedCounts, ungroupedCounts } = collectives.reduce(
    (acc, collective) => {
      const groupedTags = transformToGroupTags(collective.tags, groupTags);
      const ungroupedTags = collective.tags;

      groupedTags?.forEach(tag => {
        if (!acc.groupedCounts[tag]) {
          acc.groupedCounts[tag] = 0;
        }
        acc.groupedCounts[tag]++;
      });

      ungroupedTags?.forEach(tag => {
        if (!acc.ungroupedCounts[tag]) {
          acc.ungroupedCounts[tag] = 0;
        }
        acc.ungroupedCounts[tag]++;
      });

      return acc;
    },
    { groupedCounts: {}, ungroupedCounts: {} },
  );
  return Object.keys(ungroupedCounts).reduce((acc, tag) => {
    acc[tag] = groupedCounts[tag] || ungroupedCounts[tag];
    return acc;
  }, {});
};
