// This is an example of how to read a JSON Web Token from an API route
import type { NextApiRequest, NextApiResponse } from 'next';
import { getToken } from 'next-auth/jwt';

import { PrivateEnv } from '../../../lib/env';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const token = await getToken({ req, secret: PrivateEnv.NEXTAUTH_SECRET });
  res.send(JSON.stringify(token, null, 2));
}
