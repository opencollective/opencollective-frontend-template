import { gql, QueryResult } from '@apollo/client';
import { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

import { OAuthLoggedInUserQuery, OAuthLoggedInUserQueryVariables } from './graphql/types/v2/graphql';
import { queryToString } from './apollo-client';
import { PublicEnv } from './env';

/** ID of the next-auth provider */
export const OPENCOLLECTIVE_OAUTH_PROVIDER_ID = 'opencollective';

export const loggedInUserQuery = gql`
  query OAuthLoggedInUser {
    me {
      id
      name
      email
      imageUrl(height: 90)
      type
    }
  }
`;

type LoggedInUserQueryResult = QueryResult<OAuthLoggedInUserQuery, OAuthLoggedInUserQueryVariables>;

export type LoggedInUserType = OAuthLoggedInUserQuery['me'];

export function getOpenCollectiveOAuthConfig<P extends LoggedInUserQueryResult>(
  options: OAuthUserConfig<P>,
): OAuthConfig<P> {
  return {
    id: OPENCOLLECTIVE_OAUTH_PROVIDER_ID,
    name: 'Open Collective',
    type: 'oauth',
    authorization: `${PublicEnv.OPENCOLLECTIVE_WEBSITE_URL}/oauth/authorize?scope=${PublicEnv.OPENCOLLECTIVE_OAUTH_SCOPES}`,
    token: `${PublicEnv.OPENCOLLECTIVE_API_URL}/oauth/token`,
    userinfo: {
      url: `${PublicEnv.OPENCOLLECTIVE_API_URL}/graphql`,
      params: { query: queryToString(loggedInUserQuery) },
    },
    profile(result: LoggedInUserQueryResult) {
      return {
        id: result.data.me.id,
        email: result.data.me.email,
        image: result.data.me.imageUrl,
        name: result.data.me.name,
      };
    },
    options,
  };
}
