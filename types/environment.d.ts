declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // node
      NODE_ENV: 'development' | 'production' | 'test';

      // dev/prod
      PROTOCOL: 'https' | 'http';
      HOSTNAME: string;
      PORT: string; // number
      NEXTAUTH_URL: string;

      // local - secrets
      DATABASE_URL: string;
      SECRET: string;
      FACEBOOK_CLIENT_ID: string;
      FACEBOOK_CLIENT_SECRET: string;
      GOOGLE_CLIENT_ID: string;
      GOOGLE_CLIENT_SECRET: string;

      // buildtime - next.config.js - env
      NEXT_PUBLIC_BASE_URL: string;
      NEXT_PUBLIC_POSTS_PER_PAGE: string; // number
      NEXT_PUBLIC_USERS_PER_PAGE: string; // number
      NEXT_PUBLIC_DEFAULT_THEME:
        | 'theme-light'
        | 'theme-dark'
        | 'theme-blue'
        | 'theme-red'
        | 'theme-green'
        | 'theme-black';
    }
  }
}

export {};
