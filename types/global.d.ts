import { PrismaClient } from '@prisma/client';

// just for global.prisma in lib-server/prisma.ts
declare global {
  /* eslint-disable no-var */
  var prisma: PrismaClient;

  /* eslint-disable no-var */
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
