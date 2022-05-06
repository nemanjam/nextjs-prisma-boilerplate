import { IncomingMessage, ServerResponse, createServer } from 'http';
import { NextApiHandler } from 'next';
import request from 'supertest';
// git path: packages/next/server/api-utils/node.ts, path might break in future
import { apiResolver } from 'next/dist/server/api-utils/node';
import { __ApiPreviewProps } from 'next/dist/server/api-utils';

export const testClient = (handler: NextApiHandler): request.SuperTest<request.Test> => {
  return request(
    createServer(async (req: IncomingMessage, res: ServerResponse) => {
      return apiResolver(req, res, null, handler, {} as __ApiPreviewProps, false);
    })
  );
};
