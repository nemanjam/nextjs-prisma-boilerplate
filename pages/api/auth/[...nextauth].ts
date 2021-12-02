import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import FacebookProvider, { FacebookProfile } from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'lib-server/prisma';
import { compare } from 'bcryptjs';
import { uniqueString } from 'utils';
import nc, { ncOptions } from 'lib-server/nc';
import ApiError from 'lib-server/error';
import { userLoginSchema } from 'lib-server/validation';

const handler = nc(ncOptions);

handler.use(
  (req: NextApiRequest, res: NextApiResponse): NextApiHandler =>
    NextAuth(req, res, {
      providers: [
        FacebookProvider({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          // both login and register
          async profile(profile: FacebookProfile) {
            const username = `facebook_user__${uniqueString(6)}`;

            // handle non existing fb email
            if (!profile.email) {
              profile.email = `${username}@non-existing-facebook-email.com`;
            }

            // cant forward error?
            await checkUniqueEmail(profile);

            return {
              id: profile.id,
              name: profile.name,
              email: profile.email,
              username,
              image: profile.picture.data.url,
            };
          },
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          // callback needed to assign username
          async profile(profile: GoogleProfile) {
            await checkUniqueEmail(profile);

            // projection and mapping is needed
            return {
              id: profile.sub,
              name: profile.name,
              email: profile.email,
              username: `google_user__${uniqueString(6)}`,
              image: profile.picture,
            };
          },
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
            const { user, error } = await getUser(credentials);
            if (error) throw error;
            return user;
          },
        }),
      ],
      session: {
        jwt: true, // doesnt work without this...
        maxAge: 60 * 60, // 1h
      },
      callbacks: {
        // both jwt and session are used to attach user to session
        async jwt({ token, user }) {
          user && (token.user = user);
          return token;
        },
        async session({ session, token }) {
          const _session = token.user ? { ...session, user: token.user } : undefined;
          return _session as Session;
        },
      },
      events: {
        async createUser(user) {
          // set username here
          console.log('user created', user);
        },
      },
      jwt: { secret: process.env.SECRET },
      pages: { signIn: '/auth/login' },
      adapter: PrismaAdapter(prisma),
      debug: false,
    })
);

async function checkUniqueEmail(profile: FacebookProfile | GoogleProfile) {
  const { email } = profile;
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true,
    },
  });

  // limit to one account per user so that email is unique
  if (user) {
    throw new ApiError(
      `User is already registered with ${email} using ${user.accounts[0].provider} provider`,
      400
    );
  }
}

async function getUser({ email, password }) {
  const result = userLoginSchema.safeParse({ email, password });

  if (!result.success) {
    return {
      user: null,
      error: new ApiError(`Validation error: ${(result as any).error[0].message}.`, 401),
    };
  }

  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    return {
      user: null,
      error: new ApiError(`User with email: ${email} does not exist.`, 404),
    };
  }

  const isValid = password && user.password && (await compare(password, user.password));

  if (!isValid) {
    return {
      user,
      error: new ApiError('Invalid password.', 401),
    };
  }

  return { user, error: null };
}

export default handler;
