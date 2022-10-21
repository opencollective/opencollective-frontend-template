import React from 'react';
import type { NextPageContext } from 'next';

import { initializeApollo, queryToString } from '../lib/apollo-client';
import { loggedInUserQuery } from '../lib/opencollective-oauth-config';

import Layout from '../components/Layout';
import { H1, H2 } from '@opencollective/frontend-components/components/Text';

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
      <H1 fontSize="30px">Apollo Server Side fetching Example</H1>

      <p>This page demonstrates how to use Apollo to fetch data for server side rendering</p>

      <H2 fontSize="24px">Query</H2>

      <pre>{queryToString(loggedInUserQuery)}</pre>

      <H2 fontSize="24px">Result</H2>

      {me && <pre>{JSON.stringify(me, null, 2)}</pre>}

      {!me && <p>No profile data</p>}
    </Layout>
  );
}
