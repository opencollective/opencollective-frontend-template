import React from 'react';

import { getLocationFilterFromLocation, LocationFilter } from '../utils/location/filter-location';
import { Location } from '../utils/location/get-location';

import { LocationPin } from './Icons';

export default function LocationTag({
  location,
  setLocationFilter,
}: {
  location: Location;
  setLocationFilter?: (filter: LocationFilter) => void;
}) {
  const onClick = e => {
    e.stopPropagation();
    setLocationFilter && setLocationFilter(getLocationFilterFromLocation(location));
  };
  return (
    <button
      disabled={!setLocationFilter}
      onClick={onClick}
      className={`flex max-w-full items-center gap-2 whitespace-nowrap rounded-full border bg-gray-50 py-1 px-2 text-sm transition-colors ${
        !!setLocationFilter && 'hover:bg-white'
      }`}
    >
      <LocationPin className="flex-shrink-0" />
      <span className="overflow-hidden overflow-ellipsis">{location.label}</span>
    </button>
  );
}
