import { NextApiRequest, NextApiResponse } from 'next';
import nc, { ncOptions } from 'lib-server/nc';

const handler = nc(ncOptions);

handler.post(async (req: NextApiRequest, res: NextApiResponse) => {
  require('../../../prisma/seed.js');
  res.status(200).json({ sucess: true });
});

export default handler;
