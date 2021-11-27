import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import prisma from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import { getSession } from 'next-auth/react';
import { postCreateSchema } from 'lib-server/validation';

const handler = nc(ncOptions);

const validatePostCreate = withValidation({
  schema: postCreateSchema,
  type: 'Zod',
  mode: 'body',
});

// getPosts - getServerSideProps does this already

handler.post(
  requireAuth,
  validatePostCreate,
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { title, content } = req.body;
    const session = await getSession({ req });
    console.log('run 123');
    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { email: session!.user.email as string } },
      },
    });

    res.status(201).json({ post });
  }
);

export default handler;
