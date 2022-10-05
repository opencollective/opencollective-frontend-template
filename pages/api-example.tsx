import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';

import Layout from '../components/Layout';

const apiUrl = process.env.OPENCOLLECTIVE_API_URL || 'https://api.opencollective.com';

const meQuery = `{me {id name email imageUrl }}`;

export default function ApiExamplePage() {
  const { data: sessionData } = useSession();

  const [me, setMe] = useState(null);
  const [isLoading, setLoading] = useState(false);

  useEffect(() => {
    if (sessionData?.accessToken) {
      setLoading(true);

      fetch(`${apiUrl}/graphql`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${sessionData?.accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: meQuery }),
      })
        .then(res => res.json())
        .then(({ data }) => {
          setLoading(false);
          setMe(data.me);
        });
    }
  }, [sessionData?.accessToken]);

  return (
    <Layout>
      <h1>Open Collective API Example</h1>

      <p>This is an example page to demonstrate how to use the Access Token and display information.</p>

      <h2>Query</h2>

      <pre>{meQuery.toString()}</pre>

      <h2>Result</h2>

      {isLoading && <p>Loading...</p>}

      {me && <pre>{JSON.stringify(me, null, 2)}</pre>}

      {!me && !isLoading && <p>No profile data</p>}
    </Layout>
  );
}
