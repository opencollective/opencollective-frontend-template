import React, { useState } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

import Chart from './Chart';
import CollectiveModal from './CollectiveModal';
import FilterArea from './FilterArea';
import Stories from './Stories';
import Table from './Table';
import Updates from './Updates';

const Metric = styled.div`
  text-align: center;
  &:not(:last-child) {
    border-right: 1px solid #e6e8eb;
  }
  p {
    font-weight: 500;
    font-size: 28px;
    margin: 0 0 2px 0;
  }
  span {
    font-size: 18px;
    color: #374151;
    margin: 0;
    display: block;
  }
`;

const getParam = param => (Array.isArray(param) ? param[0] : param);

export default function Dashboard({ categories, collectivesData, stories, locale }) {
  const router = useRouter();
  const currentTag = getParam(router.query?.tag) ?? 'ALL';
  const currentTimePeriod = getParam(router.query?.time) ?? 'ALL';

  const [currentLocationFilter, setCurrentLocationFilter] = useState(JSON.stringify({ label: 'All', value: '' }));
  const [collectiveInModal, setCollectiveInModal] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openCollectiveModal = (slug: string) => {
    setCollectiveInModal(collectivesData[slug]);
    setIsModalOpen(true);
  };

  const currentCategory = categories.find(category => (currentTag ? category.tag === currentTag : !category.tag));
  const { collectiveCount, totalRaised, numberOfContributions, collectives } =
    currentCategory?.data[currentTimePeriod] || {};
  const totalCollectiveCount = categories[0].data.ALL.collectiveCount;
  return (
    <div className="mx-auto mt-4 flex max-w-[1400px] flex-col space-y-10 p-10">
      <div className="grid grid-cols-4 gap-10">
        <div className="col-span-3 w-full rounded-lg bg-white p-12">
          <h1 className=" text-[40px] font-bold leading-tight text-[#111827]">
            Discover {totalCollectiveCount.toLocaleString(locale)} collectives making an impact in{' '}
            {categories
              .filter(c => c.tag !== 'ALL')
              .map((cat, i, arr) => (
                <React.Fragment key={cat.label}>
                  <span className={`whitespace-nowrap underline underline-offset-4 decoration-${cat.tc}-500`}>
                    {cat.label.toLowerCase()}
                  </span>
                  {arr.length - 1 === i ? '' : ', '}
                </React.Fragment>
              ))}{' '}
            and more
          </h1>
        </div>
        <div className="flex flex-col items-center justify-center rounded-lg  bg-[#F7FEFF] p-12">
          <img src="/ocf-logo.svg" alt="OCF Logotype" className="h-10" />
          <a
            href="https://opencollective.com/solidarity-economy-fund"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 block w-full rounded-full bg-[#044F54] px-3 py-2.5 text-center text-lg font-medium text-white"
          >
            Contribute
          </a>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-10">
        <div>
          <FilterArea
            currentTimePeriod={currentTimePeriod}
            currentTag={currentTag}
            categories={categories}
            collectives={collectives}
            currentLocationFilter={currentLocationFilter}
            setCurrentLocationFilter={setCurrentLocationFilter}
          />
        </div>
        <div className="col-span-3 space-y-12">
          <div className="space-y-5 rounded-lg bg-white py-8">
            <div className="-mb-2 grid grid-cols-3 px-8">
              <Metric>
                <p>{collectiveCount.toLocaleString(locale)}</p>
                <span>Collectives</span>
              </Metric>
              <Metric>
                <p>{formatCurrency(totalRaised.valueInCents, totalRaised.currency, { locale, precision: 0 })}</p>
                <span>Total raised</span>
              </Metric>
              <Metric>
                <p>{numberOfContributions.toLocaleString(locale)}</p>
                <span>Contributions</span>
              </Metric>
            </div>
            <div className="px-8">
              <Chart
                startYear={2018}
                currentTag={currentTag}
                currentTimePeriod={currentTimePeriod}
                type={'amount'}
                timeSeriesArray={categories
                  .filter(category => (currentTag === 'ALL' ? true : category.tag === currentTag))
                  .map(category => ({
                    ...category.data[currentTimePeriod].totalReceivedTimeSeries,
                    label: category.label,
                    color: category.color,
                  }))}
              />
            </div>
            <Table
              collectives={collectives}
              currentTimePeriod={currentTimePeriod}
              currentTag={currentTag}
              currentLocationFilter={currentLocationFilter}
              locale={locale}
              openCollectiveModal={openCollectiveModal}
            />
          </div>
          <Stories stories={stories} currentTag={currentTag} />
          <Updates currentTag={currentTag} openCollectiveModal={openCollectiveModal} />
        </div>
      </div>
      <div>
        <div className="my-12 grid grid-cols-4 gap-12 rounded-lg border-2 border-teal-500 bg-[#F7FEFF]">
          <div className="flex flex-col justify-center p-10 pr-4">
            <a
              href="https://opencollective.com/solidarity-economy-fund"
              target="_blank"
              rel="noopener noreferrer"
              className=" block rounded-full bg-[#044F54] px-3 py-4 text-center text-xl font-medium text-white"
            >
              Contribute
            </a>
          </div>
          <div className="col-span-3 p-10 pl-0">
            <h3 className="text-3xl font-bold text-teal-800">
              Contribute to a pooled fund to benefit multiple collectives within Open Collective Foundation
            </h3>{' '}
            <div className="flex justify-end"> </div>
          </div>
        </div>
      </div>
      <CollectiveModal isOpen={isModalOpen} collective={collectiveInModal} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
