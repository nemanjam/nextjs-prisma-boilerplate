import { setupServer } from 'msw/node';
import authHandlers from 'test/server/handlers/auth';

const handlers = [...authHandlers];

export const server = setupServer(...handlers);
