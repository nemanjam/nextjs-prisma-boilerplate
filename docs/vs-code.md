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

---

- **Run on Gitpod - final, working:**

- problem: free db without shadow db? **solution:** use `npx prisma db push`

- this is enough to work:

```bash
# http - use http server
PROTOCOL=http
# backend will use this, but gitpod will proxy it
PORT=3001
# hardcoded, https
NEXTAUTH_URL=https://3001-nemanjam-nextjsprismabo-dn2irzhpmzu.ws-eu47.gitpod.io

```

- **problem:** HOSTNAME is reserved readonly var on Gitpos (and Linux), use other var name
- good thing HOSTNAME is used only in server.ts (in log, trivial, protocol too) and docker-compose.prod.yml, **solution:** rename it SITE_HOSTNAME, SITE_PROTOCOL

```bash
HOSTNAME=3001-nemanjam-nextjsprismabo-dn2irzhpmzu.ws-eu47.gitpod.io
# resolves to:
3001-nemanjam-nextjsprismabo-dn2irzhpmzu # error

# HOSTNAME=reserved env var on Gitpos (and Linux), readonly
```

- **both** website and api are on **https without port:**

```bash
# Gitpod makes some proxy

# site:
# https://3001-nemanjam-nextjsprismabo-dn2irzhpmzu.ws-eu47.gitpod.io/users/
# api:
# https://3001-nemanjam-nextjsprismabo-dn2irzhpmzu.ws-eu47.gitpod.io/api/users/?page=1
```

- `.gitpod.yml` reference [docs](https://www.gitpod.io/docs/references/gitpod-yml#image)
- can specify custom Docker image with one Dockerfile for example

- **final:**

```bash
# http - use http server
SITE_PROTOCOL=http

# only backend will use this port (http server)
# Gitpod will proxy it
PORT=3001

#SITE_HOSTNAME=3001-nemanjam-nextjsprismabo-dn2irzhpmzu.ws-eu47.gitpod.io
# without https://
SITE_HOSTNAME=${PORT}-${HOSTNAME}.${GITPOD_WORKSPACE_CLUSTER_HOST}


# no port in url
#NEXTAUTH_URL=https://3001-nemanjam-nextjsprismabo-dn2irzhpmzu.ws-eu47.gitpod.io
NEXTAUTH_URL=https://${PORT}-${HOSTNAME}.${GITPOD_WORKSPACE_CLUSTER_HOST}
```

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

- **Repli.it final:**

- install Node.js 16:
- choose Node16 template (with Nix)
- checkout code

```bash
cp -a ~/nextjs-prisma-boilerplate/. ~/nextjs-prisma-boilerplate-node16/
rm -rf ~/nextjs-prisma-boilerplate
```

- install yarn, add yarn to replit.nix, yarn --version

```bash
# replit.nix
{ pkgs }: {
	deps = with pkgs; [
		nodejs-16_x
		nodePackages.typescript-language-server
        yarn
	];
}
```

### Codesandbox

- add env vars in Codesandbox left panel, manually

```bash
SITE_PROTOCOL=http
PORT=3001
SITE_HOSTNAME=wo9qix.sse.codesandbox.io
NEXTAUTH_URL=https://wo9qix.sse.codesandbox.io
DATABASE_URL=postgres://...
```

- set port and yarnscript in `sandbox.config.json`

```json
{
  "infiniteLoopProtection": true,
  "hardReloadOnChange": false,
  "view": "browser",
  "container": {
    "port": 3001,
    "node": "16",
    "startScript": "codesandbox:dev:env"
  }
}
```

- it fails with this, not enough disk space `df -H`

```bash

/dev/rbd22                 1.1G  1.1G   21M  99% /sandbox

# error - Error: ENOSPC: no space left on device, write
rm -rf node_modules && yarn install --ignore-engines
```

- copy `.env.development.replit.local.example` to `.env.development.replit.local` and set DATABASE_URL
- too weak, nodemon crashes on `replit:dev:env`

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

### Devcontainers, final

- run `npb-db-dev` database container
- right click app container `npb-app-dev` -> `Attach to container` -> open `/app` folder -> `install recommended extensions`, open app on `http://localhost:3001`, that's it
- to see dev app node.js log `Show container log`
- run tests, use local yarn scripts probably all works

- git works in container

```bash
git config --list --show-origin
# or
git config --list
```

### Debug Chrome on mobile phone

- on a phone go to `https://192.168.x.x:3001`
- enable Android debugger and connect phone with usb cable
- on computer Chrome go to `chrome://inspect/#devices`
- youtube [tutorial](https://www.youtube.com/watch?v=5t5XZKUgp9Y)
