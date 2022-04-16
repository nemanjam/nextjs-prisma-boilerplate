import { DefaultRequestBody, PathParams, rest } from 'msw';
import { PaginatedResponse } from 'types';
import { PostWithAuthor } from 'types/models/Post';
import { Routes } from 'lib-client/constants';
import { fakePosts, fakePostWithAuthor } from 'test/server/fake-data';
import { Post } from '@prisma/client';

const postsHandlers = [
  // usePost /api/posts/:id
  // must come first
  // both test and msw mock coupled to fakePostWithAuthor, maybe it could be better
  rest.get<DefaultRequestBody, PathParams, PostWithAuthor>(
    `${Routes.API.POSTS}:id`,
    (req, res, ctx) => {
      const postId = Number(req.params.id);

      // can be 0
      if (!isNaN(postId)) {
        return res(ctx.status(200), ctx.json(fakePostWithAuthor));
      }
    }
  ),
  // useUpdatePost
  // just forward what you received
  rest.patch<DefaultRequestBody, PathParams, PostWithAuthor>(
    `${Routes.API.POSTS}:id`,
    (req, res, ctx) => {
      const postId = Number(req.params.id);

      if (fakePostWithAuthor.id !== postId) throw new Error('Invalid fake post.id.');

      if (!isNaN(postId)) {
        const post = req.body as PostWithAuthor; // PostUpdateType, incomplete
        // username needed in useUpdatePost, updated title
        return res(ctx.status(200), ctx.json({ ...fakePostWithAuthor, ...post }));
      }
    }
  ),
  // 1. usePosts published=false
  // 2. usePosts ?searchTerm=xxx
  // 3. usePosts
  rest.get<DefaultRequestBody, PathParams, PaginatedResponse<PostWithAuthor>>(
    Routes.API.POSTS,
    (req, res, ctx) => {
      const searchTerm = req.url.searchParams.get('searchTerm');
      const published = req.url.searchParams.get('published');

      switch (true) {
        // 1.
        case published === 'false':
          // set posts.items.published = false
          const unpublishedPosts = {
            ...fakePosts,
            items: fakePosts.items.map((post) => ({ ...post, published: false })),
          };
          return res(ctx.status(200), ctx.json(unpublishedPosts));

        // 2.
        case !!searchTerm:
          const _fakePosts = {
            // return one user by title
            items: fakePosts.items.filter((post) => post.title === searchTerm),
            pagination: {
              total: 1,
              pagesCount: 1,
              currentPage: 1,
              perPage: 1,
              from: 1,
              to: 1,
              hasMore: false,
            },
          };
          return res(ctx.status(200), ctx.json(_fakePosts));

        // 3.
        default:
          return res(ctx.status(200), ctx.json(fakePosts));
      }
    }
  ),
  // useCreatePost
  rest.post<DefaultRequestBody, PathParams, Post>(Routes.API.POSTS, (req, res, ctx) => {
    const post = req.body as Post; // just forward what you received
    return res(ctx.status(200), ctx.json(post));
  }),
  // useDeletePost
  rest.delete<DefaultRequestBody, PathParams, PostWithAuthor>(
    `${Routes.API.POSTS}:id`,
    (req, res, ctx) => {
      const postId = Number(req.params.id);
      if (!isNaN(postId)) {
        return res(ctx.status(200), ctx.json(fakePostWithAuthor));
      }
    }
  ),
];

export default postsHandlers;
