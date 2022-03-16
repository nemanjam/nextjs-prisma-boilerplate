import { DefaultRequestBody, PathParams, rest } from 'msw';
import { Session } from 'next-auth';
import { fakeSession } from 'test/server/fake-data';

const authHandlers = [
  // useSession, getSession
  rest.get<DefaultRequestBody, PathParams, Session>(
    '/api/auth/session',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(fakeSession));
    }
  ),
];

export default authHandlers;
