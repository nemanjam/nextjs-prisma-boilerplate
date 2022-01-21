import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import prisma from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import { getSession } from 'next-auth/react';
import { postCreateSchema } from 'lib-server/validation';
import { PostWithAuthor } from 'types';

const handler = nc(ncOptions);

const validatePostCreate = withValidation({
  schema: postCreateSchema,
  type: 'Zod',
  mode: 'body',
});

// fn reused in getServerSideProps
export const getPostsWithAuthor = async (): Promise<PostWithAuthor[]> => {
  let posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: true,
    },
  });

  posts = posts?.length > 0 ? posts : [];
  return posts; // fix type
};

// add pagination
handler.get(async (_req: NextApiRequest, res: NextApiResponse) => {
  const posts = await getPostsWithAuthor();
  res.status(200).json({ posts });
});

handler.post(
  requireAuth,
  validatePostCreate(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { title, content } = req.body;
    const session = await getSession({ req });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { email: session.user.email as string } },
      },
    });

    res.status(201).json({ post });
  }
);

export default handler;
