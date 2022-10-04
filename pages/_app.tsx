import { ApolloProvider } from "@apollo/client";
import { SessionProvider } from "next-auth/react";
import "./styles.css";

import type { AppProps } from "next/app";

import { useApollo } from "../lib/apollo-client";

// Use of the <SessionProvider> is mandatory to allow components that call
// `useSession()` anywhere in your application to access the `session` object.
export default function App({ Component, pageProps }: AppProps) {
  const apolloClient = useApollo(pageProps);
  return (
    <SessionProvider session={pageProps.session} refetchInterval={0}>
      <ApolloProvider client={apolloClient}>
        <Component {...pageProps} />
      </ApolloProvider>
    </SessionProvider>
  );
}
