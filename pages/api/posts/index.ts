import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import prisma from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import { getSession } from 'next-auth/react';
import { postCreateSchema, postsGetSchema } from 'lib-server/validation';
import { PostWithAuthor, PaginatedResponse, QueryParamsType } from 'types';

const handler = nc(ncOptions);

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

type SortDirectionType = 'asc' | 'desc';
type SortFieldType = 'updatedAt' | 'title' | 'name';

// used on client only, in usePosts
export type GetPostsQueryParams = {
  page: number;
  limit?: number;
  userId?: string;
  email?: string;
  username?: string;
  searchTerm?: string;
  sortField?: SortFieldType;
  sortDirection?: SortDirectionType;
  published?: boolean;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

// fn reused in getServerSideProps
export const getPostsWithAuthor = async (
  query: QueryParamsType
): Promise<PaginatedResponse<PostWithAuthor>> => {
  const validationResult = postsGetSchema.safeParse(query);
  if (!validationResult.success) return; // throw 404 in getServerSideProps

  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    userId,
    email,
    username,
    sortField = 'updatedAt',
    sortDirection: _sortDirection,
    published = true,
  } = validationResult.data;

  // default sortDirection
  const sortDirection = _sortDirection
    ? (_sortDirection as SortDirectionType)
    : sortField === 'updatedAt'
    ? 'desc'
    : 'asc';

  if (username) {
    const user = await prisma.user.findUnique({ where: { username } });
    if (!user) return; // throw 404
  }

  // for count
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
    // sort and text search
    orderBy: {
      ...(sortField === 'updatedAt' && { updatedAt: sortDirection }),
      ...(sortField === 'title' && {
        _relevance: {
          fields: ['title'],
          search: searchTerm,
          sort: sortDirection,
        },
      }),
      ...(!username &&
        sortField === 'name' && {
          author: {
            _relevance: {
              fields: ['name'],
              search: searchTerm,
              sort: sortDirection,
            },
          },
        }),
    },
  });

  posts = Array.isArray(posts) ? posts : [];

  const result = {
    items: posts,
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

handler.get(validatePostsGet(), async (req: NextApiRequest, res: NextApiResponse) => {
  const posts = await getPostsWithAuthor(req.query);
  res.status(200).json(posts);
});

handler.post(
  requireAuth,
  validatePostCreate(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { title, content } = req.body;
    const session = await getSession({ req });

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { email: session.user.email as string } },
      },
    });

    res.status(201).json(post);
  }
);

export default handler;
