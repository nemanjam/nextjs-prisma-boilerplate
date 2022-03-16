import { DefaultRequestBody, PathParams, rest } from 'msw';
import { ClientUser } from 'types';
import { fakeUser } from 'test/server/fake-data';
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
];

export default usersHandlers;
