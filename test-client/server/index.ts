import authHandlers from 'test-client/server/handlers/auth';
import usersHandlers from 'test-client/server/handlers/users';
import postsHandlers from 'test-client/server/handlers/posts';
import { setupServer } from 'msw/node';

const handlers = [...authHandlers, ...usersHandlers, ...postsHandlers];

/**
 * initial handlers list
 */
export const server = setupServer(...handlers);
