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

export const filterEmptyKeys = (queryKey: Array<string | number>) => {
  return queryKey.filter((item) => item || item === 0);
};

export default QueryKeys;
