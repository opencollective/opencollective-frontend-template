import React from 'react';
import { useRouter } from 'next/router';

import getFilterOptions from '../lib/location/getFilterOptions';

import CategoryFilter from './CategorySelect';
import Dropdown from './Dropdown';
import { LocationPin } from './LocationTag';

const DateIcon = () => (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M9.42449 7.54688C9.42449 7.24484 9.66932 7 9.97136 7H10.5C10.802 7 11.0469 7.24484 11.0469 7.54688C11.0469 7.84891 10.802 8.09375 10.5 8.09375H9.97136C9.66932 8.09375 9.42449 7.84891 9.42449 7.54688ZM14 4.36086V9.68879C14 10.5284 13.673 11.3178 13.0793 11.9115L11.9115 13.0793C11.3178 13.673 10.5284 14 9.68879 14H3.28535C2.40778 14 1.58277 13.6583 0.962254 13.0377C0.341742 12.4172 0 11.5922 0 10.7146V4.36086C0 2.56421 1.43853 1.10718 3.22656 1.07603V0.546875C3.22656 0.244836 3.4714 0 3.77344 0C4.07548 0 4.32031 0.244836 4.32031 0.546875V1.07551H9.67969V0.546875C9.67969 0.244836 9.92452 0 10.2266 0C10.5286 0 10.7734 0.244836 10.7734 0.546875V1.07603C12.5623 1.10718 14 2.56514 14 4.36086ZM1.09452 4.30207H12.9055C12.8747 3.12717 11.9267 2.20021 10.7734 2.17003V2.6979C10.7734 2.99994 10.5286 3.24477 10.2265 3.24477C9.9245 3.24477 9.67966 2.99994 9.67966 2.6979V2.16926H4.32031V2.6979C4.32031 2.99994 4.07548 3.24477 3.77344 3.24477C3.4714 3.24477 3.22656 2.99994 3.22656 2.6979V2.17003C2.05152 2.20082 1.1247 3.14896 1.09452 4.30207ZM12.8329 10.2357H11.3294C10.7263 10.2357 10.2357 10.7263 10.2357 11.3294V12.8329C10.5737 12.7399 10.8835 12.5605 11.1381 12.3059L12.3059 11.1381C12.5605 10.8835 12.7399 10.5737 12.8329 10.2357ZM12.9062 5.39582H1.09375V10.7146C1.09375 11.3001 1.32171 11.8504 1.73567 12.2644C2.1496 12.6783 2.69995 12.9062 3.28535 12.9062H9.14192V11.3294C9.14192 10.1232 10.1232 9.14192 11.3294 9.14192H12.9062V5.39582ZM3.5 10.7917H4.02864C4.33068 10.7917 4.57551 10.5468 4.57551 10.2448C4.57551 9.94276 4.33068 9.69793 4.02864 9.69793H3.5C3.19796 9.69793 2.95312 9.94276 2.95312 10.2448C2.95312 10.5468 3.19796 10.7917 3.5 10.7917ZM6.73567 8.09375H7.2643C7.56634 8.09375 7.81118 7.84891 7.81118 7.54688C7.81118 7.24484 7.56634 7 7.2643 7H6.73567C6.43363 7 6.18879 7.24484 6.18879 7.54688C6.18879 7.84891 6.43366 8.09375 6.73567 8.09375ZM3.5 8.09375H4.02864C4.33068 8.09375 4.57551 7.84891 4.57551 7.54688C4.57551 7.24484 4.33068 7 4.02864 7H3.5C3.19796 7 2.95312 7.24484 2.95312 7.54688C2.95312 7.84891 3.19796 8.09375 3.5 8.09375ZM6.73567 10.7917H7.2643C7.56634 10.7917 7.81118 10.5468 7.81118 10.2448C7.81118 9.94276 7.56634 9.69793 7.2643 9.69793H6.73567C6.43363 9.69793 6.18879 9.94276 6.18879 10.2448C6.18879 10.5468 6.43366 10.7917 6.73567 10.7917Z"
      fill="#75777A"
    />
  </svg>
);

export default function FilterArea({
  currentTimePeriod,
  currentTag,
  categories,
  collectives,
  currentLocationFilter,
  setCurrentLocationFilter,
}) {
  const router = useRouter();
  const locationOptions = React.useMemo(() => getFilterOptions(collectives.map(c => ({ values: c }))), [collectives]);

  return (
    <div className="sticky top-10 rounded-lg bg-white p-4">
      <CategoryFilter
        currentTimePeriod={currentTimePeriod}
        selectedTag={currentTag}
        categories={categories}
        onSelect={category => {
          router.push({ pathname: '/foundation', query: { ...router.query, ...{ tag: category.tag } } }, null, {
            shallow: true,
          });
        }}
      />
      <div className="mt-4 border-t pt-4">
        <div className="space-y-2">
          <Dropdown
            fieldLabel={
              <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                <DateIcon />
                <span className="text-gray-900">Date range</span>
              </div>
            }
            options={[
              { value: 'ALL', label: 'All time' },
              { value: 'PAST_YEAR', label: 'Past 12 months' },
              { value: 'PAST_QUARTER', label: 'Past 3 months' },
            ]}
            value={currentTimePeriod}
            onChange={option => {
              router.push({ pathname: '/foundation', query: { ...router.query, ...{ time: option.value } } }, null, {
                shallow: true,
              });
            }}
          />
          <Dropdown
            fieldLabel={
              <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                <LocationPin />
                <span className="text-gray-900">Location</span>
              </div>
            }
            options={[{ value: '', label: 'All locations' }, ...locationOptions]}
            value={JSON.parse(currentLocationFilter).value}
            onChange={value => {
              setCurrentLocationFilter(JSON.stringify(value));
            }}
          />
        </div>
      </div>
    </div>
  );
}
