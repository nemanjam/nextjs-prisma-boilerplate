import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import { apiHandler } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import { postUpdateSchema, validatePostIdNumber } from 'lib-server/validation';
import { PostWithAuthor } from 'types/models/Post';
import { getMe } from '@lib-server/services/users';
import { deletePost, getPost, updatePost } from '@lib-server/services/posts';

const handler = apiHandler();
const getId = (req: NextApiRequest) => Number(req.query.id as string);

const validatePostUpdate = withValidation({
  schema: postUpdateSchema,
  type: 'Zod',
  mode: 'body',
});

// GET, PATCH, DELETE /api/post/:id

handler.get(async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
  const id = getId(req);
  validatePostIdNumber(id);

  const post = await getPost(id);
  res.status(200).json(post);
});

handler.patch(
  requireAuth,
  validatePostUpdate(),
  async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
    const id = getId(req);
    validatePostIdNumber(id);
    const me = await getMe({ req });

    const post = await updatePost(id, me, req.body);
    res.status(200).json(post);
  }
);

handler.delete(
  requireAuth,
  async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
    const id = getId(req);
    validatePostIdNumber(id);

    const post = await deletePost(id);
    res.status(204).json(post);
  }
);

export default handler;
