import { Location } from './get-location';

export type LocationFilter = {
  type: 'city' | 'state' | 'country' | 'region' | 'other';
  value: string;
};

export function filterLocation(collectives, filter: LocationFilter) {
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

export function getLocationFilterFromLocation(location: Location): LocationFilter {
  if (location?.city) {
    return { type: 'city', value: location.city };
  }
  if (location?.stateCode) {
    return { type: 'state', value: location.stateCode };
  }
  if (location?.countryCode) {
    return { type: 'country', value: location.countryCode };
  }
  if (location?.region) {
    return { type: 'region', value: location.region };
  }
  if (location?.isGlobal) {
    return { type: 'other', value: 'global' };
  }
  if (location?.isOnline) {
    return { type: 'other', value: 'online' };
  }

  return null;
}
