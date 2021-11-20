import express from 'express';
import { createServer } from 'https';
import fs from 'fs';
import next from 'next';

const port = parseInt(process.env.PORT || '3001', 10);
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();
const server = express();

const httpsOptions = {
  key: fs.readFileSync(__dirname + '/../certs/localhost-key.pem'),
  cert: fs.readFileSync(__dirname + '/../certs/localhost.pem'),
};

app.prepare().then(() => {
  server.use('/uploads', express.static(__dirname + '/../uploads'));

  server.all('*', (req, res) => {
    return handle(req, res);
  });
  createServer(httpsOptions, server).listen(port);

  // tslint:disable-next-line:no-console
  console.log(
    `> Server listening at https://localhost:${port} as ${
      dev ? 'development' : process.env.NODE_ENV
    }`
  );
});
