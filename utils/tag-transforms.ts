// Default tag transforms. These will be applied to all collectives.
// These should fix various typos and inconsistencies of the same thing
// For grouping tags under each other, either use defaultGroupTags or groupTags in the host config
const tagTransforms = {
  opensource: 'open source',
  'open-source': 'open source',
  'Open source': 'open source',
  'Open Source': 'open source',
  'covid-19': 'covid',
  Covid19: 'covid',
  covid19: 'covid',
  'COVID-19': 'covid',
  'Covid-19': 'covid',
  coronavirus: 'covid',
  'Tech meetups': 'meetup',
  Climate: 'climate',
};

const transformTag = tag => tagTransforms[tag] || tag;

export const transformTags = tags => {
  return tags?.map(tag => transformTag(tag)).filter((tag, i, arr) => arr.indexOf(tag) === i) ?? null;
};

export const getCategoryTags = (tags, groupTags) => {
  const tagsToCategoryTag = getTagsToCategory(groupTags);
  return tags?.map(tag => tagsToCategoryTag[tag] || tag).filter((tag, i, arr) => arr.indexOf(tag) === i) ?? null;
};

const getTagsToCategory = groupTags => {
  return groupTags
    ? Object.entries(groupTags).reduce((acc, [key, value]) => {
        value.forEach(tag => {
          acc[tag] = key;
        });
        return acc;
      }, {})
    : null;
};

export const addTransformedTags = (tag, tagTransforms) => {
  const result = [tag];
  const transformedTag = tagTransforms[tag];
  if (transformedTag) {
    result.push(transformedTag);
  }
  const transformedTwice = tagTransforms[transformedTag];
  if (transformedTwice) {
    result.push(transformedTwice);
  }
  return result;
};

// a function that given a tag will return an array of tags that are equivalent
export const reverseTagTransformAll = (tag, tagTransforms) => {
  const transformedTags = Object.entries(tagTransforms).reduce((acc, [key, value]) => {
    if (value === tag) {
      acc.push(key);
    }
    return acc;
  }, []);

  return [...transformedTags, tag];
};

export const reverseTagTransform = (tag, tagTransforms) =>
  Object.entries(tagTransforms).reduce((acc, [key, value]) => {
    if (value === tag) {
      acc.push(key);
    }
    return acc;
  }, []);

// a function that given a tag will return an array of tags that are equivalent
// Supports two levels of reversing.
export const getReversedTags = (tag, tagTransforms) => {
  if (!tagTransforms) {
    return [tag];
  }
  const reversedTags = reverseTagTransform(tag, tagTransforms);

  // for (const reversedTag of reversedTags) {
  //   const reversedTwice = reverseTagTransform(reversedTag, tagTransforms);

  //   console.log({ reversedTwice });
  //   // if (reversedTwice) {
  //   //   reversedTags.push(...reversedTwice);
  //   // }
  // }

  return [...reversedTags, tag];
};
