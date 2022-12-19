export type LocationFilter = {
  type: 'city' | 'state' | 'country' | 'region' | 'other';
  value: string;
};

export default function filterLocation(collectives, filter: LocationFilter) {
  if (!filter.value || !filter.type) {
    return collectives;
  }
  const filtered = collectives.filter(collective => {
    if (!collective.location) {
      return false;
    }
    const { region, countryCode, stateCode, city, isGlobal, isOnline } = collective.location;

    switch (filter.type) {
      case 'city':
        return city === filter.value;
      case 'state':
        return stateCode === filter.value;
      case 'country':
        return countryCode === filter.value;
      case 'region':
        return region === filter.value;
      case 'other':
        return filter.value === 'global' ? isGlobal : filter.value === 'online' ? isOnline : false;
      default:
        return false;
    }
  });

  return filtered;
}
