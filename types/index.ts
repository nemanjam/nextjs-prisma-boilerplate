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
