const QueryKeys = {
  POSTS_HOME: 'posts-home',
  POSTS_PROFILE: 'posts-profile',
  POSTS_DRAFTS: 'posts-drafts',
  POST: 'post',
} as const;

export type QueryKeysType = typeof QueryKeys[keyof typeof QueryKeys];

export default QueryKeys;
