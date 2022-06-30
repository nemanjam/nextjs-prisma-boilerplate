import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import { apiHandler } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import {
  postCreateSchema,
  postsGetSchema,
  validatePostsSearchQueryParams,
} from 'lib-server/validation';
import { PostWithAuthor } from 'types/models/Post';
import { PaginatedResponse } from 'types';
import { getMe } from 'lib-server/services/users';
import { createPost, getPosts } from 'lib-server/services/posts';
import ApiError from 'lib-server/error';

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
    // just to convert types
    const parsedData = validatePostsSearchQueryParams(req.query);

    const { published, userId } = parsedData;
    const me = await getMe({ req });

    if (published === false && userId && me && me?.id !== userId)
      throw new ApiError('You can not read draft posts of another user.', 401);

    const posts = await getPosts(parsedData);
    res.status(200).json(posts);
  }
);

handler.post(
  requireAuth, // checks session already
  validatePostCreate(),
  async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
    const me = await getMe({ req });
    if (!me) throw new ApiError('You are not logged in.', 401);

    const post = await createPost(me.id, req.body);
    res.status(201).json(post);
  }
);

export default handler;
