import React from 'react';
import { FormattedMessage } from 'react-intl';
import type { NextPageContext } from 'next';

import Layout from '../components/Layout';
import { H1, H3 } from '@opencollective/frontend-components/components/Text';

import { gql } from '@apollo/client';
import styled from 'styled-components';
import { initializeApollo, queryToString } from '../lib/apollo-client';
import { useRouter } from 'next/router';

export const hostQuery = gql`
  query Host($hostSlug: String, $searchTerm: String) {
    host(slug: $hostSlug) {
      id
      memberOf(role: HOST, isApproved: true, searchTerm: $searchTerm) {
        totalCount
        nodes {
          id
          account {
            id
            name
            slug
            stats {
              contributionsAmount {
                count
                label
              }
              totalAmountReceived {
                currency
                value
                valueInCents
              }
            }
          }
        }
      }
    }
  }
`;

const StyledCategorySelector = styled.div`
  display: flex;
  gap: 16px;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
`;

type StyledCategoryButtonProps = React.HTMLProps<HTMLButtonElement> & {
  selected?: boolean;
};

const StyledCategoryButton = styled.button<StyledCategoryButtonProps>`
  ${({ selected }) => selected && `border: blue solid 1px;`}
`;

export async function getServerSideProps(context: NextPageContext) {
  const client = initializeApollo({ context });
  const searchTerm = context.query?.category;
  const { data } = await client.query({ query: hostQuery, variables: { hostSlug: 'foundation', searchTerm } });

  return {
    props: {
      collectiveCount: data.host.memberOf.totalCount,
      totalRaised: data.host.memberOf.nodes.reduce(
        (acc, node) => acc + node.account.stats.totalAmountReceived.valueInCents,
        0,
      ),
      numberOfContributions: data.host.memberOf.nodes.reduce((acc, node) => {
        const totalContributionsForAccount = node.account.stats.contributionsAmount.reduce(
          (acc, contribution) => acc + contribution.count,
          0,
        );
        return acc + totalContributionsForAccount;
      }, 0),
      category: searchTerm ?? null,
    },
  };
}
export default function IndexPage({ totalRaised, collectiveCount, numberOfContributions, category }) {
  return (
    <Layout>
      <H1 fontSize="30px">Horizons</H1>
      <H3>Trends</H3>
      <CategorySelect
        selectedCategory={category ?? 'All trends'}
        categories={['All trends', 'Arts + Culture', 'Mutual aid', 'Climate change']}
      />
      <H3 mt={4}>Stats</H3>
      <Grid>
        <div>{collectiveCount} collectives</div>
        <div>${totalRaised / 100} total raised</div>
        <div>{numberOfContributions} contributions</div>
      </Grid>
    </Layout>
  );
}

const CategorySelect = ({ categories, selectedCategory }) => {
  const router = useRouter();
  return (
    <StyledCategorySelector>
      {categories.map(category => (
        <StyledCategoryButton
          key={category}
          selected={category === selectedCategory}
          onClick={() => {
            if (category === 'All trends') {
              router.push('/');
            } else {
              router.push({ pathname: '/', query: { category: category } });
            }
          }}
        >
          {category}
        </StyledCategoryButton>
      ))}
    </StyledCategorySelector>
  );
};
