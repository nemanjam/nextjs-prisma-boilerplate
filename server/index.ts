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

  require('../utils').printLoadedEnvVariables();
});
