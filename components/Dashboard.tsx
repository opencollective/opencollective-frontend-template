import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { useInView } from 'react-intersection-observer';

import { computeStats, computeTimeSeries } from '../lib/compute-data';
import filterLocation, { LocationFilter } from '../lib/location/filterLocation';
import getFilterOptions from '../lib/location/getFilterOptions';
import { pushFilterToRouter } from '../lib/set-filter';

import Chart from './Chart';
import CollectiveModal from './CollectiveModal';
import FilterArea from './FilterArea';
import Header from './Header';
import { InfoBox } from './InfoBox';
import Stats from './Stats';
import Stories from './Stories';
import Table from './Table';
import Updates from './Updates';

export type Filter = {
  slug?: string;
  timePeriod?: string;
  tag?: string;
  location?: LocationFilter;
};

const getParam = param => (Array.isArray(param) ? param[0] : param);

const getLocationFilterParams = query => {
  const location = getParam(query?.location);
  const locationType = getParam(query?.locationType);
  return location && locationType ? { type: locationType, value: location } : null;
};

export default function Dashboard({
  host,
  hosts,
  categories,
  collectives: allCollectives,
  hostSlug,
  stories,
  locale,
  currency,
  startYear,
  platformTotalCollectives,
}) {
  const router = useRouter();
  const filter: Filter = {
    slug: hostSlug,
    timePeriod: getParam(router.query?.time) ?? 'ALL',
    tag: getParam(router.query?.tag) ?? 'ALL',
    location: getLocationFilterParams(router.query) ?? { type: null, value: null },
  };

  const locationFilteredCollectives = React.useMemo(
    () => filterLocation(allCollectives, filter.location),
    [JSON.stringify(filter)],
  );

  const categoriesWithFilteredCollectives = React.useMemo(
    () =>
      categories.map(category => {
        return {
          ...category,
          collectives: locationFilteredCollectives.filter(
            collective => category.tag === 'ALL' || collective.tags?.includes(category.tag),
          ),
        };
      }),
    [JSON.stringify(filter)],
  );

  const series = React.useMemo(
    () => computeTimeSeries(categoriesWithFilteredCollectives, filter.timePeriod),
    [JSON.stringify(filter)],
  );

  const currentCatWithCollectives = categoriesWithFilteredCollectives.find(category =>
    filter.tag ? category.tag === filter.tag : category.tag === 'ALL',
  );

  const stats = React.useMemo(
    () => computeStats(currentCatWithCollectives?.collectives, filter.timePeriod),
    [JSON.stringify(filter)],
  );

  const locationOptions = React.useMemo(() => getFilterOptions(allCollectives), [host.slug]);

  const [collectiveInModal, setCollectiveInModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCollectiveModal = (slug: string) => {
    const collective = allCollectives.find(c => c.slug === slug);
    setCollectiveInModal(collective);
    setIsModalOpen(true);
  };

  const { ref: collectivesRef, inView: collectivesInView } = useInView({ initialInView: true });
  const currentCategory = categories.find(category =>
    filter.tag ? category.tag === filter.tag : category.tag === 'ALL',
  );

  const setFilter = (filter: Filter) => pushFilterToRouter(filter, router);

  return (
    <div className="mx-auto flex max-w-[1440px] flex-col space-y-6 p-0 lg:mt-2 lg:space-y-10 lg:p-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-10">
        <Header
          hosts={hosts}
          categories={categories}
          host={host}
          locale={locale}
          platformTotalCollectives={platformTotalCollectives}
          filter={filter}
          setFilter={setFilter}
        />
        <InfoBox host={host} />
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4 lg:gap-10">
        <div className="sticky top-0 z-20 lg:top-10">
          <FilterArea
            filter={filter}
            setFilter={setFilter}
            categories={categories}
            collectivesInView={collectivesInView}
            currentCategory={currentCategory}
            locationOptions={locationOptions}
            locale={locale}
          />
        </div>
        <div className="space-y-12 lg:col-span-3">
          <div className="space-y-5 rounded-lg bg-white py-4 lg:mx-0 lg:py-8" ref={collectivesRef}>
            <Stats stats={stats} locale={locale} currency={currency} />
            <div className="lg:px-4">
              <Chart
                startYear={startYear}
                filter={filter}
                timeSeriesArray={series.filter(s => filter.tag === 'ALL' || filter.tag === s.tag)}
                currency={currency}
              />
            </div>
            <Table
              filter={filter}
              setFilter={setFilter}
              collectives={currentCatWithCollectives.collectives}
              locale={locale}
              openCollectiveModal={openCollectiveModal}
              currency={currency}
            />
          </div>
          <Stories stories={stories} filter={filter} openCollectiveModal={openCollectiveModal} />
          <Updates host={host} filter={filter} openCollectiveModal={openCollectiveModal} />
        </div>
      </div>
      {host.cta?.textLonger && (
        <div
          className={`order my-12 grid grid-cols-1 rounded-lg border-2 lg:grid-cols-4 lg:gap-12 ${host.styles.box} ${host.styles.border}`}
        >
          <div className="flex flex-col justify-center p-6 pt-0 lg:p-10 lg:pt-10 lg:pr-4 ">
            <a
              href={host.cta.href}
              target="_blank"
              rel="noopener noreferrer"
              className={` block rounded-full ${host.styles.button} px-3 py-3 text-center text-lg font-medium text-white lg:py-4 lg:text-xl`}
            >
              {host.cta.buttonLabel}
            </a>
          </div>
          <div className="order-first p-6 lg:order-last lg:col-span-3 lg:p-10 lg:pl-0">
            <h3 className={`text-2xl font-bold  lg:text-3xl`}>{host.cta.textLonger}</h3>
          </div>
        </div>
      )}

      <CollectiveModal
        isOpen={isModalOpen}
        collective={collectiveInModal}
        onClose={() => setIsModalOpen(false)}
        setFilter={setFilter}
        currency={currency}
      />
    </div>
  );
}
