/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

declare module "@apollo/client" {

  export function useQuery(source: "\n  query OAuthLoggedInUser {\n    me {\n      id\n      name\n      email\n      imageUrl(height: 90)\n      type\n    }\n  }\n"): typeof import('./graphql').OAuthLoggedInUserDocument;
  export function useQuery(source: string): unknown;

    export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<    infer TType,    any  >    ? TType    : never;  
}