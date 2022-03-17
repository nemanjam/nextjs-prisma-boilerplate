import { DefaultRequestBody, PathParams, rest } from 'msw';
import { PaginatedResponse, PostWithAuthor } from 'types';
import { Routes } from 'lib-client/constants';
import { fakePosts } from 'test/server/fake-data';

const postsHandlers = [
  // 1. usePosts
  // 2. usePosts ?searchTerm=xxx
  rest.get<DefaultRequestBody, PathParams, PaginatedResponse<PostWithAuthor>>(
    Routes.API.POSTS,
    (req, res, ctx) => {
      const searchTerm = req.url.searchParams.get('searchTerm');

      if (!searchTerm) {
        // 1.
        return res(ctx.status(200), ctx.json(fakePosts));
      } else {
        // 2.
        // insert searchTerm at second posts title, return only second
        const _fakePosts = {
          ...fakePosts,
          items: [
            { ...fakePosts.items[1], title: `${searchTerm} ${fakePosts.items[1].title}` },
          ],
        };
        return res(ctx.status(200), ctx.json(_fakePosts));
      }
    }
  ),
];

export default postsHandlers;
