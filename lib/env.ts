/**
 * Sets default environment variables, in case `.env.local` hasn't been generated.
 * We use this file rather than `process.env` directly to make sure the code will be updated
 * when ported to the main Frontend.
 */

// This is the only place where we use `process.env` directly
/* eslint-disable no-process-env */

/**
 * Public environment variables that are exposed to the client.
 * **Do not add any secret here!**
 */
export const PublicEnv = {
  /** Node environment: development, production, test */
  NODE_ENV: process.env.NODE_ENV,
  /** URL of the API server */
  OPENCOLLECTIVE_API_URL: process.env.NEXT_PUBLIC_OPENCOLLECTIVE_API_URL,
  /** URL of the Frontend server */
  OPENCOLLECTIVE_WEBSITE_URL: process.env.NEXT_PUBLIC_OPENCOLLECTIVE_WEBSITE_URL,
  /** A comma-separated list of OAuth scopes to request from the API */
  OPENCOLLECTIVE_OAUTH_SCOPES: process.env.NEXT_PUBLIC_OPENCOLLECTIVE_OAUTH_SCOPES,
};

/**
 * Private environment variables that are **not** exposed to the client.
 * **Do not add any secret here!**
 */
export const PrivateEnv = {
  /** The ID of the OAuth app you created on the API */
  OPENCOLLECTIVE_OAUTH_APP_ID: process.env.OPENCOLLECTIVE_OAUTH_APP_ID,

  /**
   * Default OAuth app secret. Set on purpose to simplify the setup of the project.
   * This is not a security issue as this is a public app on a test server.
   */
  OPENCOLLECTIVE_OAUTH_APP_SECRET: process.env.OPENCOLLECTIVE_OAUTH_APP_SECRET,

  /* A random string used to encrypt JWTs */
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
};
