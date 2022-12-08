import fs from 'fs';

import React from 'react';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import type { GetStaticProps } from 'next';
import Head from 'next/head';

import { initializeApollo } from '../lib/apollo-client';
import { getDump } from '../lib/getDataDump';
import getLocation from '../lib/location/getLocation';
import { getAllPosts, markdownToHtml } from '../lib/markdown';

import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

export const accountsQuery = gql`
  query SearchAccounts($hostSlug: String, $quarterAgo: DateTime, $yearAgo: DateTime, $currency: Currency) {
    accounts(type: [COLLECTIVE, FUND], limit: 5000, host: { slug: $hostSlug }) {
      totalCount
      nodes {
        id
        name
        slug
        createdAt
        description
        imageUrl(height: 100, format: png)
        tags

        ALL_stats: stats {
          contributorsCount(includeChildren: true)
          contributionsCount(includeChildren: true)

          totalAmountSpent(includeChildren: true, currency: $currency) {
            valueInCents
            currency
          }

          totalNetAmountReceivedTimeSeries(timeUnit: YEAR, includeChildren: true, currency: $currency) {
            timeUnit
            nodes {
              date
              amount {
                valueInCents
                currency
              }
            }
          }
        }

        PAST_YEAR_stats: stats {
          contributorsCount(includeChildren: true, dateFrom: $yearAgo)
          contributionsCount(includeChildren: true, dateFrom: $yearAgo)

          totalAmountSpent(includeChildren: true, dateFrom: $yearAgo, currency: $currency) {
            valueInCents
            currency
          }
          totalNetAmountReceivedTimeSeries(
            dateFrom: $yearAgo
            timeUnit: MONTH
            includeChildren: true
            currency: $currency
          ) {
            timeUnit
            nodes {
              date
              amount {
                valueInCents
                currency
              }
            }
          }
        }

        PAST_QUARTER_stats: stats {
          contributorsCount(includeChildren: true, dateFrom: $quarterAgo)
          contributionsCount(includeChildren: true, dateFrom: $quarterAgo)

          totalAmountSpent(includeChildren: true, dateFrom: $quarterAgo, currency: $currency) {
            valueInCents
            currency
          }

          totalNetAmountReceivedTimeSeries(
            dateFrom: $quarterAgo
            timeUnit: WEEK
            includeChildren: true
            currency: $currency
          ) {
            timeUnit
            nodes {
              date
              amount {
                valueInCents
                currency
              }
            }
          }
        }
      }
    }
  }
`;

export const categories = [
  { label: 'All', tag: 'ALL', color: '#14B8A6', tc: 'teal' },
  { label: 'Mutual aid', tag: 'mutual aid', color: '#3B82F6', tc: 'blue' },
  { label: 'Civic Tech', tag: 'civic tech', color: '#A855F7', tc: 'purple' },
  { label: 'Arts & Culture', tag: 'arts and culture', color: '#F43F5E', tc: 'rose' },
  { label: 'Climate', tag: 'climate', extraTags: ['climate change', 'climate justice'], color: '#F59E0B', tc: 'amber' },
];

const getTotalStats = stats => {
  const totalNetAmountReceived = stats.totalNetAmountReceivedTimeSeries.nodes.reduce(
    (acc, node) => {
      return {
        valueInCents: acc.valueInCents + node.amount.valueInCents,
        currency: node.amount.currency,
      };
    },
    { valueInCents: 0 },
  );
  const totalSpent = {
    valueInCents: Math.abs(stats.totalAmountSpent.valueInCents),
    currency: stats.totalAmountSpent.currency,
  };
  const percentDisbursed = (totalSpent.valueInCents / totalNetAmountReceived.valueInCents) * 100;

  return {
    contributors: stats.contributorsCount,
    contributions: stats.contributionsCount,
    totalSpent,
    totalNetRaised: totalNetAmountReceived,
    percentDisbursed,
    totalNetRaisedTimeSeries: stats.totalNetAmountReceivedTimeSeries.nodes,
  };
};

const getDataForHost = async ({ apollo, hostSlug, currency }) => {
  let data = getDump(hostSlug);

  if (!data) {
    ({ data } = await apollo.query({
      query: accountsQuery,
      variables: {
        hostSlug,
        quarterAgo: dayjs.utc().subtract(12, 'week').startOf('isoWeek').toISOString(),
        yearAgo: dayjs.utc().subtract(12, 'month').startOf('month').toISOString(),
        currency,
      },
    }));

    // eslint-disable-next-line no-process-env
    if (data && process.env.NODE_ENV === 'development') {
      fs.writeFile(`_dump/${hostSlug}.json`, JSON.stringify(data), error => {
        if (error) {
          throw error;
        }
      });
    }
  }

  const collectives = data.accounts.nodes.map(collective => {
    return {
      id: collective.id,
      name: collective.name,
      slug: collective.slug,
      description: collective.description,
      imageUrl: collective.imageUrl.replace('-staging', ''),
      location: getLocation(collective),
      tags: collective.tags,
      createdAt: collective.createdAt,
      stats: {
        ALL: getTotalStats(collective.ALL_stats),
        PAST_YEAR: getTotalStats(collective.PAST_YEAR_stats),
        PAST_QUARTER: getTotalStats(collective.PAST_QUARTER_stats),
      },
    };
  });

  return {
    collectives,
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const hostSlug = 'foundation';
  const currency = 'USD';
  const startYear = 2018;
  const apollo = initializeApollo();
  const { collectives } = await getDataForHost({ apollo, hostSlug, currency });
  const collectivesData = collectives.reduce((acc, collective) => {
    acc[collective.slug] = collective;
    return acc;
  }, {});

  const allStories = getAllPosts(['title', 'content', 'tags', 'location', 'slug', 'video']);
  // run markdownToHtml on content in stories

  const storiesWithContent = await Promise.all(
    allStories.map(async story => {
      return {
        ...story,
        tags: story.tags.map(tag => ({ color: categories.find(c => c.tag === tag)?.color ?? null, tag: tag })),
        content: await markdownToHtml(story.content),
      };
    }),
  );

  return {
    props: {
      collectives,
      categories,
      collectivesData,
      stories: storiesWithContent,
      startYear,
      currency,
    },
    revalidate: 60 * 60 * 24, // Revalidate the static page at most once every 24 hours to not overload the API
  };
};

export async function getStaticPaths() {
  return {
    paths: [{ params: { slug: 'foundation' } }],
    fallback: false,
  };
}

export default function Page({ categories, collectivesData, stories, collectives, currency, startYear }) {
  const locale = 'en';
  return (
    <Layout>
      <Head>
        <title>Discover Open Collective Foundation</title>
      </Head>
      <Dashboard
        categories={categories}
        collectives={collectives}
        collectivesData={collectivesData}
        currency={currency}
        stories={stories}
        locale={locale}
        startYear={startYear}
      />
    </Layout>
  );
}
