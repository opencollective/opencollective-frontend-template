/* eslint-disable no-unused-vars */
import { DefaultSession } from 'next-auth';

// Read more at: https://next-auth.js.org/getting-started/typescript#module-augmentation

declare module 'next-auth' {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session extends DefaultSession {
    accessToken: string;
  }
}
