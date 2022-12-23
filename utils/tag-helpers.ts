import { uniq } from 'lodash';

import { tagTransforms } from './tag-transforms';

// Transform tags to grouped tags, i.e. if a tag is in a group, return the group key otherwise return the tag
export const getGroupTagKeys = (tags: string[], groupTags: { [key: string]: string[] }) => {
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
