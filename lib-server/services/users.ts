import ApiError from 'lib-server/error';
import prisma, { excludeFromUser } from 'lib-server/prisma';
import { hash } from 'bcryptjs';
import { getSession, GetSessionParams } from 'next-auth/react';
import { PaginatedResponse, SortDirection } from 'types';
import {
  ClientUser,
  UserCreateData,
  UserGetQueryParams,
  UsersGetSearchQueryParams,
  UserUpdateServiceData,
} from 'types/models/User';

/**
 *
 * @returns null on fail, doesn't throw exception, user is not logged in
 *
 */
export const getMe = async (params: GetSessionParams): Promise<ClientUser | null> => {
  const session = await getSession(params);
  const id = session?.user?.id;

  if (!id) return null;

  const me = await prisma.user.findUnique({ where: { id } });

  if (!me) return null;

  return excludeFromUser(me);
};

// -------- pages/api/users/[id].ts

export const getUser = async (id: string): Promise<ClientUser> => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) throw new ApiError(`User with id: ${id} not found.`, 404);

  return excludeFromUser(user);
};

export const updateUser = async (
  id: string,
  updateData: UserUpdateServiceData
): Promise<ClientUser> => {
  const { name, username, bio, password, files } = updateData; // email reconfirm...

  const data = {
    ...(name && { name }),
    ...(username && { username }),
    ...(bio && { bio }),
    ...(files?.avatar?.length > 0 && { image: files.avatar[0].filename }),
    ...(files?.header?.length > 0 && { headerImage: files.header[0].filename }),
    ...(password && { password: await hash(password, 10) }),
  };

  const user = await prisma.user.update({
    where: { id },
    data,
  });

  if (!user) throw new ApiError('Update user failed.', 400);

  return excludeFromUser(user);
};

export const deleteUser = async (id: string): Promise<ClientUser> => {
  const _user = await prisma.user.findUnique({ where: { id } });
  if (!_user) throw new ApiError('User not found.', 404);

  // delete posts too, cascade defined in schema
  const user = await prisma.user.delete({ where: { id } });
  if (!user) throw new ApiError('Delete user failed.', 400);

  return excludeFromUser(user);
};

// -------- pages/api/users/index.ts

export const createUser = async (createData: UserCreateData): Promise<ClientUser> => {
  const { name, username, email, password: _password } = createData;

  const _user = await prisma.user.findFirst({
    where: { email },
  });

  if (_user) throw new ApiError(`User with email: ${email} already exists.`, 409);

  const password = await hash(_password, 10);

  const user = await prisma.user.create({
    data: {
      name,
      username,
      email,
      password,
      // role: 'user' // create admin through database...
    },
  });

  return excludeFromUser(user);
};

const defaultLimit = parseInt(process.env.NEXT_PUBLIC_USERS_PER_PAGE);

export const getUsers = async (
  usersSearchData: UsersGetSearchQueryParams = {}
): Promise<PaginatedResponse<ClientUser>> => {
  const {
    page = 1,
    limit = defaultLimit,
    searchTerm,
    sortDirection = 'desc',
  } = usersSearchData;

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
      createdAt: sortDirection as SortDirection,
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

// -------- pages/api/users/profile.ts

export const getUserByIdOrUsernameOrEmail = async (
  userSearchData: UserGetQueryParams = {}
): Promise<ClientUser> => {
  const { id, username, email } = userSearchData;

  const user = await prisma.user.findFirst({
    where: { OR: [{ id }, { username }, { email }] },
  });

  if (!user) throw new ApiError('User not found.', 404);

  return excludeFromUser(user);
};
