import React from 'react';
import { useQuery } from '@apollo/client';

import { queryToString } from '../lib/apollo-client';
import { OAuthLoggedInUserQuery, OAuthLoggedInUserQueryVariables } from '../lib/graphql/types/v2/graphql';
import { loggedInUserQuery } from '../lib/opencollective-oauth-config';

import Layout from '../components/Layout';

export default function ApolloClientPage() {
  const { data, loading } = useQuery<OAuthLoggedInUserQuery, OAuthLoggedInUserQueryVariables>(loggedInUserQuery);

  return (
    <Layout>
      <h1>Apollo Client Side fetching Example</h1>

      <p>This page demonstrates how to use Apollo to fetch data from the client side.</p>

      <h2>Query</h2>

      <pre>{queryToString(loggedInUserQuery)}</pre>

      <h2>Result</h2>

      {loading && <p>Loading...</p>}

      {data?.me && <pre>{JSON.stringify(data?.me, null, 2)}</pre>}

      {!data?.me && !loading && <p>No profile data</p>}
    </Layout>
  );
}
