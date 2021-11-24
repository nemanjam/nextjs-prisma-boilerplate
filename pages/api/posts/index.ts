import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from 'lib/prisma';
import nc from 'lib/nc';

const handler = nc();

// getPosts - getServerSideProps does this already

// if auth middleware
// valid middleware

const createPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const { title, content } = req.body;
  const session = await getSession({ req }); // middleware...

  const post = await prisma.post.create({
    data: {
      title: title,
      content: content,
      author: { connect: { email: session?.user?.email } },
    },
  });

  res.status(201).json({ post });
};

handler.post(createPost);

export default handler;
