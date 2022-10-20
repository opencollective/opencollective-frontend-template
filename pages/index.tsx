import React from 'react';
import { FormattedMessage } from 'react-intl';

import Layout from '../components/Layout';

export default function IndexPage() {
  return (
    <Layout>
      <h1>Open Collective Frontend template</h1>
      <p>
        <FormattedMessage defaultMessage="This is an example site to demonstrate how to use Open Collective OAuth to Sign In. Learn more:" />{' '}
        <a
          href="https://github.com/opencollective/opencollective-frontend-template"
          target="_blank"
          rel="noopener noreferrer"
        >
          https://github.com/opencollective/opencollective-frontend-template
        </a>
      </p>
    </Layout>
  );
}
