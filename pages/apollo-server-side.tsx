import { getSession } from "next-auth/react";
import { gql, ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import type { NextPageContext } from "next";

import { initializeApollo } from "../lib/apollo-client";

import Layout from "../components/layout";

const apiUrl =
  process.env.OPENCOLLECTIVE_API_URL || "https://api.opencollective.com";

const meQuery = gql`
  {
    me {
      id
      name
      email
      imageUrl
    }
  }
`;

export async function getServerSideProps(context: NextPageContext) {
  const client = initializeApollo({ context });

  const { data } = await client.query({ query: meQuery });

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

      <p>
        This page demonstrates how to use Apollo to fetch data for server side
        rendering
      </p>

      <h2>Query</h2>

      <pre>{meQuery.loc?.source.body}</pre>

      <h2>Result</h2>

      {me && <pre>{JSON.stringify(me, null, 2)}</pre>}

      {!me && <p>No profile data</p>}
    </Layout>
  );
}
