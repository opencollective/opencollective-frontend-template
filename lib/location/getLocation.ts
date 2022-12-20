import cities from './cities.json';
import countries from './countries.json';
import usStates from './us_states.json';

export type Location = {
  city?: string;
  stateCode?: string;
  countryCode?: string;
  region?: string;
  isGlobal?: boolean;
  isOnline?: boolean;
  label?: string;
};

function getLocation(tags: string[], countryCode?: string): Location {
  if (!tags.length) {
    return null;
  }
  const city = cities.find(city => tags.includes(city.name.toLowerCase()));
  if (city && (city.countryCode === countryCode || !countryCode)) {
    return {
      city: city.name,
      stateCode: city.stateCode,
      countryCode: city.countryCode,
      region: countries.find(c => c.code === city.countryCode)?.region,
    };
  }

  const state = usStates.find(s => tags.includes(s.name.toLowerCase()));
  if (state && ('US' === countryCode || !countryCode)) {
    return {
      stateCode: state.code,
      countryCode: 'US',
      region: countries.find(c => c.code === 'US').region,
    };
  }

  if (countryCode) {
    const country = countries.find(country => country.code === countryCode);
    if (country) {
      return {
        countryCode: country.code,
        region: country.region,
      };
    }
  }

  const region = countries.find(({ region }) => tags.includes(region.toLowerCase()))?.region;
  if (region) {
    return { region };
  }
  return null;
}

function getLabel(location: Location): string {
  if (location.city) {
    return `${location.city}, ${location.stateCode}`;
  } else if (location.stateCode) {
    return `${usStates.find(state => state.code === location.stateCode).name}`;
  } else if (location.countryCode) {
    return countries.find(country => country.code === location.countryCode).name;
  } else if (location.region) {
    return location.region;
  } else if (location.isGlobal) {
    return 'Global';
  } else if (location.isOnline) {
    return 'Online';
  }
  return null;
}

export default function getLocationWithLabel(collective): Location {
  const tags = collective.tags?.map((s: string) => s.toLowerCase()) || [];
  const countryCode = collective.location?.country;
  const isGlobal = tags.includes('global');
  const isOnline = tags.includes('online');
  const location = {
    ...getLocation(tags, countryCode),
    ...(isGlobal && { isGlobal }),
    ...(isOnline && { isOnline }),
  };

  const label = getLabel(location);
  if (!label) {
    return null;
  }
  return {
    ...location,
    label,
  };
}
