import React from 'react';
import { gql } from '@apollo/client';
import type { GetStaticProps, GetStaticPropsContext } from 'next';
import styled from 'styled-components';
import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';

import { initializeApollo } from '../lib/apollo-client';

import CategorySelect from '../components/CategorySelect';
import Chart from '../components/Chart';
import Collectives from '../components/Collectives';
import Layout from '../components/Layout';
import { H1, H3 } from '@opencollective/frontend-components/components/Text';

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

export const accountsQuery = gql`
  query SearchAccounts($tag: [String]) {
    accounts(
      type: [COLLECTIVE, FUND]
      host: { slug: "foundation" }
      orderBy: { field: ACTIVITY, direction: DESC }
      limit: 10
      tag: $tag
    ) {
      totalCount
      nodes {
        id
        type
        name
        slug
        description
        imageUrl(height: 100, format: png)
        tags
        stats {
          totalAmountReceived(includeChildren: true) {
            valueInCents
            currency
          }
        }
        transactions(kind: CONTRIBUTION) {
          totalCount
        }
      }
    }
  }
`;

const totalReceivedTimeSeriesQuery = gql`
  query totalReceivedTimeSeries(
    $hostSlug: String!
    $dateFrom: DateTime!
    $account: [AccountReferenceInput!]
    $dateTo: DateTime!
  ) {
    host(slug: $hostSlug) {
      id
      hostMetricsTimeSeries(dateFrom: $dateFrom, dateTo: $dateTo, account: $account, timeUnit: YEAR) {
        totalReceived {
          timeUnit
          nodes {
            date
            amount {
              value
              valueInCents
              currency
            }
          }
        }
      }
    }
  }
`;

const getQueryVariables = (hostSlug, year, collectives) => {
  return {
    hostSlug,
    account: collectives?.map(collective => ({ id: collective.id })),
    dateFrom: `2015-01-01T00:00:00Z`,
    dateTo: `${new Date().getUTCFullYear()}-12-31T23:59:59Z`,
  };
};

const Grid = styled.div`
  display: grid;
  flex: 1;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  @media (max-width: 640px) {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
  background: white;
  padding: 32px;
  border-radius: 8px;
  div {
    text-align: center;
    &:not(:last-child) {
      border-right: 1px solid #e6e8eb;
    }
    padding: 0 16px;
    p {
      font-weight: 500;
      font-size: 20px;
      margin: 0 0 12px 0;
    }
    span {
      margin: 0;
      display: block;
    }
  }
`;

export const categories = [
  { label: 'All trends' },
  { label: 'Arts + Culture', tag: 'arts and culture' },
  { label: 'Mutual aid', tag: 'mutual aid' },
  { label: 'Open source', tag: 'open source' },
  { label: 'Climate change', tag: 'climate' },
];

export const getStaticProps: GetStaticProps = async (context: GetStaticPropsContext) => {
  const client = initializeApollo();
  const tag = context.params?.tag;
  const { data } = await client.query({ query: accountsQuery, ...(tag && { variables: { tag: [tag] } }) });
  const totalRaised = data.accounts.nodes.reduce(
    (acc, account) => {
      if (acc.currency && acc.currency !== account.stats.totalAmountReceived.currency) {
        throw new Error('Non-USD currency found');
      }
      return {
        valueInCents: acc.valueInCents + account.stats.totalAmountReceived.valueInCents,
        currency: account.stats.totalAmountReceived.currency,
      };
    },
    { valueInCents: 0, currency: null },
  );

  const { data: timeSeriesData } = await client.query({
    query: totalReceivedTimeSeriesQuery,
    variables: getQueryVariables('foundation', 2020, data.accounts.nodes),
  });

  return {
    props: {
      collectiveCount: data.accounts.totalCount,
      totalRaised,
      numberOfContributions: data.accounts.nodes.reduce((acc, node) => {
        return acc + node.transactions.totalCount;
      }, 0),
      category: tag ?? null,
      collectives: data.accounts.nodes,
      totalReceivedTimeSeries: timeSeriesData?.host?.hostMetricsTimeSeries?.totalReceived ?? null,
    },
    revalidate: 60 * 60 * 24, // 1 day
  };
};

export default function Page({
  totalRaised,
  collectiveCount,
  numberOfContributions,
  category,
  totalReceivedTimeSeries,
  collectives,
}) {
  const locale = 'en-US';
  return (
    <Layout>
      <H1 fontSize="30px" mt={4}>
        Horizons
      </H1>
      <H3 fontWeight="300" mb={2}>
        Trends
      </H3>
      <CategorySelect selectedCategory={category} categories={categories} />
      <H3 fontWeight="300" mt={4} mb={2}>
        Stats
      </H3>
      <Grid>
        <div>
          <p>{collectiveCount.toLocaleString(locale)}</p> <span>collectives</span>
        </div>
        <div>
          <p>
            {formatCurrency(totalRaised.valueInCents, totalRaised.currency, { locale, precision: 0 })}{' '}
            {totalRaised.currency}
          </p>{' '}
          <span>total raised</span>
        </div>
        <div>
          <p>{numberOfContributions.toLocaleString(locale)}</p> <span>contributions</span>
        </div>
      </Grid>
      <H3 fontWeight="300" mt={4} mb={2}>
        Chart
      </H3>
      <Chart timeSeries={totalReceivedTimeSeries} />
      <H3 fontWeight="300" mt={4} mb={2}>
        Collectives
      </H3>
      <Collectives collectives={collectives} />
    </Layout>
  );
}
