import { User, Post } from '@prisma/client';
import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

// remove password on client
export type ClientUser = Omit<User, 'password'>;

export type PostWithAuthor = Post & {
  author: ClientUser;
};

/**
 * has pasword
 */
export type PostWithUser = Post & {
  author: User;
};

export type PaginatedResponse<T> = {
  items: T[];
  pagination: {
    total: number;
    pagesCount: number;
    currentPage: number;
    perPage: number;
    from: number;
    to: number;
    hasMore: boolean;
  };
};

/**
 * api NextApiRequest req.query
 */
export type QueryParamsType = {
  [key: string]: string | string[];
};

/**
 * getServerSideProps req
 */
export type NextReq = IncomingMessage & {
  cookies: NextApiRequestCookies;
};

// ------------------- not used any more

export type WithStringDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type UserStr = WithStringDates<User>;
export type PostStr = WithStringDates<Post>;

export type PostWithAuthorStr = PostStr & {
  author: UserStr;
};

// --------------------

// type all request and response objects
