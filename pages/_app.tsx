import React from 'react';
import { ApolloProvider } from '@apollo/client';
import dayjs from 'dayjs';
import isoWeek from 'dayjs/plugin/isoWeek';
import utc from 'dayjs/plugin/utc';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import type { AppProps } from 'next/app';
import NextNProgress from 'nextjs-progressbar';
import { IntlProvider } from 'react-intl';
import { ThemeProvider } from 'styled-components';

import { useApollo } from '../lib/apollo-client';
import theme from '@opencollective/frontend-components/lib/theme';

import '../globals.css';

dayjs.extend(utc);
dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    // <SessionProvider session={pageProps['session']} refetchInterval={0}>
    <IntlProvider locale="en">
      <ApolloProvider client={apolloClient}>
        <ThemeProvider theme={theme}>
          <NextNProgress />
          <Component {...pageProps} />
        </ThemeProvider>
      </ApolloProvider>
    </IntlProvider>
    // </SessionProvider>
  );
}
