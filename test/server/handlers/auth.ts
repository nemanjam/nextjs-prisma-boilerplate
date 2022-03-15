import { DefaultRequestBody, rest } from 'msw';
import { Session } from 'next-auth';
import { ClientUser } from 'types';

export const testUser: ClientUser = {
  id: 'ckzwmjsll00385wr0k2h1i8fl',
  name: 'user0 name',
  email: 'user0@email.com',
  username: 'user0',
  provider: 'credentials',
  emailVerified: null,
  image: 'avatar0.jpg',
  headerImage: 'header0.jpg',
  bio: 'Consequatur corporis ad quod blanditiis eaque. Quia non quam eos.',
  role: 'admin',
  createdAt: new Date(),
  updatedAt: new Date(),
};

export const testSession: Session = {
  user: {
    id: testUser.id,
    email: testUser.email,
  },
  expires: new Date().toISOString(),
};

const authHandlers = [
  // useSession, getSession
  rest.get<DefaultRequestBody, Session>('/api/auth/session', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testSession));
  }),
  // useMe
  rest.get<DefaultRequestBody, ClientUser>('/api/users/:id', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(testUser));
  }),
];

export default authHandlers;
