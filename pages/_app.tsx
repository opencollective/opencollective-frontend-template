import React from 'react';
import { ApolloProvider } from '@apollo/client';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';
import { IntlProvider } from 'react-intl';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { useApollo } from '../lib/apollo-client';
import theme from '@opencollective/frontend-components/lib/theme';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont,
      "Segoe UI", Roboto, "Helvetica Neue", Arial, "Noto Sans", sans-serif,
      "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
    padding: 0 1rem 1rem 1rem;
    max-width: 680px;
    margin: 0 auto;
    background: #fff;
    color: #333;
  }

  li,
  p {
    line-height: 1.5rem;
  }
 
  a {
    font-weight: 500;
  }

  hr {
    border: 1px solid #ddd;
  }
`;

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    <SessionProvider session={pageProps['session']} refetchInterval={0}>
      <IntlProvider locale="en">
        <ApolloProvider client={apolloClient}>
          <ThemeProvider theme={theme}>
            <GlobalStyles />
            <NextNProgress />
            <Component {...pageProps} />
          </ThemeProvider>
        </ApolloProvider>
      </IntlProvider>
    </SessionProvider>
  );
}
