import React from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';

import { hosts as _hosts } from '../lib/hosts';

import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

import { createCategories } from '../utils/categories';
import { getLocation } from '../utils/location/get-location';
import { getStories } from '../utils/stories';
import { transformTags } from '../utils/tag-transforms';

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const hostSlug: string = params ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;

  // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
  const { accounts } = await require(`../_data/${hostSlug ?? 'ALL'}.json`);

  // Add collective counts to hosts
  // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
  const { collectiveCounts } = await require(`../_data/shared.json`);
  const hosts = _hosts.map(h => ({ ...h, count: collectiveCounts[h.root ? 'ALL' : h.slug] }));
  const host = hosts.find(h => hostSlug === h.slug || (!hostSlug && h.root));

  if (!host) {
    return {
      notFound: true,
    };
  }

  const collectives = accounts.nodes.map(collective => {
    const location = getLocation(collective);
    return {
      name: collective.name,
      slug: collective.slug,
      imageUrl: collective.imageUrl.replace('-staging', ''),
      host: { name: collective.host.name, slug: collective.host.slug },
      tags: transformTags(collective),
      stats: collective.stats,
      ...(location && { location }),
    };
  });

  const categories = createCategories({ collectives, host });
  const stories = await getStories({ collectives });

  return {
    props: {
      host,
      hosts,
      collectives,
      categories,
      stories,
      startYear: host.startYear,
      currency: host.currency,
      platformTotalCollectives: collectiveCounts.platform,
    },
  };
};

export async function getStaticPaths() {
  const hostSlugs = _hosts.filter(h => !h.root).map(host => host.slug);
  return {
    paths: [
      ...hostSlugs.map(slug => ({
        params: {
          slug,
        },
      })),
    ],
    fallback: false,
  };
}

export default function Page({ categories, stories, host, hosts, collectives, currency, startYear }) {
  // eslint-disable-next-line no-console
  const locale = 'en';
  return (
    <Layout>
      <Head>
        <title>Discover {host.name}</title>
      </Head>
      <Dashboard
        categories={categories}
        collectives={collectives}
        currency={currency}
        startYear={startYear}
        stories={stories}
        locale={locale}
        host={host}
        hosts={hosts}
      />
    </Layout>
  );
}
