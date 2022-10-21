import React from 'react';
import { gql } from '@apollo/client';
import dayjs from 'dayjs';
import { uniqBy } from 'lodash';
import type { NextPageContext } from 'next';

import { initializeApollo } from '../../lib/apollo-client';

import Layout from '../../components/Layout';

enum TimeScale {
  month = 'month',
  year = 'year',
}

const formatAmount = ({ value, currency }) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(value);
};

const funderQuery = gql`
  query account(
    $slug: String
    $firstDayOfMonth: DateTime
    $firstDayOfPastMonth: DateTime
    $firstDayOfPreviousMonth: DateTime
  ) {
    account(slug: $slug) {
      slug
      name
      memberOf(role: BACKER, orderBy: { field: TOTAL_CONTRIBUTED, direction: DESC }) {
        nodes {
          id
          account {
            slug
            name
            stats {
              totalAmountReceivedPastMonth: totalAmountReceived(
                dateFrom: $firstDayOfPastMonth
                dateTo: $firstDayOfMonth
                includeChildren: true
              ) {
                value
                currency
              }
              totalAmountSpentPastMonth: totalAmountSpent(
                dateFrom: $firstDayOfPastMonth
                dateTo: $firstDayOfMonth
                includeChildren: true
              ) {
                value
                currency
              }
              totalAmountReceivedPreviousMonth: totalAmountReceived(
                dateFrom: $firstDayOfPreviousMonth
                dateTo: $firstDayOfPastMonth
                includeChildren: true
              ) {
                value
                currency
              }
              totalAmountSpentPreviousMonth: totalAmountSpent(
                dateFrom: $firstDayOfPreviousMonth
                dateTo: $firstDayOfPastMonth
                includeChildren: true
              ) {
                value
                currency
              }
              balance(includeChildren: true) {
                value
                currency
              }
              activeMonthlyRecurringContributions: activeRecurringContributionsV2(frequency: MONTHLY) {
                value
                currency
              }
              activeYearlyRecurringContributions: activeRecurringContributionsV2(frequency: YEARLY) {
                value
                currency
              }
            }
          }
          totalDonations {
            value
            currency
          }
        }
      }
    }
  }
`;

export async function getServerSideProps(context: NextPageContext) {
  const client = initializeApollo({ context });

  let scale: TimeScale = TimeScale.year;
  if (context.query.scale === 'month') {
    scale = TimeScale.month;
  }

  const { data } = await client.query({
    query: funderQuery,
    variables: {
      slug: context.query.slug,
      firstDayOfMonth: dayjs().startOf(scale),
      firstDayOfPastMonth: dayjs().subtract(1, scale).startOf(scale),
      firstDayOfPreviousMonth: dayjs().subtract(2, scale).startOf(scale),
    },
  });

  return {
    props: {
      account: data.account,
      scale,
    },
  };
}

const makeDiff = (afterValue, beforeValue) => {
  if (afterValue === 0 || beforeValue === 0 || afterValue === beforeValue) {
    return '';
  }
  const sign = Math.abs(afterValue) > Math.abs(beforeValue) ? '+' : '';
  return `${sign + Math.round(((afterValue - beforeValue) / beforeValue) * 100)}%`;
};

const calculateRecurring = (node, scale) => {
  let recurring;
  if (scale === 'year') {
    recurring = { ...node.account.stats.activeYearlyRecurringContributions };
    if (node.account.stats.activeYearlyRecurringContributions) {
      recurring.value += Math.round(node.account.stats.activeMonthlyRecurringContributions.value * 12);
    }
  } else {
    recurring = { ...node.account.stats.activeMonthlyRecurringContributions };
    if (node.account.stats.activeYearlyRecurringContributions) {
      recurring.value += Math.round(node.account.stats.activeYearlyRecurringContributions.value / 12);
    }
  }

  return recurring;
};

export default function ApolloSsrPage({ account = null, scale }) {
  return (
    <Layout>
      <h1>Funders Dashboard</h1>

      <p>
        Funder: <a href={`https://opencollective.com/${account.slug}`}>{account.name}</a>
      </p>

      <table style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>Collective</th>
            <th>Contributed</th>
            <th>Received past {scale}</th>
            <th>Spent past {scale}</th>
            <th>Recurring {scale}</th>
            <th>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {account?.memberOf?.nodes &&
            uniqBy(account?.memberOf.nodes, node => node.account.slug).map(node => (
              <tr key={node.id}>
                <td>
                  <a href={`https://opencollective.com/${node.account.slug}`}>{node.account.name}</a>
                </td>
                <td style={{ textAlign: 'center' }}>{formatAmount(node.totalDonations)}</td>
                <td style={{ textAlign: 'center' }}>
                  {formatAmount(node.account.stats.totalAmountReceivedPastMonth)}
                  <br />
                  <small>
                    (previous: {formatAmount(node.account.stats.totalAmountReceivedPreviousMonth)}){' '}
                    {makeDiff(
                      node.account.stats.totalAmountReceivedPastMonth.value,
                      node.account.stats.totalAmountReceivedPreviousMonth.value,
                    )}
                  </small>
                </td>
                <td style={{ textAlign: 'center' }}>
                  {formatAmount(node.account.stats.totalAmountSpentPastMonth)}

                  <br />
                  <small>
                    (previous: {formatAmount(node.account.stats.totalAmountSpentPreviousMonth)}){' '}
                    {makeDiff(
                      node.account.stats.totalAmountSpentPastMonth.value,
                      node.account.stats.totalAmountSpentPreviousMonth.value,
                    )}
                  </small>
                </td>
                <td style={{ textAlign: 'center' }}>{formatAmount(calculateRecurring(node, scale))}</td>
                <td style={{ textAlign: 'center' }}>{formatAmount(node.account.stats.balance)}</td>
              </tr>
            ))}
        </tbody>
      </table>

      {!account?.memberOf?.nodes && <p>No data.</p>}
    </Layout>
  );
}
