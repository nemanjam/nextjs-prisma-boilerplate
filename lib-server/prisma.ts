import { PrismaClient } from '@prisma/client';
import { getSession, GetSessionParams } from 'next-auth/react';

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

/*
prisma.$use(async (params, next) => {
  const { model, action } = params;
  if (
    model == 'User' &&
    (action == 'findUnique' || action == 'findFirst' || action == 'findMany')
  ) {
    params.args.select = {
      id: true,
      username: true,
      name: true,
      email: true,
      provider: true,
      emailVerified: true,
      image: true,
      headerImage: true,
      bio: true,
      role: true,
      // accounts      Account[]
      // sessions      Session[]
      // posts         Post[]
      createdAt: true,
      updatedAt: true,
      password: false,
      //...params.args.select,
    };
  }
  return next(params);
});
*/

export const getMe = async (params: GetSessionParams) => {
  const session = await getSession(params);
  const id = session?.user.id;

  // filter password
  const me = await prisma.user.findUnique({ where: { id } });

  return me;
};

export default prisma;
