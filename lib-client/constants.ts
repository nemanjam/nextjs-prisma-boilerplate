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
    _500: '/500/',
  },
  API: {
    POSTS: '/api/posts/',
    USERS: '/api/users/',
    PROFILE: '/api/users/profile/',
    SESSION: '/api/auth/session/',
    SEED: '/api/seed/',
  },
  STATIC: {
    // repeated in folder structure, static folder, seed
    // docker volumes prod, Dockerfile.prod, gitignore
    // Routes.STATIC.AVATARS, Routes.STATIC.HEADERS - constants, not env vars
    AVATARS: '/uploads/avatars/',
    HEADERS: '/uploads/headers/',
  },
} as const;

// ----------- redirects getServerSideProps

export const Redirects = {
  NOT_FOUND: {
    notFound: true,
  },
  _500: {
    redirect: {
      permanent: false,
      destination: Routes.SITE._500,
    },
  },
  LOGIN: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.LOGIN,
    },
  },
  HOME: {
    redirect: {
      permanent: false,
      destination: Routes.SITE.HOME,
    },
  },
} as const;

// ----------- themes array

export const themes = [
  'theme-light',
  'theme-dark',
  'theme-blue',
  'theme-red',
  'theme-green',
  'theme-black',
];
