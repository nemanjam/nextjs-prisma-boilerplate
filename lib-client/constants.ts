export const Routes = {
  SITE: {
    HOME: '/',
    POST: '/post/',
    DRAFTS: '/post/drafts/',
    CREATE: '/post/create/',
    REGISTER: '/auth/register/',
    LOGIN: '/auth/login/',
    SETTINGS: '/settings/',
    USERS: '/users/',
  },
  API: {
    POSTS: '/api/posts/',
    USERS: '/api/users/',
  },
} as const;
