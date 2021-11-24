import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import nc, { ncOptions } from 'lib/nc';
import { requireAuth } from '@lib/middleware/auth';

const handler = nc(ncOptions);

// getPosts - getServerSideProps does this already

// valid middleware

handler.post(requireAuth, async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, content } = req.body;

  const post = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: req.user.email } },
    },
  });

  res.status(201).json({ post });
});

export default handler;
