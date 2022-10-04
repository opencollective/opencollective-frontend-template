import { gql, useQuery } from "@apollo/client";

import Layout from "../components/layout";

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

export default function ApolloClientPage() {
  const { data, loading, error } = useQuery(meQuery);

  return (
    <Layout>
      <h1>Apollo Client Side fetching Example</h1>

      <p>
        This page demonstrates how to use Apollo to fetch data from the client
        side.
      </p>

      <h2>Query</h2>

      <pre>{meQuery.loc?.source.body}</pre>

      <h2>Result</h2>

      {loading && <p>Loading...</p>}

      {data?.me && <pre>{JSON.stringify(data?.me, null, 2)}</pre>}

      {!data?.me && !loading && <p>No profile data</p>}
    </Layout>
  );
}
