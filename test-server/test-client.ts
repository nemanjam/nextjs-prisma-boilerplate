import { IncomingMessage, ServerResponse, createServer } from 'http';
import { NextApiHandler } from 'next';
import request from 'supertest';
// git path: packages/next/server/api-utils/node.ts, path might break in future
import { apiResolver } from 'next/dist/server/api-utils/node';
import { __ApiPreviewProps } from 'next/dist/server/api-utils';
import prisma from 'lib-server/prisma';
const { SeedSingleton } = require('../prisma/seed.js');

/**
 * used for controller unit and integration tests
 */
// no seed needed
export const testClient = (
  handler: NextApiHandler,
  query?: Record<string, unknown>
): request.SuperTest<request.Test> => {
  return request(
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      return apiResolver(req, res, query, handler, {} as __ApiPreviewProps, false);
    })
  );
};

/**
 * run in afterAll, once per describe
 * used in integration tests only, not in Cypress
 */
export const teardown = async (): Promise<void> => {
  await SeedSingleton.getInstance(prisma).handledDeleteAllTables();
  await prisma.$disconnect();
};
