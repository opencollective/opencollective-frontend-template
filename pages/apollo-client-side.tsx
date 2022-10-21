import React from 'react';
import { useQuery } from '@apollo/client';

import { queryToString } from '../lib/apollo-client';
import { OAuthLoggedInUserQuery, OAuthLoggedInUserQueryVariables } from '../lib/graphql/types/v2/graphql';
import { loggedInUserQuery } from '../lib/opencollective-oauth-config';

import Layout from '../components/Layout';
import { H1, H2 } from '@opencollective/frontend-components/components/Text';

export default function ApolloClientPage() {
  const { data, loading } = useQuery<OAuthLoggedInUserQuery, OAuthLoggedInUserQueryVariables>(loggedInUserQuery);

  return (
    <Layout>
      <H1 fontSize="30px">Apollo Client Side fetching Example</H1>

      <p>This page demonstrates how to use Apollo to fetch data from the client side.</p>

      <H2 fontSize="24px">Query</H2>

      <pre>{queryToString(loggedInUserQuery)}</pre>

      <H2 fontSize="24px">Result</H2>

      {loading && <p>Loading...</p>}

      {data?.me && <pre>{JSON.stringify(data?.me, null, 2)}</pre>}

      {!data?.me && !loading && <p>No profile data</p>}
    </Layout>
  );
}
