import React from 'react';
import { gql } from '@apollo/client';
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
              totalAmountReceived(dateFrom: "2022-01-01T00:00:00Z") {
                value
                currency
              }
              totalAmountSpent(dateFrom: "2022-01-01T00:00:00Z") {
                value
                currency
              }
              balance {
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

  const { data } = await client.query({ query: funderQuery, variables: { slug: 'indeed' } });

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

      {/*<h2>Result</h2>*/}

      {/*{account && <pre>{JSON.stringify(account, null, 2)}</pre>}*/}

      {/*{account?.memberOf && <pre>{JSON.stringify(account?.memberOf, null, 2)}</pre>}*/}

      <table>
        <tbody>
          <tr>
            <th>Collective</th>
            <th>Contributed</th>
            <th>Received this Y</th>
            <th>Spent this Y</th>
            <th>Current Balance</th>
          </tr>
          {account?.memberOf?.nodes &&
            account?.memberOf.nodes.map(node => (
              <tr key={node.account.id}>
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
