const path = require('path');

module.exports = {
  experimental: {
    // maybe fixes hydration error
    // https://github.com/vercel/next.js/issues/35564#issuecomment-1077347776
    // https://github.com/facebook/react/issues/24125
    runtime: 'nodejs',
    serverComponents: true,
    reactRoot: true,
  },
  reactStrictMode: true,
  trailingSlash: true,
  /*
  webpackDevMiddleware: (config) => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    };
    return config;
  },
  */
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
  // buildtime, must provide buildtime in Dockerfile or hardcode
  env: {
    // repeated in folder structure, static folder, seed
    // next.config.js, docker volumes prod, Dockerfile.prod, gitignore
    // Routes.STATIC.AVATARS, Routes.STATIC.HEADERS - constants, not env vars
    // rename to single uploads var
    // used in axios instance, just rename it
    NEXT_PUBLIC_BASE_URL: `${process.env.NEXTAUTH_URL}/`,
    NEXT_PUBLIC_POSTS_PER_PAGE: 5,
    NEXT_PUBLIC_USERS_PER_PAGE: 3,
    NEXT_PUBLIC_DEFAULT_THEME: 'theme-blue',
  },
  // runtime, server, private
  serverRuntimeConfig: {
    // just forward entire env.local
    // only used in [...nextauth]
    SECRET: process.env.SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  },
  // runtime, server, ssr client, public, don't need to recompile app
  // server and getServersideProps pages/components
  publicRuntimeConfig: {},
};
