import { Post } from '@prisma/client';
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

export interface PostCreateFormData {
  title: string;
  content: string;
}

/**
 * update post
 */
export type PostUpdateData = Partial<Pick<Post, 'title' | 'content' | 'published'>>;

export type PostUpdateMutationData = {
  post: PostUpdateData;
  id: number;
};
