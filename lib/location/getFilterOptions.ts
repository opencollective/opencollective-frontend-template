import countriesData from './countries.json';

type LocationOption = {
  type: string;
  value: string;
  label?: string;
  count: number;
};

export default function getFilterOptions(collectives) {
  const foundLocations: {
    regions: { [key: string]: LocationOption };
    countries: { [key: string]: LocationOption };
    states: { [key: string]: LocationOption };
    cities: { [key: string]: LocationOption };
  } = {
    regions: {},
    countries: {},
    states: {},
    cities: {},
  };
  collectives.forEach(c => {
    if (c.location) {
      if (c.location.region) {
        foundLocations.regions[c.location.region] = {
          type: 'region',
          value: c.location.region,
          label: c.location.region,
          count: (foundLocations.regions[c.location.region]?.count || 0) + 1,
        };
      }
      if (c.location.countryCode) {
        foundLocations.countries[c.location.countryCode] = {
          type: 'country',
          value: c.location.countryCode,
          count: (foundLocations.countries[c.location.countryCode]?.count || 0) + 1,
        };
      }
      if (c.location.stateCode) {
        foundLocations.states[c.location.stateCode] = {
          type: 'state',
          value: c.location.stateCode,
          count: (foundLocations.states[c.location.stateCode]?.count || 0) + 1,
        };
      }
      if (c.location.city) {
        foundLocations.cities[c.location.city] = {
          type: 'city',
          value: c.location.city,
          label: c.location.city,
          count: (foundLocations.cities[c.location.city]?.count || 0) + 1,
        };
      }
    }
  });

  const regions = Object.values(foundLocations.regions).sort((a, b) => a.label.localeCompare(b.label));

  const countries = Object.values(foundLocations.countries).map(c => {
    const country = countriesData.find(c2 => c2.code === c.value);
    return { ...c, label: country.code === 'US' ? 'USA' : country.name, region: country.region };
  });

  const states = Object.values(foundLocations.states);
  const cities = Object.values(foundLocations.cities).sort((a, b) => b.count - a.count);

  const topCities = cities.slice(0, 5);
  const restCities = cities.slice(5);

  // add top cities with hr below
  const regionsAndCountriesNested = [];
  // for each region
  regions.forEach(region => {
    // add the region to the options
    regionsAndCountriesNested.push(region);
    // add the countries in that region to the options
    countries
      .filter(country => {
        return country.region === region.value;
      })
      .sort((a, b) => a.label.localeCompare(b.label))
      .forEach(country => {
        regionsAndCountriesNested.push(country);
      });
  });

  return [
    { type: null, value: null, label: 'All locations', count: collectives.length },
    ...topCities,
    { hr: true },
    ...regionsAndCountriesNested,
    { break: true },
    ...restCities,
    ...states,
    { type: 'other', value: 'online', label: 'Online', count: collectives.filter(c => c.location?.isOnline).length },
    { type: 'other', value: 'global', label: 'Global', count: collectives.filter(c => c.location?.isGlobal).length },
  ];
}
