import { User } from 'next-auth';
import { UserStr } from 'types';

export const uniqueString = (length: number) => {
  let result = '';
  const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
};

export const isBrowser = () => typeof window !== 'undefined';

export const getAvatarPath = (user: User | UserStr) => {
  return user.provider === 'credentials'
    ? `${process.env.NEXT_PUBLIC_AVATARS_PATH}${user.image || 'placeholder-avatar.jpg'}`
    : user.image;
  // can edit avatar, startsWith('https://')
};

export const getAvatarFullUrl = (user: User | UserStr) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${getAvatarPath(user)}`;
};

export const getHeaderImagePath = (user: User | UserStr) => {
  return `${process.env.NEXT_PUBLIC_HEADERS_PATH}${
    user.headerImage || 'placeholder-header.jpg'
  }`;
};

export const getHeaderImageFullUrl = (user: User | UserStr) => {
  return `${process.env.NEXT_PUBLIC_BASE_URL}${getHeaderImagePath(user)}`;
};

type ObjectWithDates = { createdAt: Date; updatedAt: Date };
type ObjectWithStrings = {
  createdAt: string;
  updatedAt: string;
};

export const datesToStrings = <T extends ObjectWithDates>(
  _object: T
): Omit<T, keyof ObjectWithDates> & ObjectWithStrings => {
  return {
    ..._object,
    createdAt: _object.createdAt.toISOString(),
    updatedAt: _object.updatedAt.toISOString(),
  };
};

/**
 * min, max included
 */
export const getRandomInteger = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const printLoadedEnvVariables = () => {
  const vars = {
    NODE_ENV: process.env.NODE_ENV,
    PROTOCOL: process.env.PROTOCOL,
    HOSTNAME: process.env.HOSTNAME,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    NEXT_PUBLIC_AVATARS_PATH: process.env.NEXT_PUBLIC_AVATARS_PATH,
    NEXT_PUBLIC_HEADERS_PATH: process.env.NEXT_PUBLIC_HEADERS_PATH,
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    DATABASE_URL: process.env.DATABASE_URL,
    SECRET: process.env.SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };

  const str = JSON.stringify(vars, null, 2)
    .replace(/(^\s+|{)/gm, '')
    .replace(/(,|}|\s+$)/gm, '')
    .replace(/"/gm, '');

  console.log('Loaded env vars: ', str);
};
