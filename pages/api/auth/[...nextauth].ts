import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import NextAuth, { Session } from 'next-auth';
import GoogleProvider, { GoogleProfile } from 'next-auth/providers/google';
import FacebookProvider, {
  FacebookProfile,
} from 'next-auth/providers/facebook';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaAdapter } from '@next-auth/prisma-adapter';
import prisma from 'lib-server/prisma';
import { compare } from 'bcryptjs';
import { uniqueString } from 'utils';
import nc, { ncOptions } from 'lib-server/nc';

const handler = nc(ncOptions);

handler.use(
  (req: NextApiRequest, res: NextApiResponse): NextApiHandler =>
    NextAuth(req, res, {
      providers: [
        FacebookProvider({
          clientId: process.env.FACEBOOK_CLIENT_ID,
          clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
          // just on register?
          async profile(profile: FacebookProfile) {
            const username = `facebook_user__${uniqueString(6)}`;

            // handle non existing fb email
            if (!profile.email) {
              profile.email = `${username}@non-existing-facebook-email.com`;
            }

            await checkUniqueEmail(profile);
            return { ...profile, username };
          },
        }),
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          async profile(profile: GoogleProfile) {
            await checkUniqueEmail(profile);

            const username = `google_user__${uniqueString(6)}`;
            const id = uniqueString(9); // why?
            return { ...profile, username, id };
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
          // this is login, not register
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
              password &&
              user.password &&
              (await compare(password, user.password));
            if (!isValid) {
              return null;
              // return { error: 'Invalid password.' };
            }

            return user;
          },
        }),
      ],
      session: {
        jwt: true, // doesnt work without this...
        // strategy: 'jwt',
        maxAge: 60 * 60, // 1h // 30 * 24 * 60 * 60, // 30 days
      },
      callbacks: {
        // both jwt and session are used to attach user to session
        async jwt({ token, user }) {
          user && (token.user = user);
          return token;
        },
        async session({ session, token }) {
          const _session = token.user
            ? { ...session, user: token.user }
            : undefined;
          return _session as Session;
        },
      },
      jwt: { secret: process.env.SECRET },
      pages: { signIn: '/signin' },
      adapter: PrismaAdapter(prisma),
      debug: false,
    })
);

async function checkUniqueEmail(profile: FacebookProfile | GoogleProfile) {
  // check if email already exists
  const { email } = profile;
  const user = await prisma.user.findUnique({
    where: { email },
    include: {
      accounts: true,
    },
  });

  // limit to one account per user so that email is unique
  if (user) {
    throw Error(
      `User is already registered with ${email} using ${user.accounts[0].provider} provider`
    );
  }
}

export default handler;
