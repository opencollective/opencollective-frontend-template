export const filterTags = (collectives, tag, groupTags) => {
  if (!tag || tag === 'ALL') {
    return collectives;
  }
  const tags = groupTags[tag] || [tag];
  return collectives.filter(collective => tags.some(tag => collective.tags?.includes(tag)));
};
