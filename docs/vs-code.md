### ESlint and Prettier configuration

- official Vercel example [with-typescript-eslint-jest](https://github.com/vercel/next.js/tree/canary/examples/with-typescript-eslint-jest)

- useful [tutorial](https://paulintrognon.fr/blog/typescript-prettier-eslint-next-js)
- eslint disable next line

```ts
/* eslint-disable @typescript-eslint/no-empty-function */
error: () => {},
```

### VS Code extensions

- add in `.vscode/extensions.json`
- list extensions:

```
code --list-extensions
```

### Installation

- yarn install
- certs
  - install mkcert
  - mkcert root certificate
  - mkcert certificate for localhost, copy certs in certs folder
  - add node env var in ~/.profile
- copy env.example to env.local, google, fb, db
- prisma migrate, seed
- vs code extensions

### Run on Gitpod

- port 3001 not exposed, run on http, not https

```
import { createServer } from 'http';
const s = createServer(server).listen(port);
s.address()
```

- fix auth url

```ts
// .env.development
PROTOCOL=http
// without '/'
NEXTAUTH_URL=https://3001-jade-gayal-p7d8xqgb.ws-eu25.gitpod.io

// .env.local
DATABASE_URL=postgresql://postgres_user:postgres-external...
```

```ts
// workspace url example
https://nemanjam-nextjsprismaboi-u7qkzmc70mh.ws-eu39.gitpod.io/
// website url example
https://3001-nemanjam-nextjsprismaboi-u7qkzmc70mh.ws-eu39.gitpod.io/
```

- **public free postgres:**

- Heroku requires 2 databases for shadow database, restricted privilegies for default db (only for migrate dev and reset), for prod it should work dev.to [tutorial](https://dev.to/prisma/how-to-setup-a-free-postgresql-database-on-heroku-1dc1)
- elephantsql.com 20MB database, medium (trivial) [tutorial](https://medium.com/@noogetz/how-to-setup-a-database-with-elephantsql-7d87ea9953d0)

### Run on Repl.it

- install latest Node LTS in console

```
npm i node@16.13.1
```

- use http, same as Gitpod
- set auth urls

```
NEXTAUTH_URL=https://nextjs-prisma-boilerplate.vkostunica.repl.co
NEXT_PUBLIC_BASE_URL=https://nextjs-prisma-boilerplate.vkostunica.repl.co/
```

### Remote containers VS Code

- port forward in devcontainer.json only needed with Dockerfile, already defined in docker-compose.yml

### React Snipets

- Github [readme](https://github.com/dsznajder/vscode-react-javascript-snippets/blob/HEAD/docs/Snippets.md)

```js
nfn→ const functionName = (params) => { }
---
rafce

import React from 'react';

const $1 = () => {
  return <div>$0</div>;
};

export default $1;
```

### VS Code Jest extension

- [marketplace](https://marketplace.visualstudio.com/items?itemName=Orta.vscode-jest), [Github](https://github.com/jest-community/vscode-jest)

```ts
// disable run tests on vs code startup
// .vscode/settings.json

"jest.autoRun": "off"
```
