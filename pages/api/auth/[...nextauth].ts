import { NextApiHandler } from 'next';
import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import FacebookProvider from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'lib/prisma';
import { compare } from 'bcryptjs';

const authHandler: NextApiHandler = (req, res) => NextAuth(req, res, options);
export default authHandler;

const options = {
  providers: [
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
      async authorize(credentials, req) {
        const { email, password } = credentials;

        const user = await prisma.user.findUnique({
          where: { email },
        });
        if (!user) {
          return null;
          // return { error: `User with email: ${email} does not exist.` };
        }

        const isValid =
          password && user.password && (await compare(password, user.password));
        if (!isValid) {
          return null;
          // return { error: 'Invalid password.' };
        }

        return user;
      },
    }),
    FacebookProvider({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
  ],
  /*
  callbacks: {
    async session(session, user) {
      console.log('session', session), 'user', user;
      return session;
    },
  },
  */
  session: {
    jwt: true, // doesnt work without this...
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: { secret: process.env.SECRET },
  pages: { signIn: '/signin' },
  adapter: PrismaAdapter(prisma),
  debug: false,
};
