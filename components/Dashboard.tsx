import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import styled from 'styled-components';

import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

import CategorySelect from '../components/CategorySelect';
import Chart from '../components/Chart';
import Collectives from '../components/Collectives';
import { H1, H4 } from '@opencollective/frontend-components/components/Text';

const Grid = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 640px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
    div {
      text-align: center;
      &:not(:last-child) {
        border-bottom: 1px solid #e6e8eb;
        border-right: 0 !important;
      }
    }
  }
  background: white;
  padding: 24px;
  border-radius: 8px;
  div {
    text-align: center;
    &:not(:last-child) {
      border-right: 1px solid #e6e8eb;
    }
    padding: 16px;
    p {
      font-weight: 500;
      font-size: 32px;
      margin: 0 0 12px 0;
    }
    span {
      font-size: 18px;

      margin: 0;
      display: block;
    }
  }
`;

export default function Dashboard({ categories, startYear, locale }) {
  const router = useRouter();
  const currentTag = router.query?.tag;
  const currentCategory = categories.find(category => (currentTag ? category.tag === currentTag : !category.tag));
  const { collectiveCount, totalRaised, numberOfContributions, collectives } = currentCategory?.data || {};

  return (
    <Fragment>
      <H1 px={'24px'} fontSize="30px" mt={4} mb={2}>
        Horizons
      </H1>
      <H4 px={'24px'} fontWeight="300" mb={2}>
        Trends
      </H4>
      <CategorySelect selectedCategory={router?.query?.tag} categories={categories} />
      <H4 px={'24px'} fontWeight="300" mt={4} mb={2}>
        Stats
      </H4>
      <Grid>
        <div>
          <p>{collectiveCount.toLocaleString(locale)}</p> <span>collectives</span>
        </div>
        <div>
          <p>
            {formatCurrency(totalRaised.valueInCents, totalRaised.currency, { locale, precision: 0 })}{' '}
            {totalRaised.currency}
          </p>
          <span>total raised</span>
        </div>
        <div>
          <p>{numberOfContributions.toLocaleString(locale)}</p> <span>contributions</span>
        </div>
      </Grid>
      <H4 px={'24px'} fontWeight="300" mt={4} mb={2}>
        Chart
      </H4>
      <Chart
        startYear={startYear}
        currentTag={currentTag}
        timeSeriesArray={categories
          .filter(category => (currentTag ? category.tag === currentTag : true))
          .map(category => ({
            ...category.data.totalReceivedTimeSeries,
            label: category.label,
            color: category.color,
          }))}
      />
      <H4 px={'24px'} fontWeight="300" mt={4} mb={2}>
        Collectives
      </H4>
      <Collectives collectives={collectives} />
    </Fragment>
  );
}
