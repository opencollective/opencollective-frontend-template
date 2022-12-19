export const tagTransforms = {
  'covid-19': 'covid',
  'climate change': 'climate',
  'climate justice': 'climate',
  opensource: 'open source',
};

// a function that given a tag will return an array of tags that are equivalent
export const reverseTagTransform = tag => {
  const transformedTags = Object.entries(tagTransforms).reduce((acc, [key, value]) => {
    if (value === tag) {
      acc.push(key);
    }
    return acc;
  }, []);

  return [...transformedTags, tag];
};
