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

const colors = [
  { tw: 'red', color: '#EF4444' },
  { tw: 'orange', color: '#F97316' },
  { tw: 'amber', color: '#F59E0B' },
  { tw: 'yellow', color: '#EAB308' },
  { tw: 'lime', color: '#84CC16' },
  { tw: 'green', color: '#22C55E' },
  { tw: 'emerald', color: '#10B981' },
  { tw: 'teal', color: '#14B8A6' },
  { tw: 'cyan', color: '#06B6D4' },
  { tw: 'sky', color: '#0EA5E9' },
  { tw: 'blue', color: '#3B82F6' },
  { tw: 'indigo', color: '#6366F1' },
  { tw: 'violet', color: '#8B5CF6' },
  { tw: 'purple', color: '#A855F7' },
  { tw: 'fuchsia', color: '#D946EF' },
  { tw: 'pink', color: '#EC4899' },
  { tw: 'rose', color: '#F43F5E' },
];

const pickColorForCategory = (startColor: string, i: number, numOfCategories: number) => {
  const startColorIndex = colors.findIndex(c => c.tw === startColor);
  const step = Math.floor(colors.length / numOfCategories);
  return colors[(startColorIndex + i * step) % colors.length];
};

export const hosts = [
  {
    name: 'Open Collective Foundation',
    slug: 'foundation',
    currency: 'USD',
    startYear: 2018,
    logoSrc: '/ocf-logo.svg',
    color: 'teal',
    brandColor: '#044F54',
    cta: {
      text: 'Contribute to many collectives at once',
      buttonLabel: 'Contribute',
      buttonHref: 'https://opencollective.com/solidarity-economy-fund',
    },
    categories: [
      { label: 'Mutual aid', tag: 'mutual aid' },
      { label: 'Education', tag: 'education' },
      { label: 'Civic Tech', tag: 'civic tech' },
      { label: 'Food', tag: 'food' },
      { label: 'Arts & Culture', tag: 'arts and culture' },
      {
        label: 'Climate',
        tag: 'climate',
        extraTags: ['climate change', 'climate justice'],
      },
    ],
  },
  {
    name: 'Open Source Collective',
    slug: 'opensource',
    currency: 'USD',
    startYear: 2016,
    logoSrc: '/osc-logo.svg',
    website: 'https://opencollective.com/opensource',
    color: 'purple',
    categories: [
      // { label: 'Open source', tag: 'open source', extraTags: ['opensource'] },
      // { label: 'Javascript', tag: 'javascript', extraTags: ['nodejs', 'typescript'] },
      // { label: 'React', tag: 'react' },
      // { label: 'Python', tag: 'python' },
      // { label: 'PHP', tag: 'php' },
    ],
    disabled: true,
  },
  {
    name: 'Open Collective Europe',
    slug: 'europe',
    currency: 'EUR',
    startYear: 2019,
    logoSrc: '/oce-logo.svg',
    color: 'yellow',
    categories: [],
    disabled: true,
  },
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

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const hostSlug: string = Array.isArray(params.slug) ? params.slug[0] : params.slug;
  const host = hosts.find(h => h.slug === hostSlug);

  const { currency } = host;
  const startYear = 2018;
  const apollo = initializeApollo();
  const { collectives } = await getDataForHost({ apollo, hostSlug, currency });

  const collectivesData = collectives.reduce((acc, collective) => {
    acc[collective.slug] = collective;
    return acc;
  }, {});

  // add color to categories
  const categories = [{ label: 'All Categories', tag: 'ALL' }, ...host.categories].map((category, i, arr) => {
    const { color, tw } = pickColorForCategory(host.color, i, arr.length);

    return {
      ...category,
      color,
      tw,
    };
  });

  const allStories = getAllPosts(hostSlug, ['title', 'content', 'tags', 'location', 'slug', 'video', 'collectiveSlug']);
  // run markdownToHtml on content in stories
  const storiesWithContent = await Promise.all(
    allStories.map(async story => {
      return {
        ...story,
        tags: story.tags.map(tag => ({ color: categories.find(c => c.tag === tag)?.color ?? null, tag: tag })),
        content: await markdownToHtml(story.content),
        collective: collectivesData[story.collectiveSlug] ?? null,
      };
    }),
  );

  return {
    props: {
      host,
      hosts,
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
    paths: hosts.filter(h => !h.disabled).map(host => ({ params: { slug: host.slug } })),
    fallback: false,
  };
}

export default function Page({ categories, collectivesData, stories, host, hosts, collectives, currency, startYear }) {
  const locale = 'en';
  return (
    <Layout>
      <Head>
        <title>Discover {host.name}</title>
      </Head>
      <Dashboard
        categories={categories}
        collectives={collectives}
        currency={currency}
        startYear={startYear}
        collectivesData={collectivesData}
        stories={stories}
        locale={locale}
        host={host}
        hosts={hosts}
      />
    </Layout>
  );
}
