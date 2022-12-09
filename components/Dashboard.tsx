import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';

import { computeTimeSeries } from '../lib/computeData';
import filterLocation, { LocationFilter } from '../lib/location/filterLocation';

import Chart from './Chart';
import CollectiveModal from './CollectiveModal';
import FilterArea from './FilterArea';
import HostSwitcher from './HostSwitcher';
import Stats from './Stats';
import Stories from './Stories';
import Table from './Table';
import Updates from './Updates';

const getParam = param => (Array.isArray(param) ? param[0] : param);

const getLocationFilter = query => {
  const location = getParam(query?.location);
  const locationType = getParam(query?.locationType);
  return location && locationType ? { value: location, type: locationType } : null;
};

export default function Dashboard({
  host,
  hosts,
  categories,
  collectives,
  collectivesData,
  stories,
  locale,
  currency,
  startYear,
}) {
  const router = useRouter();
  const currentTag: string = getParam(router.query?.tag) ?? 'ALL';
  const currentTimePeriod: string = getParam(router.query?.time) ?? 'ALL';
  const currentLocationFilter: LocationFilter = getLocationFilter(router.query);

  const setTag = (value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, tag, ...rest } = router.query;
    router.push(
      { pathname: '/foundation', query: { ...rest, ...(value !== 'ALL' && tag !== value && { tag: value }) } },
      null,
      {
        shallow: true,
      },
    );
  };

  const setTimePeriod = (value: string) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, time, ...rest } = router.query;
    router.push(
      {
        pathname: '/foundation',
        query: { ...rest, ...(value !== 'ALL' && { time: value }) },
      },
      null,
      {
        shallow: true,
      },
    );
  };

  const setLocationFilter = (locationFilter: LocationFilter) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { slug, location, locationType, ...rest } = router.query;
    router.push(
      {
        pathname: '/foundation',
        query: {
          ...rest,
          ...(locationFilter && { location: locationFilter.value, locationType: locationFilter.type }),
        },
      },
      null,
      {
        shallow: true,
      },
    );
  };

  const [collectiveInModal, setCollectiveInModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCollectiveModal = (slug: string) => {
    setCollectiveInModal(collectivesData[slug]);
    setIsModalOpen(true);
  };

  const collectivesDataContainer = useRef(null);
  const [hideFilters, setHideFilters] = useState(false);

  const handleScroll = () => {
    const { bottom } = collectivesDataContainer.current.getBoundingClientRect();
    // hide extra filters only related to collectives data
    if (bottom < 400) {
      setHideFilters(true);
    } else {
      setHideFilters(false);
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const locationFilteredCollectives = React.useMemo(
    () => filterLocation(collectives, currentLocationFilter),
    [currentLocationFilter],
  );

  const categoriesWithCollectives = categories.map(category => {
    const collectivesInCategory = locationFilteredCollectives.filter(
      collective =>
        category.tag === 'ALL' ||
        collective.tags?.includes(category.tag) ||
        category.extraTags?.filter(tag => collective.tags?.includes(tag)).length > 0,
    );
    return {
      ...category,
      collectives: collectivesInCategory,
    };
  });

  const currentCategory = categoriesWithCollectives.find(category =>
    currentTag ? category.tag === currentTag : !category.tag,
  );

  const timeSeries = React.useMemo(() => computeTimeSeries(categoriesWithCollectives), [currentLocationFilter]);

  const totalCollectiveCount = collectives.length;

  const hostStyles = {
    button: { foundation: 'bg-ocf-brand text-white' },
    ctaBox: { foundation: 'lg:bg-[#F7FEFF] text-ocf-brand' },
  };
  return (
    <div className="mx-auto mt-2 flex max-w-[1400px] flex-col space-y-6 p-4 lg:space-y-10 lg:p-10">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4 lg:gap-10">
        <div className="w-full rounded-lg p-2 lg:col-span-3 lg:bg-white lg:p-12">
          <h1 className="text-[24px] font-bold leading-tight text-[#111827] lg:text-[40px]">
            Discover {totalCollectiveCount.toLocaleString(locale)} collectives hosted by{' '}
            <HostSwitcher host={host} hosts={hosts} /> making an impact in{' '}
            <span className="">
              {categories
                .filter(c => c.tag !== 'ALL')
                .map((cat, i, arr) => (
                  <React.Fragment key={cat.label}>
                    <span className="whitespace-nowrap">
                      <button
                        className={`inline-block whitespace-nowrap underline underline-offset-4 transition-colors ${
                          currentTag !== 'ALL' && currentTag !== cat.tag
                            ? `decoration-transparent hover:decoration-${cat.tw}-500`
                            : `decoration-${cat.tw}-500`
                        }`}
                        onClick={() => setTag(cat.tag)}
                      >
                        {cat.label.toLowerCase()}
                      </button>
                      {arr.length - 1 === i ? '' : ','}
                    </span>
                    {` `}
                  </React.Fragment>
                ))}
            </span>
            and more.
          </h1>
        </div>
        <div
          className={`flex flex-col items-center justify-center px-2 lg:rounded-lg lg:p-10 ${
            hostStyles.ctaBox[host.slug]
          }`}
        >
          <img src={host.logoSrc} alt={host.name} className="hidden h-8 lg:block" />

          <p className={`my-4 hidden text-center font-medium lg:block`}>
            {host.cta?.text ?? `Learn more about ${host.name}`}
          </p>
          <a
            href={host.cta?.buttonHref ?? host.website}
            target="_blank"
            rel="noopener noreferrer"
            className={`block w-full rounded-full lg:rounded-full ${
              hostStyles.button[host.slug]
            } px-3 py-3 text-center text-sm font-medium lg:text-lg`}
          >
            <span className="hidden lg:inline-block">{host.cta?.buttonLabel ?? 'Learn more'}</span>
            <span className="inline-block lg:hidden">{host.cta?.text}</span>
          </a>
        </div>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-4 lg:gap-10">
        <div className="sticky top-4 z-20 lg:top-10">
          <FilterArea
            currentTimePeriod={currentTimePeriod}
            currentTag={currentTag}
            categories={categoriesWithCollectives}
            collectives={collectives}
            currentLocationFilter={currentLocationFilter}
            setLocationFilter={setLocationFilter}
            setTimePeriod={setTimePeriod}
            setTag={setTag}
            hideFilters={hideFilters}
          />
        </div>
        <div className="space-y-12 lg:col-span-3">
          <div className="-mx-4 space-y-5 rounded-lg bg-white py-4 lg:mx-0 lg:py-8" ref={collectivesDataContainer}>
            <Stats
              currentCategory={currentCategory}
              currentTag={currentTag}
              currentLocationFilter={currentLocationFilter}
              currentTimePeriod={currentTimePeriod}
              locale={locale}
              currency={currency}
            />
            <div className="lg:px-4">
              <Chart
                startYear={startYear}
                currentTag={currentTag}
                currentTimePeriod={currentTimePeriod}
                currentLocationFilter={currentLocationFilter}
                timeSeriesArray={timeSeries[currentTimePeriod].filter(category =>
                  currentTag === 'ALL' ? true : category.tag === currentTag,
                )}
              />
            </div>
            <Table
              collectives={currentCategory.collectives}
              currentTimePeriod={currentTimePeriod}
              currentTag={currentTag}
              currentLocationFilter={currentLocationFilter}
              setLocationFilter={setLocationFilter}
              locale={locale}
              openCollectiveModal={openCollectiveModal}
              hostSlug={host.slug}
              currency={currency}
            />
          </div>
          <Stories stories={stories} currentTag={currentTag} openCollectiveModal={openCollectiveModal} />
          <Updates host={host} currentTag={currentTag} openCollectiveModal={openCollectiveModal} />
        </div>
      </div>
      <div>
        <div className="order my-12 grid grid-cols-1 rounded-lg border-2 border-teal-500 bg-[#F7FEFF] lg:grid-cols-4 lg:gap-12">
          <div className="flex flex-col justify-center p-6 pt-0 lg:p-10 lg:pt-10 lg:pr-4 ">
            <a
              href={host.cta.buttonHref}
              target="_blank"
              rel="noopener noreferrer"
              className=" block rounded-full bg-[#044F54] px-3 py-3 text-center text-lg font-medium text-white lg:py-4 lg:text-xl"
            >
              {host.cta.buttonLabel}
            </a>
          </div>
          <div className="order-first p-6 lg:order-last lg:col-span-3 lg:p-10 lg:pl-0">
            <h3 className="text-2xl font-bold text-teal-800 lg:text-3xl">
              Contribute to a pooled fund to benefit multiple collectives within Open Collective Foundation
            </h3>{' '}
            <div className="flex justify-end"> </div>
          </div>
        </div>
      </div>
      <CollectiveModal
        isOpen={isModalOpen}
        collective={collectiveInModal}
        onClose={() => setIsModalOpen(false)}
        setLocationFilter={setLocationFilter}
      />
    </div>
  );
}
