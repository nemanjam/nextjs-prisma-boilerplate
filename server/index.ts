import express from 'express';
import { createServer } from 'https';
import { createServer as createServerHttp } from 'http';
import { readFileSync } from 'fs';
import next from 'next';
// only here must use relative path, tsconfig.json, ts-node...
import { getCertificates, printLoadedEnvVariables } from './utils';

// must be here for next 12.1.6
process.env.__NEXT_REACT_ROOT = 'true';

const isDev = !['production', 'test'].includes(process.env.NODE_ENV);
const app = next({ dev: isDev });
const handle = app.getRequestHandler();
const server = express();

// vars from .env.* files are available inside prepare()
app.prepare().then(() => {
  server.use('/uploads', express.static(__dirname + '/../uploads'));

  server.all('*', (req, res) => {
    return handle(req, res);
  });

  const port = parseInt(process.env.PORT || '3001', 10);
  const isHttps = process.env.SITE_PROTOCOL === 'https';

  if (isHttps) {
    const certsPaths = getCertificates();

    if (certsPaths) {
      const httpsOptions = {
        key: readFileSync(certsPaths.keyAbsolutePath),
        cert: readFileSync(certsPaths.certAbsolutePath),
      };
      createServer(httpsOptions, server).listen(port);
    } else {
      console.log('Fallback to http...');
      createServerHttp(server).listen(port);
    }
  } else {
    createServerHttp(server).listen(port);
  }

  // tslint:disable-next-line:no-console
  console.log(
    `> NODE_ENV=${process.env.NODE_ENV}\n> Server listening at ${
      isHttps ? 'https' : 'http'
    }://${process.env.SITE_HOSTNAME}:${port} as ${
      process.env.NODE_ENV
    }, dev mode:${isDev}`
  );

  printLoadedEnvVariables();
});
