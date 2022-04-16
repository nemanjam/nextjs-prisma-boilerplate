import { Post } from '@prisma/client';
import { SortDirection } from 'types';
import { ClientUser } from 'types/models/User';

// --------- Response types ----------
// used in queries and api responses

/**
 * post with author without password
 */
export type PostWithAuthor = Post & {
  author: ClientUser;
};

// --------- Request types ----------
// used in mutations and api arguments

/**
 * create post
 */
export type PostCreateData = Pick<Post, 'title' | 'content'>;

// both create and update
export type PostCreateFormData = {
  title: string;
  content: string;
};

/**
 * update post
 */
export type PostUpdateData = Partial<Pick<Post, 'title' | 'content' | 'published'>>;

export type PostUpdateMutationData = {
  post: PostUpdateData;
  id: number;
};

// --------- Query params request types ----------
// used in queries and api args validation

export type PostsGetSearchQueryParams = {
  page: number;
  limit?: number;
  userId?: string;
  email?: string;
  username?: string;
  searchTerm?: string;
  sortDirection?: SortDirection;
  published?: boolean;
};
