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

### Remote containers VS Code

- port forward in devcontainer.json only needed with Dockerfile, already defined in docker-compose.yml

### React Snippets

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
