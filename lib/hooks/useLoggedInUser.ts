import React from 'react';
import { useQuery } from '@apollo/client';
import { signOut } from 'next-auth/react';

import { OAuthLoggedInUserQuery, OAuthLoggedInUserQueryVariables } from '../graphql/types/v2/graphql';
import { loggedInUserQuery } from '../opencollective-oauth-config';

/**
 * A custom hook that subscribes to changes in the user session. It is meant to reproduce the behavior
 * of `opencollective-frontend/lib/hooks/useLoggedInUser.js` to make it easier to port the code.
 */
export const useLoggedInUser = () => {
  const { data, loading, refetch, error } = useQuery<OAuthLoggedInUserQuery, OAuthLoggedInUserQueryVariables>(
    loggedInUserQuery,
  );

  const logout = React.useCallback(() => signOut(), []);
  return {
    loadingLoggedInUser: loading,
    errorLoggedInUser: error,
    refetchLoggedInUser: refetch,
    logout,
    LoggedInUser: !data?.me
      ? null
      : {
          id: data.me.id,
          email: data.me.email,
          collective: data.me,
        },
  };
};
