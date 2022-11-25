import fs from 'fs';

import React from 'react';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import type { GetStaticProps } from 'next';
import Head from 'next/head';

import { initializeApollo } from '../lib/apollo-client';
import { getDumpByTagAndPeriod } from '../lib/getDataDump';
import getLocation from '../lib/location/getLocation';
import { getAllPosts, markdownToHtml } from '../lib/markdown';

import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

export const accountsQuery = gql`
  query SearchAccounts($hostSlug: String, $tag: [String], $dateFrom: DateTime, $dateTo: DateTime, $timeUnit: TimeUnit) {
    accounts(type: [COLLECTIVE], tag: $tag, limit: 500, host: { slug: $hostSlug }) {
      totalCount
      nodes {
        id
        name
        slug
        createdAt
        description
        imageUrl(height: 100, format: png)
        tags
        childrenAccounts {
          totalCount
        }
        admins: members(role: ADMIN) {
          totalCount
        }
        contributors: members(role: BACKER) {
          totalCount
        }
        expenses: transactions(limit: 0, type: DEBIT, dateFrom: $dateFrom, dateTo: $dateTo, hasExpense: true) {
          totalCount
        }
        stats {
          id

          balance(dateFrom: $dateFrom, dateTo: $dateTo) {
            valueInCents
            currency
          }
          totalNetAmountReceived(dateFrom: $dateFrom, dateTo: $dateTo) {
            valueInCents
            currency
          }
        }
      }
      stats {
        transactionsTimeSeries(
          dateFrom: $dateFrom
          dateTo: $dateTo
          timeUnit: $timeUnit
          type: CREDIT
          kind: [CONTRIBUTION, ADDED_FUNDS]
        ) {
          timeUnit
          nodes {
            date
            count
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

export const categories = [
  { label: 'All', tag: 'ALL', color: '#14B8A6', tc: 'teal' },
  { label: 'Mutual aid', tag: 'mutual aid', color: '#3B82F6', tc: 'blue' },
  { label: 'Civic tech', tag: 'civic tech', color: '#A855F7', tc: 'purple' },
  { label: 'Arts & culture', tag: 'arts and culture', color: '#F43F5E', tc: 'rose' },
  { label: 'Climate', tag: 'climate', extraTags: ['climate change', 'climate justice'], color: '#F59E0B', tc: 'amber' },
];

export const simpleDateToISOString = (date, isEndOfDay, timezoneType) => {
  if (!date) {
    return null;
  } else {
    const isUTC = timezoneType === 'UTC';
    const dayjsTimeMethod = isEndOfDay ? 'endOf' : 'startOf';
    const result = isUTC ? dayjs.utc(date) : dayjs(date);
    return result[dayjsTimeMethod]('day').toISOString();
  }
};

const getTimeVariables = (
  period: 'ALL' | 'PAST_YEAR' | 'PAST_QUARTER',
): { dateTo: string; dateFrom: string; timeUnit: 'WEEK' | 'MONTH' | 'YEAR' } => {
  switch (period) {
    case 'PAST_QUARTER':
      return {
        // 12 weeks ago
        dateFrom: dayjs.utc().subtract(12, 'week').startOf('week').toISOString(),
        // today
        dateTo: dayjs.utc().toISOString(),
        timeUnit: 'WEEK',
      };
    case 'PAST_YEAR':
      return {
        // 12 months ago
        dateFrom: dayjs.utc().subtract(12, 'month').startOf('month').toISOString(),
        // today
        dateTo: dayjs.utc().toISOString(),
        timeUnit: 'MONTH',
      };
    case 'ALL':
      return {
        dateFrom: dayjs.utc(`2018-01-01`).startOf('year').toISOString(),
        dateTo: dayjs.utc().endOf('year').toISOString(),
        timeUnit: 'YEAR',
      };
  }
};

const getDataForTagAndPeriod = async ({ apollo, hostSlug, category, period }) => {
  const { dateFrom, dateTo, timeUnit } = getTimeVariables(period);
  const { tag, extraTags = [] } = category;
  let data = getDumpByTagAndPeriod(tag, period);

  if (!data) {
    ({ data } = await apollo.query({
      query: accountsQuery,
      variables: {
        hostSlug,
        dateFrom,
        dateTo,
        timeUnit,
        ...(tag !== 'ALL' && { tag: [tag, ...extraTags] }),
      },
    }));

    // eslint-disable-next-line no-process-env
    if (data && process.env.NODE_ENV === 'development') {
      fs.writeFile(`_dump/${tag}-${period}.json`, JSON.stringify(data), error => {
        if (error) {
          throw error;
        }
      });
    }
  }

  const totalRaisedAmount = data.accounts.stats.transactionsTimeSeries.nodes.reduce(
    (acc, node) => {
      if (acc.currency && acc.currency !== node.amount.currency) {
        throw new Error('Mismatch in currency!');
      }
      return {
        valueInCents: acc.valueInCents + node.amount.valueInCents,
        currency: node.amount.currency,
      };
    },
    { valueInCents: 0, currency: null },
  );

  const totalContributionsCount = data.accounts.stats.transactionsTimeSeries.nodes.reduce((acc, node) => {
    return acc + node.count;
  }, 0);

  return {
    collectiveCount: data.accounts.totalCount,
    totalRaised: totalRaisedAmount,
    numberOfContributions: totalContributionsCount,
    totalReceivedTimeSeries: data.accounts.stats.transactionsTimeSeries,
    contributionsCountTimeSeries: data.accounts.stats.transactionsTimeSeries,
    dateFrom,
    dateTo,
    collectives: data.accounts.nodes.map(collective => {
      const totalDisbursed =
        collective.stats.totalNetAmountReceived.valueInCents - collective.stats.balance.valueInCents;
      const percentDisbursed = (totalDisbursed / collective.stats.totalNetAmountReceived.valueInCents) * 100;
      return {
        id: collective.id,
        name: collective.name,
        slug: collective.slug,
        description: collective.description,
        imageUrl: collective.imageUrl.replace('-staging', ''),
        location: getLocation(collective),
        totalRaised: collective.stats.totalNetAmountReceived.valueInCents,
        totalDisbursed,
        percentDisbursed,
        currency: collective.stats.totalNetAmountReceived.currency,
        subCollectivesCount: collective.childrenAccounts.totalCount,
        adminCount: collective.admins.totalCount,
        contributorsCount: collective.contributors.totalCount,
        expensesCount: collective.expenses.totalCount,
        createdAt: collective.createdAt,
        tags: collective.tags,
      };
    }),
  };
};

export const getStaticProps: GetStaticProps = async () => {
  const hostSlug = 'foundation';
  const apollo = initializeApollo();

  const categoriesWithData = await Promise.all(
    categories.map(async category => ({
      ...category,
      data: {
        ALL: await getDataForTagAndPeriod({ apollo, hostSlug, category, period: 'ALL' }),
        PAST_YEAR: await getDataForTagAndPeriod({ apollo, hostSlug, category, period: 'PAST_YEAR' }),
        PAST_QUARTER: await getDataForTagAndPeriod({ apollo, hostSlug, category, period: 'PAST_QUARTER' }),
      },
    })),
  );

  const collectivesAllData = categoriesWithData.find(c => c.tag === 'ALL').data.ALL.collectives;

  const collectivesData = collectivesAllData.reduce((acc, collective) => {
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
      categories: categoriesWithData,
      collectivesData,
      stories: storiesWithContent,
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

export default function Page({ categories, collectivesData, stories }) {
  const locale = 'en';
  return (
    <Layout>
      <Head>
        <title>Discover Open Collective Foundation</title>
      </Head>
      <Dashboard categories={categories} collectivesData={collectivesData} stories={stories} locale={locale} />
    </Layout>
  );
}
