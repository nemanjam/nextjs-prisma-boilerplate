import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';
import prisma from 'lib/prisma';

// POST /api/post/create
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { method, body } = req;
  const session = await getSession({ req });

  switch (method) {
    case 'GET':
      // getServerSideProps does this already
      break;
    case 'POST':
      try {
        const { title, content } = body;

        const post = await prisma.post.create({
          data: {
            title: title,
            content: content,
            author: { connect: { email: session?.user?.email } },
          },
        });

        res.status(201).json({ post });
      } catch (error) {
        res.status(500).json({ error });
      }

      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
