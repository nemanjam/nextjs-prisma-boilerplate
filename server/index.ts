import express from 'express';
import { createServer } from 'https';
import { createServer as createServerHttp } from 'http';
import fs from 'fs';
import next from 'next';

// no need for this, maybe in seed
// loadEnvConfig(process.cwd()); // returns vars for debug

const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

// vars from .env.* files are available inside prepare()
app.prepare().then(() => {
  server.use('/uploads', express.static(__dirname + '/../uploads'));

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = parseInt(process.env.PORT || '3001', 10);
  const isHttps = process.env.PROTOCOL === 'https';

  if (isHttps) {
    const httpsOptions = {
      key: fs.readFileSync(__dirname + '/../certs/localhost-key.pem'),
      cert: fs.readFileSync(__dirname + '/../certs/localhost.pem'),
    };
    createServer(httpsOptions, server).listen(port);
  } else {
    createServerHttp(server).listen(port);
  }

  // tslint:disable-next-line:no-console
  console.log(
    `> NODE_ENV=${process.env.NODE_ENV}\n> Server listening at ${
      isHttps ? 'https' : 'http'
    }://${process.env.HOSTNAME}:${port} as ${dev ? 'development' : process.env.NODE_ENV}`
  );

  printLoadedEnvVariables();
});

// this should be in logger
// must be here, cannot import in production
function printLoadedEnvVariables() {
  const vars = {
    // buildime
    NEXT_PUBLIC_AVATARS_PATH: process.env.NEXT_PUBLIC_AVATARS_PATH,
    NEXT_PUBLIC_HEADERS_PATH: process.env.NEXT_PUBLIC_HEADERS_PATH,
    // node
    NODE_ENV: process.env.NODE_ENV,
    // .env
    PROTOCOL: process.env.PROTOCOL,
    HOSTNAME: process.env.HOSTNAME,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    // db
    POSTGRES_USER: process.env.POSTGRES_USER,
    POSTGRES_HOSTNAME: process.env.POSTGRES_HOSTNAME,
    POSTGRES_PORT: process.env.POSTGRES_PORT,
    POSTGRES_PASSWORD: process.env.POSTGRES_PASSWORD,
    POSTGRES_DB: process.env.POSTGRES_DB,
    DATABASE_URL: process.env.DATABASE_URL,
    // private, server
    SECRET: process.env.SECRET,
    FACEBOOK_CLIENT_ID: process.env.FACEBOOK_CLIENT_ID,
    FACEBOOK_CLIENT_SECRET: process.env.FACEBOOK_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  };

  const fn = (_key: string, value: string) => (value === undefined ? null : value);
  const str = JSON.stringify(vars, fn, 2);

  const str1 = str
    .replace(/(^\s+|{)/gm, '')
    .replace(/(,|}|\s+$)/gm, '')
    .replace(/"/gm, '');

  console.log('Loaded env vars: ', str1);
}
