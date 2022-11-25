import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../components/Layout';

export default function Page() {
  return (
    <Layout>
      <Head>
        <title>Discover Open Collective</title>
      </Head>
      <div className="mx-auto mt-4 flex max-w-[1280px]   flex-1 flex-col space-y-10 py-24 px-12">
        <Link href="/foundation">
          <a className="flex rounded-xl bg-teal-900 p-12 text-4xl font-medium text-white">
            <span>Discover Open Collective Foundation</span>
          </a>
        </Link>
      </div>
    </Layout>
  );
}
