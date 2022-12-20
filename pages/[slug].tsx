import React from 'react';
import type { GetStaticProps } from 'next';
import Head from 'next/head';

import { hosts } from '../lib/hosts';
import getLocation from '../lib/location/getLocation';
import { getAllPosts, markdownToHtml } from '../lib/markdown';
import { tagTransforms } from '../lib/tag-transforms';

import Dashboard from '../components/Dashboard';
import Layout from '../components/Layout';

const getTotalStats = stats => {
  const raisedSeries = {
    timeUnit: stats.totalAmountReceivedTimeSeries.timeUnit,
    nodes: stats.totalAmountReceivedTimeSeries.nodes.map(node => ({
      date: node.date,
      amount: node.amount.valueInCents,
    })),
  };
  const raised = raisedSeries.nodes.reduce((acc, node) => acc + node.amount, 0);
  const spent = Math.abs(stats.totalAmountSpent.valueInCents);

  return {
    contributors: stats.contributorsCount,
    contributions: stats.contributionsCount,
    spent,
    raised,
    raisedSeries,
  };
};

const getStats = collective => {
  const stats = {
    ALL: getTotalStats(collective.ALL),
    PAST_YEAR: getTotalStats(collective.PAST_YEAR),
    PAST_QUARTER: getTotalStats(collective.PAST_QUARTER),
  };
  return stats.ALL.raised !== 0 ? stats : null;
};

const colors = [
  { name: 'red', hex: '#EF4444' },
  { name: 'orange', hex: '#F97316' },
  { name: 'amber', hex: '#F59E0B' },
  { name: 'yellow', hex: '#EAB308' },
  { name: 'lime', hex: '#84CC16' },
  { name: 'green', hex: '#22C55E' },
  { name: 'emerald', hex: '#10B981' },
  { name: 'teal', hex: '#14B8A6' },
  { name: 'cyan', hex: '#06B6D4' },
  { name: 'sky', hex: '#0EA5E9' },
  { name: 'blue', hex: '#3B82F6' },
  { name: 'indigo', hex: '#6366F1' },
  { name: 'violet', hex: '#8B5CF6' },
  { name: 'purple', hex: '#A855F7' },
  { name: 'fuchsia', hex: '#D946EF' },
  { name: 'pink', hex: '#EC4899' },
  { name: 'rose', hex: '#F43F5E' },
];

const pickColorForCategory = (startColor: string, i: number, numOfCategories: number) => {
  const startColorIndex = colors.findIndex(c => c.name === startColor);
  const step = Math.floor(colors.length / numOfCategories);
  return colors[(startColorIndex + i * step) % colors.length];
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  const hostSlug: string = params ? (Array.isArray(params.slug) ? params.slug[0] : params.slug) : null;

  const host = hosts.find(h => {
    if (!hostSlug) {
      return h.slug === '';
    }
    return h.slug === hostSlug;
  });

  if (!host) {
    return {
      notFound: true,
    };
  }

  // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
  const { accounts } = await require(`../_data/${hostSlug ?? 'ALL'}.json`);
  // eslint-disable-next-line node/no-missing-require, node/no-unpublished-require
  const { collectiveCounts } = await require(`../_data/shared.json`);

  const collectives = accounts.nodes.map(collective => {
    const stats = getStats(collective);
    const location = getLocation(collective);
    return {
      name: collective.name,
      slug: collective.slug,
      imageUrl: collective.imageUrl.replace('-staging', ''),
      host: { name: collective.host.name, slug: collective.host.slug },
      tags:
        collective.tags
          ?.filter(t => !['other', 'online', 'community', 'association', 'movement', 'USA', 'europe'].includes(t))
          .map(tag => tagTransforms[tag] || tag)
          .filter((tag, i, arr) => arr.indexOf(tag) === i) ?? null,
      ...(stats && { stats }),
      ...(location && { location }),
    };
  });

  let categories;

  // If no categories defined, generate them from most popular tags
  if (!host?.categories) {
    // Go through collectives and count tags
    const tagCounts = collectives.reduce((acc, collective) => {
      collective.tags?.forEach(tag => {
        if (!acc[tag]) {
          acc[tag] = 0;
        }
        acc[tag]++;
      });
      return acc;
    }, {});

    const sortedTags = Object.keys(tagCounts).sort((a, b) => tagCounts[b] - tagCounts[a]);

    /* Find the top tags that are (sort of?) "mutually exclusive", so that we are not displaying many categories 
       that are essentially the same (Open Source, Javascript, React etc), by adding a single count for each
       collectives' most popular tag. */
    const topMutuallyExclusiveTags = collectives.reduce((acc, collective) => {
      if (!collective.tags) {
        return acc;
      }
      // Go through 20 top tags until we find one that is in the collective and add count to it
      for (let i = 0; i < 20; i++) {
        const tag = sortedTags[i];
        if (collective.tags?.includes(tag)) {
          if (!acc[tag]) {
            acc[tag] = 0;
          }
          acc[tag]++;
          break;
        }
      }
      return acc;
    }, {});
    const sortedMutualExclusiveTags = Object.keys(topMutuallyExclusiveTags).sort(
      (a, b) => topMutuallyExclusiveTags[b] - topMutuallyExclusiveTags[a],
    );
    const topMutualExclusiveTagsSortedOnActualCount = sortedMutualExclusiveTags
      .slice(0, 6)
      .sort((a, b) => tagCounts[b] - tagCounts[a]);

    categories = topMutualExclusiveTagsSortedOnActualCount.map(tag => {
      // Capitalize first letter in all words for the label
      const label = tag
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      return { label, tag };
    });
  } else {
    categories = host.categories;
  }

  // Add All category and add colors and counts
  categories = [{ label: 'All Categories', tag: 'ALL' }, ...categories].map((category, i, arr) => {
    const color = pickColorForCategory(host?.color ?? 'blue', i, arr.length);

    const count = collectives.filter(
      collective => category.tag === 'ALL' || collective.tags?.includes(category.tag),
    ).length;

    return {
      ...category,
      color,
      count,
    };
  });

  const allStories = getAllPosts([
    'title',
    'content',
    'tags',
    'location',
    'slug',
    'youtube',
    'video',
    'collectiveSlug',
  ]);
  // run markdownToHtml on content in stories
  const stories = await Promise.all(
    allStories
      .map(story => ({
        ...story,
        collective: collectives.find(c => c.slug === story.collectiveSlug) ?? null,
      }))
      .filter(story => story.collective)
      .map(async story => {
        return {
          ...story,
          // tags: story.tags.map(tag => ({ color: categories.find(c => c.tag === tag)?.color.hex ?? null, tag: tag })),
          content: await markdownToHtml(story.content),
        };
      }),
  );

  const { currency, startYear } = host;

  return {
    props: {
      host: { ...host, count: collectiveCounts[host.slug !== '' ? host.slug : 'ALL'] },
      hosts: hosts.map(host => ({ ...host, count: collectiveCounts[host.slug !== '' ? host.slug : 'ALL'] })),
      collectives,
      categories,
      hostSlug: host.slug,
      stories,
      startYear,
      currency,
      platformTotalCollectives: collectiveCounts.platform,
    },
    // revalidate: 60 * 60 * 24, // Revalidate the static page at most once every 24 hours to not overload the API
  };
};

export async function getStaticPaths() {
  const hostSlugs = hosts.filter(h => h.slug !== '').map(host => host.slug);
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

export default function Page({
  categories,
  stories,
  host,
  hosts,
  collectives,
  hostSlug,
  currency,
  startYear,
  platformTotalCollectives,
}) {
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
        hostSlug={hostSlug}
        currency={currency}
        startYear={startYear}
        stories={stories}
        locale={locale}
        host={host}
        hosts={hosts}
        platformTotalCollectives={platformTotalCollectives}
      />
    </Layout>
  );
}
