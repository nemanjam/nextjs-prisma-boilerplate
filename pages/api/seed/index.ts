import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'lib-server/nc';
import prisma from 'lib-server/prisma';
const { SeedSingleton } = require('../../../prisma/seed.js');

const handler = apiHandler();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  SeedSingleton.getInstance(prisma).run();
  res.status(200).json({ sucess: true });
});

// allow seed from browser too on: /api/seed/
handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  SeedSingleton.getInstance(prisma).run();
  res.status(200).json({ sucess: true });
});

export default handler;
