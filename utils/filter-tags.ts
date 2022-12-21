export const filterTags = (collectives, tag, categoriesToTags) => {
  if (!tag || tag === 'ALL') {
    return collectives;
  }
  const tags = categoriesToTags[tag] || [tag];
  return collectives.filter(collective => tags.some(tag => collective.tags?.includes(tag)));
};
