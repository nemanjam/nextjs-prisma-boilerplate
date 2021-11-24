import type { NextApiRequest, NextApiResponse } from 'next';
import prisma from 'lib/prisma';
import nc from 'lib/nc';

const handler = nc();
const getId = (req: NextApiRequest) => Number(req.query.id as string);

// GET, PATCH, DELETE /api/post/:id

const getPost = async (req: NextApiRequest, res: NextApiResponse) => {
  const post = await prisma.post.findUnique({ where: { id: getId(req) } });
  res.status(200).json({ post });
};

const updatePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const id = getId(req);
  const { title, content, published } = req.body;

  // if user or admin middleware

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
};

const deletePost = async (req: NextApiRequest, res: NextApiResponse) => {
  const post = await prisma.post.delete({
    where: { id: getId(req) },
  });

  res.status(204).json({ post });
};

handler.get(getPost);
handler.patch(updatePost);
handler.delete(deletePost);

export default handler;
