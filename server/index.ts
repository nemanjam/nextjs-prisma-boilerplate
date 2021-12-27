import express from 'express';
import { createServer } from 'https';
import { createServer as createServerHttp } from 'http';
import fs from 'fs';
import next from 'next';
import { loadEnvConfig } from '@next/env';

const projectDir = process.cwd();
loadEnvConfig(projectDir);

const port = parseInt(process.env.PORT || '3001', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

const isHttps = process.env.SERVER_HTTP === 'https';
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
    `> Server listening at ${isHttps ? 'https' : 'http'}://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
