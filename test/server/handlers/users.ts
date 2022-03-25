import { DefaultRequestBody, PathParams, rest } from 'msw';
import { ClientUser, PaginatedResponse } from 'types';
import { fakeUser, fakeUsers } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';

const usersHandlers = [
  // useMe
  rest.get<DefaultRequestBody, PathParams, ClientUser>(
    `${Routes.API.USERS}:id`,
    (req, res, ctx) => {
      // req.params.id
      return res(ctx.status(200), ctx.json(fakeUser));
    }
  ),
  // useUsers
  rest.get<DefaultRequestBody, PathParams, PaginatedResponse<ClientUser>>(
    Routes.API.USERS,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(fakeUsers));
    }
  ),
  // useUser
  rest.get<DefaultRequestBody, PathParams, ClientUser>(
    Routes.API.PROFILE,
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(fakeUser));
    }
  ),
];

export default usersHandlers;
