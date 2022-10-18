import React from 'react';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { useLoggedInUser } from '../lib/hooks/useLoggedInUser';
import { OPENCOLLECTIVE_OAUTH_PROVIDER_ID } from '../lib/opencollective-oauth-config';

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
    position: absolute;
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
      <noscript>
        <style>{`.nojs-show { opacity: 1; top: 0; }`}</style>
      </noscript>
      <div className={'signedInStatus'}>
        <p className={`nojs-show ${!LoggedInUser && loadingLoggedInUser ? 'loading' : 'loaded'}`}>
          {!LoggedInUser && (
            <React.Fragment>
              <span className={'notSignedInText'}>
                <FormattedMessage defaultMessage="You are not signed in" />
              </span>
              <button
                className={'buttonPrimary'}
                onClick={e => {
                  e.preventDefault();
                  signIn(OPENCOLLECTIVE_OAUTH_PROVIDER_ID);
                }}
              >
                <FormattedMessage defaultMessage="Sign in with Open Collective" />
              </button>
            </React.Fragment>
          )}
          {LoggedInUser && (
            <React.Fragment>
              {LoggedInUser.imageUrl && (
                <span style={{ backgroundImage: `url('${LoggedInUser.imageUrl}')` }} className={'avatar'} />
              )}
              <span className={'signedInText'}>
                <small>Signed in as</small>
                <br />
                <strong>{LoggedInUser.email ?? LoggedInUser.name}</strong>
              </span>
              <a
                href={`/api/auth/signout`}
                className={'button'}
                onClick={e => {
                  e.preventDefault();
                  signOut();
                }}
              >
                Sign out
              </a>
            </React.Fragment>
          )}
        </p>
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
