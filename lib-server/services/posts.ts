import prisma, { excludeFromPost } from 'lib-server/prisma';
import ApiError from 'lib-server/error';
import {
  PostCreateData,
  PostsGetData,
  PostUpdateData,
  PostWithAuthor,
} from 'types/models/Post';
import { PaginatedResponse, SortDirection } from 'types';

// -------- pages/api/posts/[id].ts

export const getPost = async (id: number): Promise<PostWithAuthor> => {
  const post = await prisma.post.findUnique({
    where: { id },
    include: {
      author: true,
    },
  });

  if (!post) throw new ApiError(`Post with id: ${id} not found.`, 404);

  return excludeFromPost(post);
};

export const updatePost = async (
  id: number,
  postUpdateData: PostUpdateData
): Promise<PostWithAuthor> => {
  const { title, content, published } = postUpdateData;

  // redundant, just that service can be standalone
  const _post = await prisma.post.findUnique({ where: { id } });
  if (!_post) throw new ApiError(`Post with id: ${id} not found.`, 404);

  const data = {
    ...(title && { title }),
    ...(content && { content }),
    ...(typeof published === 'boolean' && { published }),
  };

  const post = await prisma.post.update({
    where: { id },
    data,
    include: {
      author: true,
    },
  });

  if (!post) throw new ApiError('Update post failed.', 400);

  return excludeFromPost(post);
};

export const deletePost = async (id: number): Promise<PostWithAuthor> => {
  const _post = await prisma.post.findUnique({ where: { id } });
  if (!_post) throw new ApiError(`Post with id: ${id} not found.`, 404);

  const post = await prisma.post.delete({
    where: { id },
    include: {
      author: true,
    },
  });

  if (!post) throw new ApiError('Delete post failed.', 400);

  return excludeFromPost(post);
};

// ---------- pages/api/posts/index.ts

export const createPost = async (
  userId: string,
  postCreateData: PostCreateData
): Promise<PostWithAuthor> => {
  const { title, content } = postCreateData;

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw new ApiError(`Invalid user id: ${userId} not found.`, 400);

  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { id: userId } },
    },
  });

  if (!post) throw new ApiError('Post not created.', 400);

  // convert Post to PostWithAuthor
  const postWithAuthor = await prisma.post.findUnique({
    where: {
      id: post.id,
    },
    include: {
      author: true,
    },
  });

  if (!postWithAuthor) throw new ApiError('Create post failed.', 400);

  return excludeFromPost(postWithAuthor);
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export const getPosts = async (
  postsGetData: PostsGetData = {}
): Promise<PaginatedResponse<PostWithAuthor>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    userId,
    email,
    username,
    sortDirection = 'desc',
    published = true,
  } = postsGetData;

  const where = {
    where: {
      published,
      ...(username && {
        author: {
          OR: [
            {
              id: userId,
            },
            {
              email,
            },
            {
              username,
            },
          ],
        },
      }),
      ...(searchTerm && {
        OR: [
          {
            title: {
              search: searchTerm,
            },
          },
          {
            content: {
              search: searchTerm,
            },
          },
          {
            author: {
              username: {
                search: searchTerm,
              },
            },
          },
          {
            author: {
              name: {
                search: searchTerm,
              },
            },
          },
        ],
      }),
    },
  };

  const totalCount = await prisma.post.count({ ...where });

  let posts = await prisma.post.findMany({
    ...where,
    skip: (page - 1) * limit,
    take: limit,
    include: {
      author: true,
    },
    orderBy: {
      updatedAt: sortDirection as SortDirection,
    },
  });

  posts = Array.isArray(posts) ? posts : [];

  const result = {
    items: posts.map((post) => excludeFromPost(post)),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1, // from item
      to: (page - 1) * limit + posts.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  // Math.ceil(1.4) = 2
  // 23 1..10, 11..20, 21..23

  return result;
};
