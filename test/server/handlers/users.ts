import { DefaultRequestBody, PathParams, rest } from 'msw';
import { ClientUser, PaginatedResponse } from 'types';
import { fakeUser, fakeUsers } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';
import { resolve } from 'path';
import { readFileSync } from 'fs';

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
  // getImage
  // Routes.STATIC.AVATARS - /uploads/avatars/
  // Routes.STATIC.HEADERS - /uploads/headers/
  rest.get<DefaultRequestBody, PathParams, Buffer>('/uploads/*', (req, res, ctx) => {
    const imageBuffer = readFileSync(resolve(__dirname, '../fixtures/image.jpg'));

    return res(
      ctx.status(200),
      ctx.set('Content-Length', imageBuffer.byteLength.toString()),
      ctx.set('Content-Type', 'image/jpeg'),
      ctx.body(imageBuffer)
    );
  }),
  // useUpdateUser
  rest.patch<DefaultRequestBody, PathParams, ClientUser>(
    `${Routes.API.USERS}:id`,
    (req, res, ctx) => {
      const userId = req.params.id;

      if (fakeUser.id !== userId) throw new Error('Invalid fake user.id.');

      if (userId) {
        const user = req.body as ClientUser; // UserUpdateType, incomplete
        return res(ctx.status(200), ctx.json({ ...fakeUser, ...user }));
      }
    }
  ),
];

export default usersHandlers;
