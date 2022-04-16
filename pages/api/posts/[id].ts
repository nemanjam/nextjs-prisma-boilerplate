import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import nc, { ncOptions } from 'lib-server/nc';
import prisma, { excludeFromPost, getMe } from 'lib-server/prisma';
import { requireAuth } from 'lib-server/middleware/auth';
import ApiError from 'lib-server/error';
import { postIdNumberSchema, postUpdateSchema } from 'lib-server/validation';
import { PostWithAuthor } from 'types/models/Post';

const handler = nc(ncOptions);
const getId = (req: NextApiRequest) => Number(req.query.id as string);

const validatePostIdNumber = (id: number) => {
  const result = postIdNumberSchema.safeParse({ id });
  if (!result.success) throw ApiError.fromZodError((result as any).error);
};

const validatePostUpdate = withValidation({
  schema: postUpdateSchema,
  type: 'Zod',
  mode: 'body',
});

export const getPostWithAuthorById = async (id: number): Promise<PostWithAuthor> => {
  validatePostIdNumber(id);

  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  if (!post) throw new ApiError(`Post with id: ${id} not found.`, 404);

  return excludeFromPost(post);
};

// GET, PATCH, DELETE /api/post/:id

handler.get(async (req: NextApiRequest, res: NextApiResponse) => {
  const post = await getPostWithAuthorById(getId(req));
  res.status(200).json(post);
});

handler.patch(
  requireAuth,
  validatePostUpdate(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const id = getId(req);
    validatePostIdNumber(id);

    const result = postIdNumberSchema.safeParse({ id });
    if (!result.success) throw ApiError.fromZodError((result as any).error);

    const { title, content, published } = req.body;
    const me = await getMe({ req });

    const _post = await prisma.post.findUnique({
      where: {
        id,
      },
      include: {
        author: true,
      },
    });

    if (!_post) throw new ApiError(`Post with id:${id} not found.`, 404);

    if (!me || (me.id !== _post.author.id && me.role !== 'admin'))
      throw new ApiError('Not authorized.', 401);

    const data = {
      ...(title && { title }),
      ...(content && { content }),
      ...(typeof published === 'boolean' && { published }),
    };

    const post = await prisma.post.update({
      where: { id },
      data,
      include: {
        author: true,
      },
    });

    res.status(200).json(excludeFromPost(post));
  }
);

handler.delete(requireAuth, async (req: NextApiRequest, res: NextApiResponse) => {
  const id = getId(req);
  validatePostIdNumber(id);

  const post = await prisma.post.delete({
    where: { id },
    include: {
      author: true,
    },
  });

  if (!post) throw new ApiError(`Post with id:${id} not found.`, 404);

  res.status(204).json(excludeFromPost(post));
});

export default handler;
