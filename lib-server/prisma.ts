import { PrismaClient } from '@prisma/client';
import { getSession, GetSessionParams } from 'next-auth/react';
import { ClientUser } from 'types';

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

export const getMe = async (params: GetSessionParams) => {
  const session = await getSession(params);
  const id = session?.user?.id;

  if (!id) return null;

  // filter password
  const me = await prisma.user.findUnique({ where: { id } });

  return exclude(me, 'password') as ClientUser;
};

export default prisma;
