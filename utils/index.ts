import { Routes } from 'lib-client/constants';

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

export const filterEmpty = (queryKey: Array<unknown>) => {
  return queryKey.filter((item) => item || item === 0);
};

export const redirectNotFound = {
  notFound: true,
} as const;

export const redirectLogin = {
  redirect: {
    permanent: false,
    destination: Routes.SITE.LOGIN,
  },
};

export const redirectHome = {
  redirect: {
    permanent: false,
    destination: Routes.SITE.HOME,
  },
};
