import React from 'react';
import Image from 'next/image';
import { FormattedMessage } from 'react-intl';
import styled from 'styled-components';

import Container from '@opencollective/frontend-components/components/Container';
import { P } from '@opencollective/frontend-components/components/Text';

const StyledFooter = styled.footer`
  padding: 36px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1280px;
  margin: 0 auto;
`;

export default function Footer() {
  return (
    <StyledFooter>
      <P fontSize="18px" fontWeight="800">
        <FormattedMessage defaultMessage="Contributor's dashboard" />
      </P>
      <Container
        display="flex"
        flexDirection="column"
        fontSize="14px"
        fontWeight="400"
        justifyContent="center"
        alignItems="center"
      >
        <Container mb="13px">
          <FormattedMessage defaultMessage="Contributors dashboard is an initiative by" />
        </Container>
        <a href="https://opencollective.com" target="_blank" rel="noopener noreferrer">
          <Image src="/images/logo-greyscale.png" alt="by Open Collective" width="151" height="29" />
        </a>
      </Container>
    </StyledFooter>
  );
}
