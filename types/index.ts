import { IncomingMessage } from 'http';
import { NextApiRequestCookies } from 'next/dist/server/api-utils';

// ------------ Shared types

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

export type SortDirection = 'asc' | 'desc';

// ------------ Next.js types

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

/**
 * ErrorBoundary and Loader fallback type
 */
export type FallbackType = 'screen' | 'page' | 'item' | 'test';

/**
 * all props in object non-nullable
 */
export type RequiredNotNull<T> = {
  [P in keyof T]: NonNullable<T[P]>;
};

/**
 * pick props from object and make them non-nullable
 */
export type PickNotNull<T, K extends keyof T> = T & RequiredNotNull<Pick<T, K>>;
