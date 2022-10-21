import React from 'react';
import Link from 'next/link';

import Layout from '../components/Layout';
import { H1 } from '@opencollective/frontend-components/components/Text';

export default function IndexPage() {
  return (
    <Layout>
      <H1 fontSize="30px">Funders Dashboard</H1>
      <p>Examples:</p>
      <ul>
        <li>
          <Link href="/funders-dashboard/vercel">Vercel</Link>
        </li>
        <li>
          <Link href="/funders-dashboard/airbnb">Airbnb</Link>
        </li>
        <li>
          <Link href="/funders-dashboard/indeed">Indeed</Link>
        </li>
        <li>
          <Link href="/funders-dashboard/fbopensource">FB Open Source</Link>
        </li>
      </ul>
    </Layout>
  );
}
