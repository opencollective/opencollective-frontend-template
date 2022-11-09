import React from 'react';
import styled from 'styled-components';
import Image from 'next/image';
// import { Avatar } from '@opencollective/frontend-components/components/Avatar';
import { formatCurrency } from '@opencollective/frontend-components/lib/currency-utils';
// import Footer from './Footer';
// import Header from './Header';

const List = styled.ul`
  list-style: none;
  padding: 0;
  background: white;
  padding: 16px;
  border-radius: 16px;
`;

const Avatar = styled.img`
  border-radius: 8px;
  object-fit: cover;
`;

const Collective = styled.a`
  margin-bottom: 8px;
  display: flex !important;
  align-items: center;
  justify-content: space-between;
  text-decoration: none;
  color: #333;
  font-weight: 500;
  padding: 8px;
  padding-right: 16px;
  border-radius: 8px;
  :hover {
    background: #f7f8fa;
    div.name {
      text-decoration: underline;
    }
  }
  gap: 20px;
  div {
    display: flex;
    align-items: center;
    gap: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  div.name,
  div.amount {
    flex-shrink: 0;
  }
  span {
    font-weight: 400;
    text-decoration: none !important;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #999;
  }
`;

interface Props {
  collectives: [any];
  //   children: React.ReactNode;
}

export default function Collectives({ collectives }: Props) {
  // sort on totalAmountReceived
  const sortedCollectives = [...collectives].sort(
    (a, b) => b.stats.totalAmountReceived.valueInCents - a.stats.totalAmountReceived.valueInCents,
  );
  return (
    <List>
      {sortedCollectives.map(collective => (
        <Collective key={collective.id} href={`https://opencollective.com/${collective.slug}`}>
          <div className="first">
            <div className="name">
              <Avatar alt={collective.name} src={collective.imageUrl} height={'50px'} width={'50px'} />{' '}
              {collective.name}{' '}
            </div>
            <span>{collective.description}</span>
          </div>

          <div className="amount">
            {formatCurrency(
              collective.stats.totalAmountReceived.valueInCents,
              collective.stats.totalAmountReceived.currency,
              { locale: 'en-US', precision: 0 },
            )}{' '}
            {collective.stats.totalAmountReceived.currency}
          </div>
        </Collective>
      ))}
    </List>
  );
}
