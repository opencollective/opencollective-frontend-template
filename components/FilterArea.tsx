import React, { Fragment } from 'react';
import AnimateHeight from 'react-animate-height';

import CategoryFilter from './CategorySelect';
import Dropdown from './Dropdown';
import { CloseIcon, DateIcon, FilterIcon, LocationPin } from './Icons';

export const Filters = ({
  filter,
  categories,
  setFilter,
  locale,
  locationOptions,
  mobile = false,
  currentCategory,
  collectivesInView,
}) => {
  const [expanded, setExpanded] = React.useState(!mobile);

  return (
    <div className="relative z-50 bg-white">
      {mobile && (
        <button
          className="flex w-full items-center justify-between px-4 py-2 font-medium"
          onClick={() => setExpanded(!expanded)}
        >
          <span className={`transition-opacity duration-300 ${expanded ? 'opacity-25' : 'opacity-100'}`}>
            {currentCategory.label}
          </span>{' '}
          {expanded ? (
            <CloseIcon />
          ) : (
            <FilterIcon className={`${currentCategory.tag !== 'ALL' && `text-${currentCategory.color.name}-600`}`} />
          )}
        </button>
      )}
      <AnimateHeight id="categories" duration={300} height={!mobile ? 'auto' : expanded ? 'auto' : 0}>
        <CategoryFilter
          locale={locale}
          filter={filter}
          categories={categories}
          setTagFilter={tag => {
            setFilter({ tag });
            mobile && setExpanded(false);
          }}
        />
      </AnimateHeight>

      <AnimateHeight id="date-location-filters" duration={500} height={collectivesInView ? 'auto' : 0}>
        <div className="mt-1 border-t pb-1 pt-2 lg:mt-4 lg:pt-4">
          <div className="space-y-1 lg:space-y-2">
            <Dropdown
              ariaLabel="Location"
              currentCategoryColor={currentCategory.color.name}
              fieldLabel={
                <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                  <LocationPin />
                  <span>Location</span>
                </div>
              }
              options={locationOptions.map(option => ({
                ...option,
                value: JSON.stringify({ type: option.type, value: option.value }),
              }))}
              value={JSON.stringify(filter.location)}
              onOpen={() => {
                mobile && setExpanded(false);
              }}
              onChange={option => {
                setFilter({ location: JSON.parse(option.value) });
              }}
            />
            <Dropdown
              ariaLabel="Date range"
              currentCategoryColor={currentCategory.color.name}
              fieldLabel={
                <div className="flex items-center gap-2 whitespace-nowrap text-sm font-medium">
                  <DateIcon />
                  <span>Date range</span>
                </div>
              }
              options={[
                { value: 'ALL', label: 'All time' },
                { value: 'PAST_YEAR', label: 'Past 12 months' },
                { value: 'PAST_QUARTER', label: 'Past 3 months' },
              ]}
              value={filter.timePeriod}
              onChange={({ value }) => {
                setFilter({ timePeriod: value });
              }}
            />
          </div>
        </div>
      </AnimateHeight>
    </div>
  );
};

export default function FilterArea(props) {
  return (
    <Fragment>
      <div className="hidden lg:block">
        <div className="rounded-lg bg-white p-4">
          <Filters {...props} />
        </div>
      </div>
      <div className="block lg:hidden">
        <div className="relative h-40">
          <div className="absolute top-0 right-0 left-0 bg-white py-2 px-4 shadow">
            <Filters {...props} mobile={true} />
          </div>
        </div>
      </div>
    </Fragment>
  );
}
