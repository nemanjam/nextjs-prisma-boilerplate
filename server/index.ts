import express from 'express';
import { createServer } from 'https';
import { createServer as createServerHttp } from 'http';
import fs from 'fs';
import next from 'next';
import { loadEnvConfig } from '@next/env';

// NODE_ENV var must be passed first independently
// from yarn, shell or container
const dev = process.env.NODE_ENV !== 'production';

// then load correct .env.* files
// only locally, not in docker
const projectDir = process.cwd();
loadEnvConfig(projectDir, dev); // returns vars for debug

const port = parseInt(process.env.PORT || '3001', 10);
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

const isHttps = process.env.PROTOCOL === 'https';
const httpsOptions = isHttps
  ? {
      key: fs.readFileSync(__dirname + '/../certs/localhost-key.pem'),
      cert: fs.readFileSync(__dirname + '/../certs/localhost.pem'),
    }
  : null;

app.prepare().then(() => {
  server.use('/uploads', express.static(__dirname + '/../uploads'));

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  if (isHttps) createServer(httpsOptions, server).listen(port);
  else createServerHttp(server).listen(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> NODE_ENV=${process.env.NODE_ENV}\n> Server listening at ${
      isHttps ? 'https' : 'http'
    }://${process.env.HOSTNAME}:${port} as ${dev ? 'development' : process.env.NODE_ENV}`
  );
});
