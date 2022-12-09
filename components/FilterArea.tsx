import React, { Fragment } from 'react';
import AnimateHeight from 'react-animate-height';

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

const FilterIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M11.125 14C11.7466 14 12.25 14.4475 12.25 15C12.25 15.5525 11.7466 16 11.125 16H8.875C8.25344 16 7.75 15.5525 7.75 15C7.75 14.4475 8.25344 14 8.875 14H11.125ZM14.5 9C15.1216 9 15.625 9.4475 15.625 10C15.625 10.5525 15.1216 11 14.5 11H5.5C4.87844 11 4.375 10.5525 4.375 10C4.375 9.4475 4.87844 9 5.5 9H14.5ZM17.875 4C18.4966 4 19 4.4475 19 5C19 5.5525 18.4966 6 17.875 6H2.125C1.50344 6 1 5.5525 1 5C1 4.4475 1.50344 4 2.125 4H17.875Z"
      fill="#4D4F51"
    />
  </svg>
);

const CloseIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M1.21175 1.43745L1.31632 1.31632C1.69975 0.932901 2.29974 0.898044 2.72254 1.21175L2.84368 1.31632L10 8.47216L17.1563 1.31632C17.5397 0.932901 18.1397 0.898044 18.5625 1.21175L18.6837 1.31632C19.0671 1.69975 19.102 2.29974 18.7882 2.72254L18.6837 2.84368L11.5278 10L18.6837 17.1563C19.0671 17.5397 19.102 18.1397 18.7882 18.5625L18.6837 18.6837C18.3003 19.0671 17.7003 19.102 17.2775 18.7882L17.1563 18.6837L10 11.5278L2.84368 18.6837C2.46025 19.0671 1.86026 19.102 1.43745 18.7882L1.31632 18.6837C0.932901 18.3003 0.898044 17.7003 1.21175 17.2775L1.31632 17.1563L8.47216 10L1.31632 2.84368C0.932901 2.46025 0.898044 1.86026 1.21175 1.43745L1.31632 1.31632L1.21175 1.43745Z"
      fill="#4D4F51"
    />
  </svg>
);

export const Filters = ({
  currentTimePeriod,
  currentTag,
  categories,
  collectives,
  currentLocationFilter,
  setLocationFilter,
  setTag,
  setTimePeriod,
  hideLocationAndTimeFilters,
  mobile = false,
}) => {
  const locationOptions = React.useMemo(() => getFilterOptions(collectives), [collectives]);
  const [expanded, setExpanded] = React.useState(!mobile);

  return (
    <div className="relative z-50 translate-x-0 bg-white">
      {mobile && (
        <button
          className="flex w-full items-center justify-between px-4 py-2 font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          <span className={`transition-opacity duration-300 ${expanded ? 'opacity-25' : 'opacity-100'}`}>
            {categories.find(c => c.tag === currentTag).label}
          </span>{' '}
          {expanded ? <CloseIcon /> : <FilterIcon />}
        </button>
      )}
      <AnimateHeight id="categories" duration={300} height={!mobile ? 'auto' : expanded ? 'auto' : 0}>
        <CategoryFilter
          selectedTag={currentTag}
          categories={categories}
          onSelect={category => {
            setTag(category.tag);
            mobile && setExpanded(false);
          }}
        />
      </AnimateHeight>

      <AnimateHeight id="example-panel" duration={500} height={hideLocationAndTimeFilters ? 0 : 'auto'}>
        <div className="mt-1 border-t pt-2 lg:mt-4 lg:pt-4">
          <div className="space-y-1 lg:space-y-2">
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
                setTimePeriod(option.value);
              }}
            />
            <Dropdown
              fieldLabel={
                <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                  <LocationPin />
                  <span className="text-gray-900">Location</span>
                </div>
              }
              options={locationOptions}
              value={currentLocationFilter}
              onOpen={() => {
                mobile && setExpanded(false);
              }}
              onChange={({ type, value }) => {
                if (value === '') {
                  setLocationFilter(null);
                } else {
                  setLocationFilter({ type, value });
                }
              }}
            />
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default function FilterArea({
  currentTimePeriod,
  currentTag,
  categories,
  collectives,
  currentLocationFilter,
  setLocationFilter,
  setTimePeriod,
  setTag,
  hideFilters,
}) {
  return (
    <Fragment>
      <div className="hidden lg:block">
        <div className="rounded-lg bg-white p-4">
          <Filters
            currentTimePeriod={currentTimePeriod}
            currentTag={currentTag}
            categories={categories}
            collectives={collectives}
            currentLocationFilter={currentLocationFilter}
            setLocationFilter={setLocationFilter}
            setTimePeriod={setTimePeriod}
            setTag={setTag}
            hideLocationAndTimeFilters={hideFilters}
          />
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="relative h-36">
          <div className="absolute top-0 right-0 left-0 rounded-2xl bg-white py-2 px-4 shadow">
            <Filters
              currentTimePeriod={currentTimePeriod}
              currentTag={currentTag}
              categories={categories}
              collectives={collectives}
              currentLocationFilter={currentLocationFilter}
              setLocationFilter={setLocationFilter}
              setTimePeriod={setTimePeriod}
              setTag={setTag}
              hideLocationAndTimeFilters={hideFilters}
              mobile={true}
            />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
