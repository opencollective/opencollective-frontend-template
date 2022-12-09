import React from 'react';

import { LocationFilter } from '../lib/location/filterLocation';
import { Location } from '../lib/location/getLocation';

export const LocationPin = ({ className }: { className?: string }) => (
  <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M8.51945 15.1569C9.2455 14.5788 9.97134 13.9255 10.6506 13.2085C12.6317 11.1173 13.8333 8.91439 13.8333 6.66666C13.8333 2.98476 10.8486 0 7.16667 0C3.48477 0 0.5 2.98476 0.5 6.66666C0.5 8.91439 1.7016 11.1173 3.6827 13.2085C4.362 13.9255 5.08783 14.5788 5.81388 15.1569C6.0684 15.3596 6.30522 15.5387 6.51853 15.6928C6.64852 15.7867 6.74324 15.8523 6.79687 15.888C7.0208 16.0373 7.31253 16.0373 7.53647 15.888C7.5901 15.8523 7.68482 15.7867 7.81481 15.6928C8.02812 15.5387 8.26493 15.3596 8.51945 15.1569ZM9.6827 12.2915C9.0495 12.9599 8.36908 13.5722 7.68888 14.1139C7.50322 14.2617 7.32821 14.3957 7.16667 14.5151C7.00513 14.3957 6.83011 14.2617 6.64445 14.1139C5.96425 13.5722 5.28383 12.9599 4.65063 12.2915C2.88173 10.4243 1.83333 8.50225 1.83333 6.66666C1.83333 3.72114 4.22115 1.33333 7.16667 1.33333C10.1122 1.33333 12.5 3.72114 12.5 6.66666C12.5 8.50225 11.4516 10.4243 9.6827 12.2915ZM7.16667 9.33332C5.69391 9.33332 4.5 8.13942 4.5 6.66666C4.5 5.1939 5.69391 3.99999 7.16667 3.99999C8.63943 3.99999 9.83333 5.1939 9.83333 6.66666C9.83333 8.13942 8.63943 9.33332 7.16667 9.33332ZM8.5 6.66666C8.5 7.40304 7.90305 7.99999 7.16667 7.99999C6.43029 7.99999 5.83333 7.40304 5.83333 6.66666C5.83333 5.93028 6.43029 5.33333 7.16667 5.33333C7.90305 5.33333 8.5 5.93028 8.5 6.66666Z"
      fill="#4D4F51"
    />
  </svg>
);

const locationFilterFromLocation = (location: Location): LocationFilter => {
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
};

export default function LocationTag({
  location,
  setLocationFilter,
}: {
  location: Location;
  setLocationFilter?: (filter: LocationFilter) => void;
}) {
  const onClick = e => {
    e.stopPropagation();
    setLocationFilter && setLocationFilter(locationFilterFromLocation(location));
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
