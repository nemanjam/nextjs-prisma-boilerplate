import { DefaultRequestBody, PathParams, rest } from 'msw';
import { PaginatedResponse, PostWithAuthor } from 'types';
import { Routes } from 'lib-client/constants';
import { fakePosts } from 'test/server/fake-data';

const postsHandlers = [
  // usePosts
  rest.get<DefaultRequestBody, PathParams, PaginatedResponse<PostWithAuthor>>(
    Routes.API.POSTS,
    (req, res, ctx) => {
      // const name = req.url.searchParams.get('name') || 'Unknown';
      return res(ctx.status(200), ctx.json(fakePosts));
    }
  ),
];

export default postsHandlers;
