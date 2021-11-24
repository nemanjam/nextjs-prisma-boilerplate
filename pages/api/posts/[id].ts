import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import nc, { ncOptions } from 'lib/nc';
import prisma from 'lib/prisma';
import { requireAuth } from '@lib/middleware/auth';
import ApiError from '@lib/error';

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
    const { title, content, published, user } = req.body;
    const session = await getSession({ req });

    if (user.id !== id && session.user.role !== 'admin') {
      throw new ApiError('Not authorized.', 401);
    }

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
