import { Post, PrismaClient, User } from '@prisma/client';
import { getSession, GetSessionParams } from 'next-auth/react';
import { ClientUser } from 'types/models/User';
import { PostWithAuthor } from 'types/models/Post';
import ApiError from 'lib-server/error';

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

/**
 * https://www.prisma.io/docs/concepts/components/prisma-client/excluding-fields
 */
export const exclude = <T, Key extends keyof T>(
  model: T,
  ...keys: Key[]
): Omit<T, Key> => {
  if (!model) return null;

  for (const key of keys) {
    delete model[key];
  }
  return model;
};

export const excludeFromPost = (
  post: Post & {
    author: User;
  }
): PostWithAuthor => {
  return {
    ...post,
    author: exclude(post.author, 'password'),
  };
};

export const excludeFromUser = (user: User): ClientUser => {
  return exclude(user, 'password');
};

export const getMe = async (params: GetSessionParams): Promise<ClientUser> => {
  const session = await getSession(params);
  const id = session?.user?.id;

  if (!id) throw new ApiError(`Invalid session.user.id: ${id}.`, 400);

  // filter password
  const me = await prisma.user.findUnique({ where: { id } });

  return excludeFromUser(me);
};

export default prisma;
