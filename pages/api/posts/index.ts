import type { NextApiRequest, NextApiResponse } from 'next';
import { withValidation } from 'next-validations';
import prisma from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import { requireAuth } from 'lib-server/middleware/auth';
import { getSession } from 'next-auth/react';
import { postCreateSchema, postsGetSchema } from 'lib-server/validation';
import { PostWithAuthor } from 'types';

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

type QueryParamsType = {
  [key: string]: string | string[];
};

export type GetPostsQueryParams = {
  page?: number;
  limit?: number;
  searchTerm?: string;
};

const DEFAULT_LIMIT = 10;

// fn reused in getServerSideProps
export const getPostsWithAuthor = async (
  query: QueryParamsType
): Promise<PostWithAuthor[]> => {
  const validationResult = postsGetSchema.safeParse(query);
  if (!validationResult.success) return []; // throw 404 in getServerSideProps

  const { page = 1, limit = DEFAULT_LIMIT, searchTerm } = validationResult.data;

  const where = {
    where: {
      published: true,
      ...(searchTerm && {
        OR: [
          { title: { search: searchTerm } },
          {
            author: {
              name: { search: searchTerm },
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
  });

  posts = Array.isArray(posts) ? posts : [];

  const response = {
    posts,
    pagination: {
      total: totalCount,
      pageCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1,
      to: (page - 1) * limit + posts.length,
    },
  };

  return response;
};

// add pagination
handler.get(validatePostsGet(), async (req: NextApiRequest, res: NextApiResponse) => {
  const posts = await getPostsWithAuthor(req.query);
  res.status(200).json({ posts });
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

    res.status(201).json({ post });
  }
);

export default handler;
