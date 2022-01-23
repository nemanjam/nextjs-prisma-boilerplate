import { User, Post } from '@prisma/client';

export type WithStringDates<T> = Omit<T, 'createdAt' | 'updatedAt'> & {
  createdAt: string;
  updatedAt: string;
};

export type UserStr = WithStringDates<User>;
export type PostStr = WithStringDates<Post>;

export type PostWithAuthorStr = PostStr & {
  author: UserStr;
};

export type PostWithAuthor = Post & {
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

export type QueryParamsType = {
  [key: string]: string | string[];
};

// type all request and response objects
