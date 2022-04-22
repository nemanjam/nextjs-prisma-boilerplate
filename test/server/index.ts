import { setupServer } from 'msw/node';
import {
  DefaultRequestBody,
  PathParams,
  ResponseComposition,
  rest,
  RestContext,
  RestRequest,
} from 'msw';
import authHandlers from 'test/server/handlers/auth';
import usersHandlers from 'test/server/handlers/users';
import postsHandlers from 'test/server/handlers/posts';
import { Routes } from 'lib-client/constants';
import { fakeUser } from 'test/server/fake-data';

const handlers = [...authHandlers, ...usersHandlers, ...postsHandlers];

export const server = setupServer(...handlers);

export const errorHandler500 = () => {
  const handler500 = (
    req: RestRequest<DefaultRequestBody, PathParams>,
    res: ResponseComposition<any>,
    ctx: RestContext
  ) => {
    // /api/users/9adfadd2-5ba7-40ca-9e21-5d06bc6240ad
    const pathname = req.url.pathname;
    const useMePathnameRegex = RegExp(`^${Routes.API.USERS}.+$`, 'i');
    const isUseMePathname = useMePathnameRegex.test(pathname);

    const profilePathnameRegex = RegExp(`^${Routes.API.USERS}profile/?$`, 'i');
    const isProfilePathname = profilePathnameRegex.test(pathname);

    // return user for useMe context
    if (req.method === 'GET' && isUseMePathname && !isProfilePathname) {
      return res(ctx.status(200), ctx.json(fakeUser));
    }

    return res(ctx.status(500));
  };

  server.use(
    rest.get('*', handler500),
    rest.post('*', handler500),
    rest.put('*', handler500),
    rest.patch('*', handler500),
    rest.delete('*', handler500)
  );
};
