import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import { apiHandler } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import {
  postIdNumberSchema,
  postUpdateSchema,
  validatePostIdNumber,
} from 'lib-server/validation';
import { PostWithAuthor } from 'types/models/Post';
import { getMe } from 'lib-server/services/users';
import { deletePost, getPost, updatePost } from 'lib-server/services/posts';
import ApiError from 'lib-server/error';

const handler = apiHandler();

const validatePostUpdate = withValidation({
  schema: postUpdateSchema,
  type: 'Zod',
  mode: 'body',
});

const validatePostId = withValidation({
  schema: postIdNumberSchema,
  type: 'Zod',
  mode: 'query',
});

// GET, PATCH, DELETE /api/post/:id

handler.get(
  validatePostId(),
  async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
    const id = validatePostIdNumber(req.query.id as string);

    const post = await getPost(id);

    // only owner can see his draft post
    if (post.published === false) {
      const me = await getMe({ req });

      if (me?.id !== post.author.id) {
        throw new ApiError('Post not found.', 404);
      }
    }

    res.status(200).json(post);
  }
);

handler.patch(
  requireAuth,
  validatePostId(),
  validatePostUpdate(),
  async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
    const id = validatePostIdNumber(req.query.id as string);

    const me = await getMe({ req });
    if (!me) throw new ApiError('Not logged in.', 401); // just type check

    // will throw
    const _post = await getPost(id);

    // custom permissions check, neither owner nor admin
    if (!me || (me.id !== _post.author.id && me.role !== 'admin'))
      throw new ApiError('Not authorized.', 401);

    const post = await updatePost(_post.id, req.body);
    res.status(200).json(post);
  }
);

handler.delete(
  requireAuth,
  validatePostId(),
  async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
    const id = validatePostIdNumber(req.query.id as string);

    const post = await deletePost(id);
    res.status(204).json(post);
  }
);

export default handler;
