import { User, Post } from '@prisma/client';

// remove password on client
export type ClientUser = Omit<User, 'password'>;

export type PostWithAuthor = Post & {
  author: ClientUser;
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

export type QueryParamsType = {
  [key: string]: string | string[];
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
