import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import getConfig from 'next/config';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { User, Account } from 'next-auth/core/types';
import prisma from 'lib-server/prisma';
import { apiHandler } from 'lib-server/nc';
import { Routes } from 'lib-client/constants';
import { ClientUser } from 'types/models/User';
import { loginUser } from 'lib-server/services/auth';

const { serverRuntimeConfig } = getConfig();
const handler = apiHandler();

handler.use(
  (req: NextApiRequest, res: NextApiResponse): NextApiHandler =>
    NextAuth(req, res, {
      providers: [
        FacebookProvider({
          clientId: serverRuntimeConfig.FACEBOOK_CLIENT_ID,
          clientSecret: serverRuntimeConfig.FACEBOOK_CLIENT_SECRET,
        }),
        GoogleProvider({
          clientId: serverRuntimeConfig.GOOGLE_CLIENT_ID,
          clientSecret: serverRuntimeConfig.GOOGLE_CLIENT_SECRET,
        }),
        CredentialsProvider({
          name: 'Credentials',
          credentials: {
            email: {
              label: 'Email',
              type: 'email',
            },
            password: {
              label: 'Password',
              type: 'password',
            },
          },
          // redirect to same page and parse query params, unable to return api res
          async authorize(credentials) {
            const { user, error } = await loginUser(credentials);
            if (error) throw error;
            return user;
          },
        }),
      ],
      session: {
        strategy: 'jwt',
        maxAge: 60 * 60, // 1h
      },
      callbacks: {
        // both jwt and session are used to attach user to session
        async jwt({ token, user, account, isNewUser }) {
          // isNewUser = true only on user creation, can be used
          // to update db and session
          if (isNewUser && user && account) {
            const data = await updateUser(user, account);
            user = { ...user, ...data };
          }

          user && (token.user = user);
          return token;
        },
        async session({ session, token }) {
          let _session = undefined;
          const user = token.user as ClientUser;
          // put just user's immutable props in session (id and email)
          // for session user use useUser React Query state
          if (user) {
            _session = { ...session, user: { id: user.id, email: user.email } };
          }
          return _session as Session;
        },
      },
      secret: serverRuntimeConfig.SECRET,
      pages: { signIn: Routes.SITE.LOGIN },
      adapter: PrismaAdapter(prisma),
      debug: false,
    })
);

async function updateUser(user: User, account: Account) {
  const data = {
    provider: account.provider,
    username: `${account.provider}_user_${user.username}`,
  } as any;

  if (!user.email) {
    data.email = `${data.username}@non-existing-facebook-email.com`;
  }

  await prisma.user.update({
    where: { id: user.id },
    data,
  });

  return data;
}

export default handler;
