import { User, Post } from '@prisma/client';

// --------- User ----------

/**
 * without password
 */
export type ClientUser = Omit<User, 'password'>;

// --------- Post ----------

/**
 * post with author without password
 */
export type PostWithAuthor = Post & {
  author: ClientUser;
};

// --------- Pagination<PostWithAuthor | ClientUser> ----------

/**
 * paginated response for posts and users
 */
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
