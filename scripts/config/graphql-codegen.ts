// eslint-disable-next-line node/no-unpublished-import
import { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  documents: ['(pages|components|lib)/**/*.(ts|tsx|js|jsx)'],
  config: {
    namingConvention: {
      enumValues: 'keep', // Otherwise we end up with duplicate enum value, e.g. in PaymentMethodType where we have "creditcard" (deprecated) and "CREDITCARD"
    },
  },
  generates: {
    './lib/graphql/types/v2': {
      preset: 'gql-tag-operations-preset',
      schema: './lib/graphql/schemaV2.graphql',
      plugins: [],
      presetConfig: {
        augmentedModuleName: '@apollo/client',
        gqlTagName: 'useQuery',
      },
    },
  },
};

export default config;
