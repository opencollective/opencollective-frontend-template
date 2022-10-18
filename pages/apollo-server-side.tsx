import React from 'react';
import type { NextPageContext } from 'next';

import { initializeApollo, queryToString } from '../lib/apollo-client';
import { loggedInUserQuery } from '../lib/opencollective-oauth-config';

import Layout from '../components/Layout';

export async function getServerSideProps(context: NextPageContext) {
  const client = initializeApollo({ context });

  const { data } = await client.query({ query: loggedInUserQuery });

  return {
    props: {
      me: data.me,
    },
  };
}

export default function ApolloSsrPage({ me = null }) {
  return (
    <Layout>
      <h1>Apollo Server Side fetching Example</h1>

      <p>This page demonstrates how to use Apollo to fetch data for server side rendering</p>

      <h2>Query</h2>

      <pre>{queryToString(loggedInUserQuery)}</pre>

      <h2>Result</h2>

      {me && <pre>{JSON.stringify(me, null, 2)}</pre>}

      {!me && <p>No profile data</p>}
    </Layout>
  );
}
