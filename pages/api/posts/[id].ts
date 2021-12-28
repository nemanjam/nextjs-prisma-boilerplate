import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import { withValidation } from 'next-validations';
import nc, { ncOptions } from 'lib-server/nc';
import prisma from 'lib-server/prisma';
import { requireAuth } from 'lib-server/middleware/auth';
import ApiError from 'lib-server/error';
import { postUpdateSchema } from 'lib-server/validation';

const handler = nc(ncOptions);
const getId = (req: NextApiRequest) => Number(req.query.id as string);

const validatePostUpdate = withValidation({
  schema: postUpdateSchema,
  type: 'Zod',
  mode: 'body',
});

// GET, PATCH, DELETE /api/post/:id

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const post = await prisma.post.findUnique({ where: { id: getId(req) } });
  res.status(200).json({ post });
});

handler.patch(
  requireAuth,
  validatePostUpdate(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const id = getId(req);
    const { title, content, published } = req.body;
    const session = await getSession({ req });

    const _post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });

    if (!_post) throw new ApiError(`Post with id:${id} not found.`, 404);

    if (session?.user.id !== _post.author.id && session?.user.role !== 'admin')
      throw new ApiError('Not authorized.', 401);

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

handler.delete(requireAuth, async (req: NextApiRequest, res: NextApiResponse) => {
  const post = await prisma.post.delete({
    where: { id: getId(req) },
  });

  res.status(204).json({ post });
});

export default handler;
