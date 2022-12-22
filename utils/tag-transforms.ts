import { uniq } from 'lodash';

// Tag transforms that are applied to all accounts.
// These are intended to fix various inconsistencies of the same thing
// For grouping tags under each other, use defaultGroupTags or groupTags in the host config
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

export const transformTags = (tags: string[]) => {
  if (!tags) {
    return null;
  }
  return uniq(tags.map(tag => tagTransforms[tag] || tag));
};

// Transform tags to grouped tags, i.e. if a tag is in a group, return the group key otherwise return the tag
export const transformToGroupTags = (tags: string[], groupTags: { [key: string]: string[] }) => {
  const groupedTagKey = Object.entries(groupTags).reduce((acc, [key, value]) => {
    value.forEach(tag => {
      acc[tag] = key;
    });
    return acc;
  }, {});
  return uniq(tags?.map(tag => groupedTagKey[tag] || tag)) ?? null;
};

// This is used to reverse the group tags AND the tag transforms when querying the API
export const getAllPossibleTagValues = (tag: string, groupTags: { [key: string]: string[] }): string[] => {
  const tags = groupTags[tag] || [tag];
  const acc = [...tags];

  const reverseTagTransforms = Object.entries(tagTransforms).reduce((acc, [key, value]) => {
    if (tags.includes(value)) {
      acc.push(key);
    }
    return acc;
  }, []);

  acc.push(...reverseTagTransforms);

  return acc;
};
