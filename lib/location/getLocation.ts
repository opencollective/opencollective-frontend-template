import locationTags from '../../locationTags.json';
import fs from 'fs';
import countries from './countries.json';
import usStates from './us_states.json';

const cities = [
  { name: 'Boston', stateCode: 'MA', countryCode: 'US' },
  { name: 'Austin', stateCode: 'TX', countryCode: 'US' },
  { name: 'New York City', alternativeSpelling: ['nyc'], stateCode: 'NY', countryCode: 'US' },
  { name: 'Brooklyn', stateCode: 'NY', countryCode: 'US' },
];

function getLocation(tags: string[]) {
  if (!tags.length) {
    return null;
  }

  const city = cities.find(city => tags.includes(city.name.toLowerCase()));
  if (city) {
    return {
      city: city.name,
      stateCode: city.stateCode,
      countryCode: city.countryCode,
      region: countries.find(c => c.code === city.countryCode)?.region,
    };
  }

  const state = usStates.find(s => tags.includes(s.name.toLowerCase()));
  if (state) {
    return {
      stateCode: state.code,
      countryCode: 'US',
      region: countries.find(c => c.code === 'US').region,
    };
  }

  const country = countries.find(country => {
    return (
      tags.includes(country.code.toLowerCase()) ||
      tags.includes(country.code3chars.toLowerCase()) ||
      tags.includes(country.name.toLowerCase())
    );
  });
  if (country) {
    return {
      countryCode: country.code,
      region: country.region,
    };
  }

  const region = countries.find(({ region }) => tags.includes(region.toLowerCase()))?.region;
  if (region) {
    return { region };
  }
  return null;
}

function getLabel(location) {
  if (location.city) {
    return `${location.city}, ${location.countryCode}`;
  } else if (location.stateCode) {
    return `${usStates.find(state => state.code === location.stateCode).name}, ${location.countryCode}`;
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

export default function getLocationWithLabel(collective) {
  const tags = collective.tags?.map(s => s.toLowerCase()) || [];

  const isGlobal = tags.includes('global');
  const isOnline = tags.includes('online');
  const location = { ...getLocation(tags), isGlobal, isOnline };

  const label = getLabel(location);
  return {
    ...location,
    label,
  };
}
