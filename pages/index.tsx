import React from 'react';
import { FormattedMessage } from 'react-intl';

import Layout from '../components/Layout';

export default function IndexPage() {
  return (
    <Layout>
      <h1>Open Collective OAuth Example</h1>
      <p>
        <FormattedMessage defaultMessage="This is an example site to demonstrate how to use Open Collective OAuth to Sign In" />
      </p>
    </Layout>
  );
}
