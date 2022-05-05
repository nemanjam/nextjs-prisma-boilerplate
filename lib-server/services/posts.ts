import prisma, { excludeFromPost } from 'lib-server/prisma';
import ApiError from 'lib-server/error';
import {
  PostCreateData,
  PostsGetSearchQueryParams,
  PostUpdateData,
  PostWithAuthor,
} from 'types/models/Post';
import { ClientUser } from 'types/models/User';
import { PaginatedResponse, SortDirection } from 'types';

// -------- pages/api/posts/[id].ts

export const getPost = async (id: number): Promise<PostWithAuthor> => {
  const post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  if (!post) throw new ApiError(`Post with id: ${id} not found.`, 404);

  return excludeFromPost(post);
};

export const updatePost = async (
  id: number,
  me: ClientUser,
  updateData: PostUpdateData
): Promise<PostWithAuthor> => {
  const { title, content, published } = updateData;

  const _post = await prisma.post.findUnique({
    where: {
      id,
    },
    include: {
      author: true,
    },
  });

  if (!_post) throw new ApiError(`Post with id:${id} not found.`, 404);

  if (!me || (me.id !== _post.author.id && me.role !== 'admin'))
    throw new ApiError('Not authorized.', 401);

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

  return excludeFromPost(post);
};

export const deletePost = async (id: number): Promise<PostWithAuthor> => {
  const post = await prisma.post.delete({
    where: { id },
    include: {
      author: true,
    },
  });

  if (!post) throw new ApiError(`Post with id:${id} not found.`, 404);

  return excludeFromPost(post);
};

// ---------- pages/api/posts/index.ts

export const createPost = async (
  me: ClientUser,
  createData: PostCreateData
): Promise<PostWithAuthor> => {
  const { title, content } = createData;

  if (!me) throw new ApiError('You are not logged in.', 401);

  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: { connect: { id: me.id } },
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

  if (!postWithAuthor) throw new ApiError('Created post not found.', 404);

  return excludeFromPost(postWithAuthor);
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

export const getPosts = async (
  getSearchData: PostsGetSearchQueryParams = {}
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
  } = getSearchData;

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
