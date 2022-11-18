import React from 'react';
import { ApolloProvider } from '@apollo/client';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import type { AppProps } from 'next/app';
import { SessionProvider } from 'next-auth/react';
import NextNProgress from 'nextjs-progressbar';
import { IntlProvider } from 'react-intl';
import { createGlobalStyle, ThemeProvider } from 'styled-components';

import { useApollo } from '../lib/apollo-client';
import theme from '@opencollective/frontend-components/lib/theme';

const stripePromise = loadStripe('pk_test_VgSB4VSg2wb5LdAkz7p38Gw8');

const GlobalStyles = createGlobalStyle`
  @font-face {
    font-family: 'Inter';
    font-style:  normal;
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/inter/Inter-Regular.woff2") format("woff2"),
        url("/fonts/inter/Inter-Regular.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  italic;
    font-weight: 400;
    font-display: swap;
    src: url("/fonts/inter/Inter-Italic.woff2") format("woff2"),
        url("/fonts/inter/Inter-Italic.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  normal;
    font-weight: 500;
    font-display: swap;
    src: url("/fonts/inter/Inter-Medium.woff2") format("woff2"),
        url("/fonts/inter/Inter-Medium.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  italic;
    font-weight: 500;
    font-display: swap;
    src: url("/fonts/inter/Inter-MediumItalic.woff2") format("woff2"),
        url("/fonts/inter/Inter-MediumItalic.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  normal;
    font-weight: 600;
    font-display: swap;
    src: url("/fonts/inter/Inter-SemiBold.woff2") format("woff2"),
        url("/fonts/inter/Inter-SemiBold.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  italic;
    font-weight: 600;
    font-display: swap;
    src: url("/fonts/inter/Inter-SemiBoldItalic.woff2") format("woff2"),
        url("/fonts/inter/Inter-SemiBoldItalic.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  normal;
    font-weight: 700;
    font-display: swap;
    src: url("/fonts/inter/Inter-Bold.woff2") format("woff2"),
        url("/fonts/inter/Inter-Bold.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  italic;
    font-weight: 700;
    font-display: swap;
    src: url("/fonts/inter/Inter-BoldItalic.woff2") format("woff2"),
        url("/fonts/inter/Inter-BoldItalic.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  normal;
    font-weight: 800;
    font-display: swap;
    src: url("/fonts/inter/Inter-ExtraBold.woff2") format("woff2"),
        url("/fonts/inter/Inter-ExtraBold.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  italic;
    font-weight: 800;
    font-display: swap;
    src: url("/fonts/inter/Inter-ExtraBoldItalic.woff2") format("woff2"),
        url("/fonts/inter/Inter-ExtraBoldItalic.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  normal;
    font-weight: 900;
    font-display: swap;
    src: url("/fonts/inter/Inter-Black.woff2") format("woff2"),
        url("/fonts/inter/Inter-Black.woff") format("woff");
  }
  @font-face {
    font-family: 'Inter';
    font-style:  italic;
    font-weight: 900;
    font-display: swap;
    src: url("/fonts/inter/Inter-BlackItalic.woff2") format("woff2"),
        url("/fonts/inter/Inter-BlackItalic.woff") format("woff");
  }

  body {
    font-family: 'Inter', sans-serif;
    background: #fff;
    color: #333;
    margin: 0;
  }

  a:link { text-decoration: none; }

  a:visited { text-decoration: none; }

  a:hover { text-decoration: none; }

  a:active { text-decoration: none; }
`;

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    <Elements stripe={stripePromise}>
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
    </Elements>
  );
}
