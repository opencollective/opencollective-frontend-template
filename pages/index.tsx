// import fs from 'fs';

import React from 'react';
import { gql } from '@apollo/client';
import type { GetStaticProps } from 'next';

import { initializeApollo } from '../lib/apollo-client';

import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

// import categoriesDataDump from '../categoriesDataDump.json';

export const accountsQuery = gql`
  query SearchAccounts($tag: [String]) {
    accounts(
      type: [COLLECTIVE, FUND]
      host: { slug: "foundation" }
      orderBy: { field: ACTIVITY, direction: DESC }
      limit: 1500
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

const getQueryVariables = (hostSlug, startYear, collectives) => {
  return {
    hostSlug,
    account: collectives?.map(collective => ({ id: collective.id })),
    dateFrom: `${startYear}-01-01T00:00:00Z`,
    dateTo: `${new Date().getUTCFullYear()}-12-31T23:59:59Z`,
  };
};

export const categories = [
  { label: 'All trends', tag: null, color: '#725fed' },
  { label: 'Arts + Culture', tag: 'arts and culture', color: '#F94892' },
  { label: 'Mutual aid', tag: 'mutual aid', color: '#FF7F3F' },
  { label: 'Open source', tag: 'open source', color: '#FBDF07' },
  { label: 'Climate change', tag: 'climate', color: '#89CFFD' },
];

const getDataForTag = async ({ apollo, hostSlug, tag, startYear }) => {
  const { data } = await apollo.query({ query: accountsQuery, ...(tag && { variables: { tag: [tag] } }) });
  const totalRaised = data.accounts.nodes.reduce(
    (acc, account) => {
      if (acc.currency && acc.currency !== account.stats.totalAmountReceived.currency) {
        throw new Error('Mismatch in currency!');
      }
      return {
        valueInCents: acc.valueInCents + account.stats.totalAmountReceived.valueInCents,
        currency: account.stats.totalAmountReceived.currency,
      };
    },
    { valueInCents: 0, currency: null },
  );

  // fetch 200 acconts at a time
  const accounts = data.accounts.nodes;
  const accountChunks = [];
  for (let i = 0; i < accounts.length; i += 200) {
    accountChunks.push(accounts.slice(i, i + 200));
  }
  const timeSeriesDataChunked = await Promise.all(
    accountChunks.map(async chunk => {
      const { data } = await apollo.query({
        query: totalReceivedTimeSeriesQuery,
        variables: getQueryVariables(hostSlug, startYear, chunk),
      });
      return data.host.hostMetricsTimeSeries.totalReceived;
    }),
  );

  // put timeSeriesData into a single array
  const timeSeries = timeSeriesDataChunked.reduce((acc, timeSeries) => {
    timeSeries.nodes.forEach(node => {
      const existingNode = acc.find(n => n.date === node.date);
      if (existingNode) {
        acc[acc.indexOf(existingNode)] = {
          ...existingNode,
          amount: {
            ...existingNode.amount,
            value: existingNode.amount.value + node.amount.value,
            valueInCents: existingNode.amount.valueInCents + node.amount.valueInCents,
          },
        };
      } else {
        acc.push(node);
      }
    });

    return acc;
  }, []);

  // sort timeSeries by date
  const sortedTimeSeries = [...timeSeries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  const totalReceivedTimeSeries = {
    nodes: sortedTimeSeries,
    timeUnit: timeSeriesDataChunked[0]?.timeUnit,
  };

  return {
    collectiveCount: data.accounts.totalCount,
    totalRaised,
    numberOfContributions: data.accounts.nodes.reduce((acc, node) => {
      return acc + node.transactions.totalCount;
    }, 0),
    collectives: data.accounts.nodes,
    totalReceivedTimeSeries: totalReceivedTimeSeries,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const hostSlug = 'foundation';
  const startYear = 2018;
  const apollo = initializeApollo();

  // Use a data dump in development, to not overload the API with expensive queries
  // const categoriesWithData = categoriesDataDump;

  const categoriesWithData = await Promise.all(
    categories.map(async category => ({
      ...category,
      data: await getDataForTag({ apollo, hostSlug, tag: category.tag, startYear }),
    })),
  );

  // use this line to write a new data dump, if the query changes
  // fs.writeFile('categoriesDataDump.json', JSON.stringify(categoriesWithData), error => {
  //   if (error) throw error;
  // });

  return {
    props: {
      categories: categoriesWithData,
      startYear,
    },
    revalidate: 60 * 60 * 24, // Revalidate the static page at most once every 24 hours to not overload the API
  };
};

export default function Page({ categories, startYear }) {
  const locale = 'en';

  return (
    <Layout>
      <Dashboard categories={categories} startYear={startYear} locale={locale} />
    </Layout>
  );
}
