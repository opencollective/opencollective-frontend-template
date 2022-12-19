import { useMemo } from 'react';
import { ApolloClient, from, HttpLink, InMemoryCache } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import merge from 'deepmerge';
import isEqual from 'lodash/isEqual';
import { GetSessionParams } from 'next-auth/react';

import { PublicEnv } from './env';

export const APOLLO_STATE_PROP_NAME = '__APOLLO_STATE__';

let apolloClient;

const errorLink = onError(({ graphQLErrors, networkError }) => {
  if (graphQLErrors) {
    graphQLErrors.map(({ message, locations, path }) =>
      // eslint-disable-next-line no-console
      console.log(`[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`),
    );
  }
  if (networkError) {
    // eslint-disable-next-line no-console
    console.log(`[Network error]: ${networkError}`);
  }
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function createApolloClient({ context, fetch }: { context?: GetSessionParams; fetch?: any } = {}) {
  const authLink = setContext(async (_, { headers }) => {
    return {
      headers: {
        ...headers,
        // authorization: session?.accessToken ? `Bearer ${session?.accessToken}` : '',
        // eslint-disable-next-line no-process-env
        ...(process.env.OPENCOLLECTIVE_API_KEY && { 'Api-Key': process.env.OPENCOLLECTIVE_API_KEY }),
      },
    };
  });

  const httpLink = new HttpLink({
    uri: `${PublicEnv.OPENCOLLECTIVE_API_URL}/graphql`, // Server URL (must be absolute)
    // credentials: "same-origin", // Additional fetch() options like `credentials` or `headers`
    fetch,
  });

  return new ApolloClient({
    ssrMode: typeof window === 'undefined',
    link: from([authLink, errorLink, httpLink]),
    cache: new InMemoryCache(),
  });
}

export function initializeApollo({
  context,
  initialState = null,
  fetch = null,
}: { context?: GetSessionParams; initialState?: Record<string, unknown>; fetch?: any } = {}) {
  const _apolloClient = apolloClient ?? createApolloClient({ context, fetch });

  // If your page has Next.js data fetching methods that use Apollo Client, the initial state
  // gets hydrated here
  if (initialState) {
    // Get existing cache, loaded during client side data fetching
    const existingCache = _apolloClient.extract();

    // Merge the initialState from getStaticProps/getServerSideProps in the existing cache
    const data = merge(existingCache, initialState, {
      // combine arrays using object equality (like in sets)
      arrayMerge: (destinationArray, sourceArray) => [
        ...sourceArray,
        ...destinationArray.filter(d => sourceArray.every(s => !isEqual(d, s))),
      ],
    });

    // Restore the cache with the merged data
    _apolloClient.cache.restore(data);
  }
  // For SSG and SSR always create a new Apollo Client
  if (typeof window === 'undefined') {
    return _apolloClient;
  }
  // Create the Apollo Client once in the client
  if (!apolloClient) {
    apolloClient = _apolloClient;
  }

  return _apolloClient;
}

export function addApolloState(client, pageProps) {
  if (pageProps?.props) {
    pageProps.props[APOLLO_STATE_PROP_NAME] = client.cache.extract();
  }

  return pageProps;
}

export function useApollo(pageProps) {
  const state = pageProps[APOLLO_STATE_PROP_NAME];
  const store = useMemo(() => initializeApollo(state), [state]);
  return store;
}

export function queryToString(query) {
  return query.loc?.source.body.replace(/\s+/g, ' ').trim();
}
