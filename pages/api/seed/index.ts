import { NextApiRequest, NextApiResponse } from 'next';
import { apiHandler } from 'lib-server/nc';

const handler = apiHandler();

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  require('../../../prisma/seed.js');
  res.status(200).json({ sucess: true });
});

export default handler;
