import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { signIn, signOut } from 'next-auth/react';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import { useLoggedInUser } from '../lib/hooks/useLoggedInUser';
import { OPENCOLLECTIVE_OAUTH_PROVIDER_ID } from '../lib/opencollective-oauth-config';

import Avatar from '@opencollective/frontend-components/components/Avatar';
import { Box, Flex } from '@opencollective/frontend-components/components/Grid';
import StyledButton from '@opencollective/frontend-components/components/StyledButton';
import { H1, Span } from '@opencollective/frontend-components/components/Text';

const StyledHeader = styled.header`
  padding: 56px 40px 24px 40px;
  max-width: 1280px;
  margin: 0 auto;
`;

// The approach used in this component shows how to build a sign in and sign out
// component that works on pages which support both client and server side
// rendering, and avoids any flash incorrect content on initial page load.
export default function Header() {
  const { LoggedInUser } = useLoggedInUser();
  return (
    <StyledHeader>
      <Link href="/">
        <a>
          <H1 fontSize="52px" mb="48px" color="black.800" css={{ textDecoration: 'none' }}>
            <Flex alignItems="flex-end" flexWrap="wrap">
              <Span mr="12px">
                <FormattedMessage defaultMessage="Frontend Template project" />
              </Span>
              <Box width={197} height={40}>
                <Image
                  src="/images/by-open-collective.png"
                  alt="by Open Collective"
                  width="197"
                  height="40"
                  layout="fixed"
                />
              </Box>
            </Flex>
          </H1>
        </a>
      </Link>
      <Box>
        {!LoggedInUser ? (
          <div>
            <StyledButton
              buttonStyle="primary"
              onClick={e => {
                e.preventDefault();
                signIn(OPENCOLLECTIVE_OAUTH_PROVIDER_ID);
              }}
            >
              <FormattedMessage defaultMessage="Sign in with Open Collective" />
            </StyledButton>
          </div>
        ) : (
          <Flex justifyContent="space-between" alignItems="center">
            <Flex>
              <Avatar collective={LoggedInUser.collective} radius={56} />
              <Flex flexDirection="column" ml={2} justifyContent="center">
                <Span fontSize="18px" color="black.700" mb={1}>
                  {LoggedInUser.collective.name}
                </Span>
                <Span fontSize="12px" color="black.600">
                  {LoggedInUser.email}
                </Span>
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
      </Box>
    </StyledHeader>
  );
}
