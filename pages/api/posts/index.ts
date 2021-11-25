import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import { getSession } from 'next-auth/react';

const handler = nc(ncOptions);

// getPosts - getServerSideProps does this already

// valid middleware

handler.post(requireAuth, async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, content } = req.body;
  const session = await getSession({ req });

  const post = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session.user.email } },
    },
  });

  res.status(201).json({ post });
});

export default handler;
