import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

import Layout from '../components/Layout';

import { hosts } from './[slug]';

export default function Page() {
  return (
    <Layout>
      <Head>
        <title>Discover Open Collective</title>
      </Head>
      <div className="flex flex-1 items-center justify-center py-24 px-12">
        <div className="grid max-w-xl grid-cols-1 gap-4 rounded-lg bg-white p-6  lg:gap-6">
          {hosts
            .filter(h => !h.disabled)
            .map(host => (
              <Link href={`/${host.slug}`} key={host.slug}>
                <a
                  className={`flex h-24 items-center justify-start gap-3 rounded-xl border-3 px-4 lg:h-32 lg:gap-4 lg:px-6 bg-${host.color}-500 border-transparent bg-opacity-5 transition-colors hover:border-${host.color}-500`}
                >
                  <div className="flex min-w-[64px] justify-center lg:min-w-[128px]">
                    <img src={host.logoSrc} className="h-5 lg:h-10" alt={host.name} />
                  </div>
                  <span className={`text-base font-medium lg:text-lg `}>{host.name}</span>
                </a>
              </Link>
            ))}
        </div>
      </div>
    </Layout>
  );
}
