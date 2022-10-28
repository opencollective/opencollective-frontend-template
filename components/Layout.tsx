import React from 'react';
import styled from 'styled-components';

import Footer from './Footer';
import Header from './Header';

interface Props {
  children: React.ReactNode;
}

const Main = styled.main`
  background: ${props => props.theme.colors.black[50]};
  min-height: 380px;
  padding: 48px max(8px, calc((100vw - 1280px) / 2));
`;

export default function Layout({ children }: Props) {
  return (
    <React.Fragment>
      <Header />
      <Main>{children}</Main>
      <Footer />
    </React.Fragment>
  );
}
