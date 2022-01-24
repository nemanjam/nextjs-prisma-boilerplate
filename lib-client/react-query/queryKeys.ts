const QueryKeys = {
  POSTS_HOME: 'posts-home',
  POSTS_PROFILE: 'posts-profile',
  POSTS_DRAFTS: 'posts-drafts',
} as const;

export type QueryKeysType = typeof QueryKeys[keyof typeof QueryKeys];

export default QueryKeys;
