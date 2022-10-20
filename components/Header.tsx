import React from 'react';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { useLoggedInUser } from '../lib/hooks/useLoggedInUser';
import { OPENCOLLECTIVE_OAUTH_PROVIDER_ID } from '../lib/opencollective-oauth-config';

import Avatar from '@opencollective/frontend-components/components/Avatar';
import { Flex } from '@opencollective/frontend-components/components/Grid';
import StyledButton from '@opencollective/frontend-components/components/StyledButton';
import { Strong } from '@opencollective/frontend-components/components/Text';

const StyledHeader = styled.header`
  /* Set min-height to avoid page reflow while session loading */
  .signedInStatus {
    display: block;
    min-height: 4rem;
    width: 100%;
  }

  .loading,
  .loaded {
    position: relative;
    top: 0;
    opacity: 1;
    overflow: hidden;
    border-radius: 0 0 0.6rem 0.6rem;
    padding: 0.6rem 1rem;
    margin: 0;
    background-color: rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease-in;
  }

  .loading {
    top: -2rem;
    opacity: 0;
  }

  .signedInText,
  .notSignedInText {
    padding-top: 0.8rem;
    left: 1rem;
    right: 6.5rem;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    display: inherit;
    z-index: 1;
    line-height: 1.3rem;
  }

  .signedInText {
    padding-top: 0rem;
    left: 4.6rem;
  }

  .avatar {
    border-radius: 2rem;
    float: left;
    height: 2.8rem;
    width: 2.8rem;
    background-color: white;
    background-size: cover;
    background-repeat: no-repeat;
  }

  .button,
  .buttonPrimary {
    float: right;
    margin-right: -0.4rem;
    font-weight: 500;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 1rem;
    line-height: 1.4rem;
    padding: 0.7rem 0.8rem;
    position: relative;
    z-index: 10;
    background-color: transparent;
    color: #555;
  }

  .buttonPrimary {
    background-color: #346df1;
    border-color: #346df1;
    color: #fff;
    text-decoration: none;
    padding: 0.7rem 1.4rem;
  }

  .buttonPrimary:hover {
    box-shadow: inset 0 0 5rem rgba(0, 0, 0, 0.2);
  }

  .navItems {
    margin-bottom: 2rem;
    padding: 0;
    list-style: none;
  }

  .navItem {
    display: inline-block;
    margin-right: 1rem;
  }
`;

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { loadingLoggedInUser, LoggedInUser } = useLoggedInUser();
  return (
    <StyledHeader>
      <div className={'signedInStatus'}>
        <div className={`${!LoggedInUser && loadingLoggedInUser ? 'loading' : 'loaded'}`}>
          {!LoggedInUser && (
            <Flex justifyContent="space-between">
              <span className={'notSignedInText'}>
                <FormattedMessage defaultMessage="You are not signed in" />
              </span>
              <StyledButton
                buttonStyle="primary"
                onClick={e => {
                  e.preventDefault();
                  signIn(OPENCOLLECTIVE_OAUTH_PROVIDER_ID);
                }}
              >
                <FormattedMessage defaultMessage="Sign in with Open Collective" />
              </StyledButton>
            </Flex>
          )}
          {LoggedInUser && (
            <Flex justifyContent="space-between">
              <Flex>
                <Avatar collective={LoggedInUser.collective} radius={42} />
                <Flex flexDirection="column" ml={2} justifyContent="center">
                  <small>Signed in as</small>
                  <br />
                  <Strong fontSize="14px">{LoggedInUser.email ?? LoggedInUser.collective.name}</Strong>
                </Flex>
              </Flex>
              <StyledButton
                onClick={e => {
                  e.preventDefault();
                  signOut();
                }}
              >
                <FormattedMessage defaultMessage="Sign out" />
              </StyledButton>
            </Flex>
          )}
        </div>
      </div>
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
    </StyledHeader>
  );
}
