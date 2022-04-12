import { NextApiRequest, NextApiResponse } from 'next';
import { hash } from 'bcryptjs';
import { withValidation } from 'next-validations';
import prisma, { exclude, excludeFromUser } from 'lib-server/prisma';
import nc, { ncOptions } from 'lib-server/nc';
import ApiError from 'lib-server/error';
import { usersGetSchema, userRegisterSchema } from 'lib-server/validation';
import { PaginatedResponse, QueryParamsType } from 'types';
import { ClientUser } from 'types';

const handler = nc(ncOptions);

const validateUserRegister = withValidation({
  schema: userRegisterSchema.innerType().omit({
    confirmPassword: true,
  }),
  type: 'Zod',
  mode: 'body',
});

const validateUsersGet = withValidation({
  schema: usersGetSchema,
  type: 'Zod',
  mode: 'query',
});

/**
 * POST /api/users - register
 * Required fields in body: name, username, email, password
 */
handler.post(
  validateUserRegister(),
  async (req: NextApiRequest, res: NextApiResponse) => {
    const { name, username, email, password: _password } = req.body;

    const _user = await prisma.user.findFirst({
      where: { email },
    });

    if (_user) throw new ApiError(`Email: ${email} already exists.`, 403);

    const password = await hash(_password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password,
        // role: 'user' // default
      },
    });

    res.status(201).json(excludeFromUser(user));
  }
);

type SortDirectionType = 'asc' | 'desc';

export type GetUsersQueryParams = {
  page: number;
  limit?: number;
  searchTerm?: string;
  sortDirection?: SortDirectionType;
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_USERS_PER_PAGE);

export const getUsers = async (
  query: QueryParamsType
): Promise<PaginatedResponse<ClientUser>> => {
  const validationResult = usersGetSchema.safeParse(query);
  if (!validationResult.success)
    throw ApiError.fromZodError((validationResult as any).error);

  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sortDirection = 'desc',
  } = validationResult.data;

  const where = {
    where: {
      ...(searchTerm && {
        OR: [
          {
            name: {
              search: searchTerm,
            },
          },
          {
            username: {
              search: searchTerm,
            },
          },
          {
            email: {
              search: searchTerm,
            },
          },
        ],
      }),
    },
  };

  const totalCount = await prisma.user.count({ ...where });

  const users = await prisma.user.findMany({
    ...where,
    skip: (page - 1) * limit,
    take: limit,
    orderBy: {
      createdAt: sortDirection as SortDirectionType,
    },
  });

  const result = {
    items: users.map((user) => excludeFromUser(user)),
    pagination: {
      total: totalCount,
      pagesCount: Math.ceil(totalCount / limit),
      currentPage: page,
      perPage: limit,
      from: (page - 1) * limit + 1,
      to: (page - 1) * limit + users.length,
      hasMore: page < Math.ceil(totalCount / limit),
    },
  };

  return result;
};

handler.get(validateUsersGet(), async (req: NextApiRequest, res: NextApiResponse) => {
  const users = await getUsers(req.query);
  res.status(200).json(users);
});

export default handler;
