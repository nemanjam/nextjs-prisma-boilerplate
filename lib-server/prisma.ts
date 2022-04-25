import { Post, PrismaClient, User } from '@prisma/client';
import { ClientUser } from 'types/models/User';
import { PostWithAuthor } from 'types/models/Post';

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

export default prisma;
