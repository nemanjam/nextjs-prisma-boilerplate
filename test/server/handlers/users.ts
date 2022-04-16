import { DefaultRequestBody, PathParams, rest } from 'msw';
import { PaginatedResponse } from 'types';
import { ClientUser } from 'types/models/User';
import { fakeUser, fakeUsers } from 'test/server/fake-data';
import { Routes } from 'lib-client/constants';
import { resolve } from 'path';
import { readFileSync } from 'fs';

const usersHandlers = [
  // routes overlap, must be in same handler
  // 1. Routes.API.PROFILE - /api/users/profile, useUser hook
  // 2. ${Routes.API.USERS}:id - /api/users/:id, useMe SettingsView
  rest.get<DefaultRequestBody, PathParams, ClientUser>(
    `${Routes.API.USERS}:id`,
    (req, res, ctx) => {
      const userId = req.params.id as string;

      switch (userId) {
        case 'profile':
          // 1.
          const username = req.url.searchParams.get('username');
          if (username !== fakeUser.username) return res(ctx.status(404));

          return res(ctx.status(200), ctx.json(fakeUser));

        default:
          // 2.
          return res(ctx.status(200), ctx.json(fakeUser));
      }
    }
  ),
  // useUsers
  rest.get<DefaultRequestBody, PathParams, PaginatedResponse<ClientUser>>(
    Routes.API.USERS,
    (req, res, ctx) => {
      const searchTerm = req.url.searchParams.get('searchTerm');

      switch (true) {
        // 1.
        case !!searchTerm:
          const _fakeUsers = {
            // return one user by username
            items: fakeUsers.items.filter((user) => user.username === searchTerm),
            pagination: {
              total: 1,
              pagesCount: 1,
              currentPage: 1,
              perPage: 1,
              from: 1,
              to: 1,
              hasMore: false,
            },
          };
          return res(ctx.status(200), ctx.json(_fakeUsers));

        // 2.
        default:
          return res(ctx.status(200), ctx.json(fakeUsers));
      }
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
        const user = req.body as ClientUser; // parse from FormData formUserUpdateType, incomplete
        // console.log('user', user);
        return res(ctx.status(200), ctx.json({ ...fakeUser, ...user }));
      }
    }
  ),
  // useDeleteUser, same as useUpdateUser
  rest.delete<DefaultRequestBody, PathParams, ClientUser>(
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
