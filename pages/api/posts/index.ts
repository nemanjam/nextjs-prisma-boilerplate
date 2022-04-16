import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import prisma, { excludeFromPost } from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import { getSession } from 'next-auth/react';
import { postCreateSchema, postsGetSchema } from 'lib-server/validation';
import { PostWithAuthor, PaginatedResponse } from 'types/models/response';
import { QueryParamsType } from 'types';
import ApiError from 'lib-server/error';

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

// used on client only, in usePosts
export type GetPostsQueryParams = {
  page: number;
  limit?: number;
  userId?: string;
  email?: string;
  username?: string;
  searchTerm?: string;
  sortDirection?: SortDirectionType;
  published?: boolean;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_POSTS_PER_PAGE);

// fn reused in getServerSideProps
export const getPostsWithAuthor = async (
  query: QueryParamsType
): Promise<PaginatedResponse<PostWithAuthor>> => {
  //
  const validationResult = postsGetSchema.safeParse(query);
  if (!validationResult.success)
    throw ApiError.fromZodError((validationResult as any).error);

  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    userId,
    email,
    username,
    sortDirection = 'desc',
    published = true,
  } = validationResult.data;

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
      updatedAt: sortDirection as SortDirectionType,
    },
  });

  posts = Array.isArray(posts) ? posts : [];

  // console.log('where === ', JSON.stringify(where, null, 2));
  // console.log('totalCount', totalCount);

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

    if (!session?.user?.id) throw new ApiError('Not authorized.', 401);

    const post = await prisma.post.create({
      data: {
        title,
        content,
        author: { connect: { id: session.user.id as string } },
      },
    });

    // only this returns Post instead of PostWithAuthor
    res.status(201).json(post);
  }
);

export default handler;
