import { setupServer } from 'msw/node';
import authHandlers from 'test/server/handlers/auth';
import usersHandlers from 'test/server/handlers/users';
import postsHandlers from 'test/server/handlers/posts';

const handlers = [...authHandlers, ...usersHandlers, ...postsHandlers];

export const server = setupServer(...handlers);
