import NextAuth from 'next-auth';
import type { OAuthConfig, OAuthUserConfig } from 'next-auth/providers';

export interface OpenCollectiveProfile extends Record<string, any> {
  id: string;
  name: string;
  email: string;
  imageUrl: string;
}

const apiUrl = process.env.OPENCOLLECTIVE_API_URL || 'https://api.opencollective.com';
const websiteUrl = process.env.OPENCOLLECTIVE_WEBSITE_URL || 'https://opencollective.com';

function OpenCollective<P extends OpenCollectiveProfile>(options: OAuthUserConfig<P>): OAuthConfig<P> {
  return {
    id: 'opencollective',
    name: 'Open Collective',
    type: 'oauth',
    authorization: `${websiteUrl}/oauth/authorize?scope=email`,
    token: `${apiUrl}/oauth/token`,
    userinfo: {
      url: `${apiUrl}/graphql`,
      params: {
        query: '{me{id name email imageUrl}}',
      },
    },
    profile({ data: { me: profile } }) {
      return {
        id: profile.id,
        name: profile.name,
        email: profile.email,
        image: profile.imageUrl,
      };
    },
    options,
  };
}

export default NextAuth({
  providers: [
    OpenCollective({
      clientId: process.env.OPENCOLLECTIVE_ID,
      clientSecret: process.env.OPENCOLLECTIVE_SECRET,
    }),
  ],
  theme: {
    colorScheme: 'light',
  },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },

    async session({ session, token }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
