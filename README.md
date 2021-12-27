# Nextjs Prisma Boilerplate

## References

### Initial Next-auth and Prisma setup

- prisma/prisma-examples [typescript/rest-nextjs-api-routes-auth](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes-auth)

### Https proxy for Facebook auth

- used custom server
- Github [issue](https://github.com/vercel/next.js/discussions/10935)
- package [local-ssl-proxy](https://www.npmjs.com/package/local-ssl-proxy) - **removed**

### ESlint and Prettier configuration

- official Vercel example [with-typescript-eslint-jest](https://github.com/vercel/next.js/tree/canary/examples/with-typescript-eslint-jest)

- useful [tutorial](https://paulintrognon.fr/blog/typescript-prettier-eslint-next-js)

### Credentials provider

- [docs](https://next-auth.js.org/providers/credentials)
- Prisma example [Todomir/next-prisma-auth-credentials](https://github.com/Todomir/next-prisma-auth-credentials)
- MongoDB [tutorial](https://dev.to/dawnind/authentication-with-credentials-using-next-auth-and-mongodb-part-1-m38)
- MongoDB code [DawnMD/next-auth-credentials](https://github.com/DawnMD/next-auth-credentials)

### Custom SignIn page

- [v4 docs](https://next-auth.js.org/configuration/pages)

### Create trusted certificate

- install and run mkcert (instruction at the bottom) with [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy/) - not this, abanodoned
- install mkcert [easy way](https://www.howtoforge.com/how-to-create-locally-trusted-ssl-certificates-with-mkcert-on-ubuntu/) - this
- to point Node.js to the root certificate add `NODE_EXTRA_CA_CERTS` var permanently in `~/.profile` and log out/log in

```
# add this in ~/.profile
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

- test with:

```
echo $NODE_EXTRA_CA_CERTS
```

- You should see this in the browser:
  ![certificate](/notes/certificate.png)

### Google auth

- Redirect URI

```
https://localhost:3001/api/auth/callback/google
```

### Facebook auth

- email must be different from Google auth\* - check db in callback
- Just set these two:

  - Basic settings -> Site URL

  ```
  https://localhost:3001/
  ```

  - Facebook login settings -> Valid OAuth Redirect URIs:

  ```
  https://localhost:3001/api/auth/callback/facebook
  ```

### Upload avatar and header image

- [tutorial](https://betterprogramming.pub/upload-files-to-next-js-with-api-routes-839ce9f28430)
- upload multiple fields [upload.fields() example](https://stackoverflow.com/questions/36096805/uploading-multiple-files-with-multer-but-from-different-fields)

### Custom Https Express Typescript server

- to use uploads folder at runtime
- Next.js example (typescript, http) [custom-server-typescript](https://github.com/vercel/next.js/tree/canary/examples/custom-server-typescript)
- Stackoverflow (https, express, js) [example](https://stackoverflow.com/questions/55304101/https-on-localhost-using-nextjs-express)

### Api Error handling

...

### next-connect

...

### Validation

...

### Prisma db reset, migrate, seed

Reset (doesnt work):

```
npx prisma migrate reset --skip-seed

```

Migrate:

```
npx prisma migrate dev --skip-seed

```

Seed:

```
npx prisma db seed

```

Dashboard:

```
npx prisma studio

```

### Prisma User Model path

```typescript
import { User } from '@prisma/client';
import { User } from '.prisma/client';
```

### VS Code extensions

- add in `.vscode/extensions.json`
- list extensions:

```
code --list-extensions
```

### Responsive Navbar

- [tutorial](https://www.notimedad.dev/responsive-navbar-tailwind-react/#Products)

### Dropdown

- [tutorial](https://letsbuildui.dev/articles/building-a-dropdown-menu-component-with-react-hooks)
- [Codesandbox](https://codesandbox.io/s/dropdown-menu-jzldk)

### Responsive hook

- [tutorial](https://blog.logrocket.com/developing-responsive-layouts-with-react-hooks/)

### useSession

- ok to use in components, it's from context

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

```
NEXTAUTH_URL=https://3001-jade-gayal-p7d8xqgb.ws-eu25.gitpod.io
NEXT_PUBLIC_BASE_URL=https://3001-jade-gayal-p7d8xqgb.ws-eu25.gitpod.io/
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

### React hook form async default values and reset

- github issue [example](https://github.com/react-hook-form/react-hook-form/issues/2492#issuecomment-771578524)

### Custom Tailwind React button

- [tutorial](https://www.luckymedia.dev/blog/creating-a-reusable-button-component-with-react-and-tailwind)

### Expand commands in env variables, for mobile preview

```
# start.sh
INTERFACE=wlp3s0
WAN_IP=$(ip -4 addr show $INTERFACE | grep -oP '(?<=inet\s)\d+(\.\d+){3}')

# then use WAN_IP in .env
NEXTAUTH_URL=https://$WAN_IP:3001
NEXT_PUBLIC_BASE_URL=https://$WAN_IP:3001/
```

### Custom fonts Tailwind

- youtube [tutorial](https://www.youtube.com/watch?v=sOnBG2wUm1s)

### Load env variables in Next.js

- must do this to prevent undefined env vars with custom server

```
import { loadEnvConfig } from '@next/env';
const projectDir = process.cwd();
loadEnvConfig(projectDir);
```

- docs [link](https://nextjs.org/docs/basic-features/environment-variables)

---

### Todo

- admin role - done, maybe type admin | user in prisma
- middleware folder, withProtect, withRoles - done
- disable prisma seed before migrate - done
- error handling, next-connect - almost done
- rethink routes, extract - done
- fix User type - done
- migrate to axios, fetch has no progress, done
- add types file, mostly done
- fix routing from Post, done
- vs code recommended extensions, done
- install icons, done
- navbar, done
  - responsive, hamburger
  - avatar dropdown
- update next and everything else, done
- faker content, reseed, clean files, done

---

- extract styles, tailwind, next examples
- validation server, client, example [with-joi](https://github.com/vercel/next.js/tree/canary/examples/with-joi), [next-joi](https://github.com/codecoolture/next-joi)
- logging
- tests, next examples
- docker
- ci cd, deploy
- readme
- dev, prod remove express https
- sqlite to postgres
- tailwind and root font-size 10px 1rem, global and component styles
- Header component
- fix remaining forms
- react query, redux toolkit, redux toolkit query
- \_document.tsx
- redux toolkit vercel example
- pagination
- update readme before forget...
- refetch session after user is edited
- try catch to prisma calls getServerSideProps...
- comment model
- light, dark, orange, blue theme
- soft delete for reseed, or logger
- semantic html
- Next.js Image config
- post - hero image, tag, category
- comments model
- global styles button, links...
- footer
- drafts count in session or user state
- icons in navbar items
- style forms, hero img upload
- settins form header dropzone, repeat password
- protected routes and 404 pages
- typescript silent errors...
- \_document.jsx
- on change tw-base.scss must restart, no intelisense for my utilities
