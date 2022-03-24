import { DefaultRequestBody, PathParams, rest } from 'msw';
import { Session } from 'next-auth';
import { fakeSession } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';
import { ClientUser } from 'types';

const authHandlers = [
  // useSession, getSession
  rest.get<DefaultRequestBody, PathParams, Session>(
    '/api/auth/session',
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(fakeSession));
    }
  ),
  // useCreateUser
  rest.post<DefaultRequestBody, PathParams, ClientUser>(
    Routes.API.USERS,
    (req, res, ctx) => {
      const user = req.body as ClientUser; // just forward what you received
      return res(ctx.status(200), ctx.json(user));
    }
  ),
];

export default authHandlers;
