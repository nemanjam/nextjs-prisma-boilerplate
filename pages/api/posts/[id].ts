import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import nc, { ncOptions } from 'lib/nc';
import { requireAuth } from '@lib/middleware/auth';

const handler = nc(ncOptions);
const getId = (req: NextApiRequest) => Number(req.query.id as string);

// GET, PATCH, DELETE /api/post/:id

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const post = await prisma.post.findUnique({ where: { id: getId(req) } });
  res.status(200).json({ post });
});

handler.patch(
  requireAuth,
  async (req: NextApiRequest, res: NextApiResponse) => {
    const id = getId(req);
    const { title, content, published } = req.body;

    // if owner or admin middleware

    const data = {
      ...(title && { title }),
      ...(content && { content }),
      ...(typeof published === 'boolean' && { published }),
    };

    const post = await prisma.post.update({
      where: { id },
      data,
    });

    res.status(200).json({ post });
  }
);

handler.delete(
  requireAuth,
  async (req: NextApiRequest, res: NextApiResponse) => {
    const post = await prisma.post.delete({
      where: { id: getId(req) },
    });

    res.status(204).json({ post });
  }
);

export default handler;
