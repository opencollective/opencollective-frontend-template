import React from 'react';
import Link from 'next/link';
import { FormattedMessage } from 'react-intl';

import Layout from '../components/Layout';

export default function IndexPage() {
  return (
    <Layout>
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
      <nav>
        <ul className={'navItems'}>
          <li className={'navItem'}>
            <Link href="/">
              <a>Home</a>
            </Link>
          </li>
          <li className={'navItem'}>
            <Link href="/apollo-server-side">
              <a>Apollo SSR</a>
            </Link>
          </li>
          <li className={'navItem'}>
            <Link href="/apollo-client-side">
              <a>Apollo Client</a>
            </Link>
          </li>
        </ul>
      </nav>
    </Layout>
  );
}
