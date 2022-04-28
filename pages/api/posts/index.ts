import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import { apiHandler } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import { postCreateSchema, postsGetSchema } from 'lib-server/validation';
import { PostWithAuthor } from 'types/models/Post';
import { PaginatedResponse } from 'types';
import { getMe } from 'lib-server/services/users';
import { createPost, getPosts } from 'lib-server/services/posts';

const handler = apiHandler();

const validatePostCreate = withValidation({
  schema: postCreateSchema,
  type: 'Zod',
  mode: 'body',
});

const validatePostsGet = withValidation({
  schema: postsGetSchema,
  type: 'Zod',
  mode: 'query',
});

handler.get(
  validatePostsGet(),
  async (
    req: NextApiRequest,
    res: NextApiResponse<PaginatedResponse<PostWithAuthor>>
  ) => {
    // console.log('req.query', req.query);
    // convert types...
    const posts = await getPosts(req.query);
    res.status(200).json(posts);
  }
);

handler.post(
  requireAuth, // checks session already
  validatePostCreate(),
  async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
    const me = await getMe({ req });

    const post = await createPost(me, req.body);
    res.status(201).json(post);
  }
);

export default handler;
