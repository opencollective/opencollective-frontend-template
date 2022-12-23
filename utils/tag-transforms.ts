import { uniq } from 'lodash';

// Tag transforms that are applied to all accounts.
// These are intended to fix various inconsistencies of the same thing
// For grouping tags under each other, use defaultGroupTags or groupTags in the host config
export const tagTransforms = {
  opensource: 'open source',
  'open-source': 'open source',
  'covid-19': 'covid',
  covid19: 'covid',
  coronavirus: 'covid',
  'tech meetups': 'meetup',
};

export function transformTags(collective) {
  const tags = collective.tags?.map(t => t.toLowerCase()).map(tag => tagTransforms[tag] || tag) || [];

  return uniq(tags);
}
