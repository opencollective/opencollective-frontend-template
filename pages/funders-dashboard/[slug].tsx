import React from 'react';
import { gql } from '@apollo/client';
import { uniqBy } from 'lodash';
import type { NextPageContext } from 'next';

import { initializeApollo } from '../../lib/apollo-client';

import Layout from '../../components/Layout';

const funderQuery = gql`
  query account($slug: String) {
    account(slug: $slug) {
      slug
      memberOf(role: BACKER, orderBy: { field: TOTAL_CONTRIBUTED, direction: DESC }) {
        nodes {
          id
          account {
            slug
            name
            stats {
              totalAmountReceived(dateFrom: "2022-01-01T00:00:00Z", includeChildren: true) {
                value
                currency
              }
              totalAmountSpent(dateFrom: "2022-01-01T00:00:00Z", includeChildren: true) {
                value
                currency
              }
              balance(includeChildren: true) {
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

  const { data } = await client.query({ query: funderQuery, variables: { slug: context.query.slug } });

  return {
    props: {
      account: data.account,
    },
  };
}

export default function ApolloSsrPage({ account = null }) {
  return (
    <Layout>
      <h1>Funders Dashboard</h1>

      <table>
        <thead>
          <tr>
            <th>Collective</th>
            <th>Contributed</th>
            <th>Received this Y</th>
            <th>Spent this Y</th>
            <th>Current Balance</th>
          </tr>
        </thead>
        <tbody>
          {account?.memberOf?.nodes &&
            uniqBy(account?.memberOf.nodes, node => node.account.slug).map(node => (
              <tr key={node.id}>
                <td>{node.account.name}</td>
                <td>
                  {node.totalDonations.value} {node.totalDonations.currency}
                </td>
                <td>
                  {node.account.stats.totalAmountReceived.value} {node.account.stats.totalAmountReceived.currency}
                </td>
                <td>
                  {node.account.stats.totalAmountSpent.value} {node.account.stats.totalAmountSpent.currency}
                </td>
                <td>
                  {node.account.stats.balance.value} {node.account.stats.balance.currency}
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {!account?.memberOf?.nodes && <p>No data.</p>}
    </Layout>
  );
}
