export default function getFilterOptions(preFilteredRows) {
  const options = [];
  const regions = [];
  const countries = [];
  const domesticRegions = [];
  preFilteredRows.forEach(row => {
    if (row.values.location.region && !regions.includes(row.values.location.region)) {
      regions.push(row.values.location.region);
    }

    if (row.values.location.countryCode && !countries.find(c => c.countryCode === row.values.location.countryCode)) {
      countries.push({ countryCode: row.values.location.countryCode, region: row.values.location.region });
    }
    if (
      row.values.location.domesticRegion &&
      !domesticRegions.find(c => c.domesticRegion === row.values.location.domesticRegion)
    ) {
      domesticRegions.push({
        domesticRegion: row.values.location.domesticRegion,
        countryCode: row.values.location.countryCode,
      });
    }
  });
  const sortedRegions = regions.sort();

  // for each region
  sortedRegions.forEach(region => {
    // add the region to the options
    options.push({ type: 'region', label: `${region}`, value: region });
    // add the countries in that region to the options
    countries
      .filter(country => country.region === region)
      .map(country => country.countryCode)
      .sort()
      .forEach(country => {
        options.push({ type: 'countryCode', label: `- ${country}`, value: country });

        // add the domestic regions in that country to the options
        domesticRegions
          .filter(domesticRegion => domesticRegion.countryCode === country)
          .map(state => state.domesticRegion)
          .sort()
          .forEach(domesticRegion => {
            options.push({ type: 'domesticRegion', label: `-- ${domesticRegion}`, value: domesticRegion });
          });
      });
  });

  return options;
}
