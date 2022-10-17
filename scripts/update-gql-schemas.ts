import * as fs from 'fs';
import * as path from 'path';

import { buildClientSchema } from 'graphql/utilities/buildClientSchema';
import { getIntrospectionQuery } from 'graphql/utilities/getIntrospectionQuery';
import { printSchema } from 'graphql/utilities/printSchema';
import fetch from 'node-fetch';

type GraphQLResponse = { data: any; errors?: any[] };

function getErrorMessage(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}

/**
 *
 * Fetch remote schema and turn it into string
 *
 * @param endpoint
 * @param options
 */
export async function getRemoteSchema(
  endpoint: string,
): Promise<{ status: 'ok'; schema: string } | { status: 'err'; message: string }> {
  try {
    const introspectionQuery = getIntrospectionQuery({ inputValueDeprecation: true, schemaDescription: true });
    const { data, errors } = await fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: introspectionQuery }),
    }).then(res => <Promise<GraphQLResponse>>res.json());

    if (errors) {
      return { status: 'err', message: JSON.stringify(errors, null, 2) };
    }

    const schema = buildClientSchema(data);
    return {
      status: 'ok',
      schema: printSchema(schema),
    };
  } catch (err) {
    return { status: 'err', message: getErrorMessage(err) };
  }
}

/**
 *
 * Prints schema to file.
 *
 * @param dist
 * @param schema
 */
export function printToFile(
  schema: string,
  filePath: string,
): { status: 'ok'; path: string } | { status: 'err'; message: string } {
  try {
    const output = path.resolve(process.cwd(), filePath);
    fs.writeFileSync(output, schema);
    return { status: 'ok', path: output };
  } catch (err) {
    console.error(getErrorMessage(err).slice(0, 100));
    return { status: 'err', message: getErrorMessage(err) };
  }
}

export async function main(endpoint: string, filePath: string): Promise<void> {
  /* Fetch schema */
  const schema = await getRemoteSchema(endpoint);

  if (schema.status === 'err') {
    console.error(schema.message);
  } else {
    printToFile(schema.schema, filePath);
  }
}

main(process.argv[2], process.argv[3]);
