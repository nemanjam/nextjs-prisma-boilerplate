const QueryKeys = {
  POSTS_HOME: 'posts-home',
  POSTS_PROFILE: 'posts-profile',
  POSTS_DRAFTS: 'posts-drafts',
  POST: 'post',
  USER: 'user',
  ME: 'me',
  USERS: 'users',
} as const;

export type QueryKeysType = typeof QueryKeys[keyof typeof QueryKeys];

export const filterEmptyKeys = (queryKey: Array<string | number | undefined | null>) => {
  return queryKey.filter((item) => item || item === 0) as Array<string | number>;
};

export default QueryKeys;
