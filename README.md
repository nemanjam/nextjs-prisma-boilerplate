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

- email must be different from Google auth - check db in callback
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

- Jonas Schmedtmann Udemy NodeJs tutorial [code](https://github.com/jonasschmedtmann/complete-node-bootcamp)
- Toptal [tutorial](https://www.toptal.com/nodejs/node-js-error-handling)
- productioncoder [youtube](https://www.youtube.com/watch?v=DyqVqaf1KnA) and [code](https://github.com/productioncoder/express-error-handling)
- NextJs api middleware [example](https://jasonwatmore.com/post/2021/08/23/next-js-api-global-error-handler-example-tutorial) (not used)
- [tutorial](https://sematext.com/blog/node-js-error-handling/)

### next-connect

- next-connect [example](https://github.com/hoangvvo/nextjs-mongodb-app)
- youtube [tutorial](https://www.youtube.com/watch?v=TvCu_oK083U)
- youtube [code](https://github.dev/bmvantunes/youtube-2020-july-next-api-routes-next-connect)

### React hook form

- [docs](https://react-hook-form.com/advanced-usage)
- async default values [issue](https://github.com/react-hook-form/react-hook-form/issues/2492#issuecomment-771578524)

### Dropzone

- Dropzone with react hook form [tutorial](https://dev.to/vibhanshu909/how-to-use-react-dropzone-with-react-hook-form-1omc)

### Validation

- next-validations usage with next-connect [example](https://github.com/jellydn/next-validations/discussions/170)
- React-hook-form [zodResolver](https://github.com/react-hook-form/resolvers)
- [zod schema validator](https://github.com/colinhacks/zod)

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

### Custom typescript server production

- [example](https://github.com/vercel/next.js/tree/canary/examples/custom-server-typescript)

## Docker

### Dockerfile and docker-compose dev and prod

- production official Dockerfile [example](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile)
- production multistage Dockerfile [example](https://github.com/kachar/yadi/blob/main/web/next.js/Dockerfile)
- dev and prod docker-compose, Dockerfile [gist](https://gist.github.com/kennethnwc/efc81d448a6381f07fd42b4305f12f68)
- dev Dockerfile and docker-compose [tutorial](https://dev.to/kumareth/next-js-docker-made-easy-2bok)

### Next.js and Docker env vars

- env vars Docker [docs](https://docs.docker.com/compose/environment-variables/)
- env vars Next.js [docs](https://nextjs.org/docs/basic-features/environment-variables)
- buildtime, runtime Docker env vars [table](https://www.saltycrane.com/blog/2021/04/buildtime-vs-runtime-environment-variables-nextjs-docker/)

### Prisma Docker

- prisma migrate prod [tutorial](https://notiz.dev/blog/prisma-migrate-deploy-with-docker)
- `"migrate-prod": "npx prisma migrate deploy",`
- `CMD` instead of `RUN`

- custom .env file (only for dev) [docs](https://www.prisma.io/docs/guides/development-environment/environment-variables/using-multiple-env-files)

```
# dotenv works in yarn script but not in bash

"migrate": "dotenv -e .env.local -- npx prisma migrate dev --skip-seed",
```

- `npx prisma migrate deploy` must be executed on production at runtime, so `"prisma": "3.7.0"` must be in prod dependencies
- IMPORTANT: permissions - delete volumes, images and containers in Portainer everytime for Dockerfile and d-c.yml changes to take effect
- solution: create volumes (/app, /app/node_modules, /app/.next) with current user:group (node:node), pass as ARGs or hardcode, dont mkdir /app
- just node:node in Dockerfile works fine
- run `id` to se uid, gid
- .next doesn't update on create post - outdated user in session and database, logout/in

```
// pages/post/drafts.tsx

author: { id: session.user.id },
```

```
// prisma node_modules permission error
// delete named volumes in Portainer after each Dockerfile change
volumes:
- ./:/app
- np-dev-node_modules:/app/node_modules // this
- np-dev-next:/app/.next // and this
```

### Next.js and Docker production build

- Next.js build must connect to database to generate existing pages on Docker image BUILD time
- use ARG `docker build --build-arg ARG_DATABASE_URL=...` to pass this temporary connection

- ENV ARG difference...
- Docker [tutorial](https://vsupalov.com/docker-env-vars/)
- Next.js and Docker [tutorial](https://www.saltycrane.com/blog/2021/04/buildtime-vs-runtime-environment-variables-nextjs-docker/)
- `docker-compose.dev.yml` and `docker-compose.prod.yml` are same file for Docker, services must have different names, it will rebuild the same image
- ts-node seed in production error
- move prisma to production dependencies
- migrate seed.ts to javascript so @types don't need to be in prod dependecies, and call it with node
- `seed.js` is separate build context invoked with npx, can't import code from next.js app, env vars must be passed separately
- prisma generate writes to node_modules, needed after both dev and prod dependecies
- static site generation needs data from db, both prisma migrate deploy and seed are needed - no?
- better to connect to external db with data
- prisma sqlite path is relative to schema file
- this line is for typescript error in alpine in Dockerfile.prod `RUN apk add --no-cache libc6-compat`
- `RUN openssl version` openssl not found, `node:16-alpine` has no openssl
- debug prisma:

```
ENV DEBUG=prisma:client,prisma:engine
prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});
```

- MISTAKE: should be `COPY prisma ./prisma` for `prisma:client:fetcher Error: The table main.Post does not exist in the current database.`
- problem: can't access schema.prisma and dev.db sqlite write error in container (not in volume), solution: prisma folder must have x permsission to cd into folder and files rw, so 766, (666 doesn't work)

```
RUN chmod 766 -R prisma uploads
```

- debug size with dive

```
docker run --rm -it \
    -v /var/run/docker.sock:/var/run/docker.sock \
    wagoodman/dive:latest nextjs-prisma-boilerplate_nextjs-prisma-prod:latest
```

- shrink image size:

  - don't do `RUN chown -R node:node /app` - 700MB
  - only dist, . next and volumes - uploads, prisma

- env vars not expanded in production?
- disk usage node_modules

```bash
/app # du -sh ./node_modules/* | sort -nr | grep '\dM.*'
123.8M  ./node_modules/@prisma
95.6M   ./node_modules/@next
59.3M   ./node_modules/prisma
41.2M   ./node_modules/react-icons
32.5M   ./node_modules/next
17.1M   ./node_modules/faker
5.0M    ./node_modules/moment
```

```
yarn add prisma
du -hs node_modules
133M	node_modules
---
yarn add @prisma/client
du -hs node_modules
143M	node_modules
---
yarn add prisma @prisma/client
du -hs node_modules
143M	node_modules
```

- add migration-seed container with prisma

### Next.js buildtime, runtime env vars

- .env.\* (development, production, local - secret, test) files [docs](https://nextjs.org/docs/basic-features/environment-variables)
- buildtime vars, env key in `next.config.js` [docs](https://nextjs.org/docs/api-reference/next.config.js/environment-variables)
- runtime vars `serverRuntimeConfig` (private, server), `publicRuntimeConfig` (public, client, server) [docs](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration)
- tutorial [Youtube](https://www.youtube.com/watch?v=Mh9BJNfAVsM)

### Named volumes permissions chown -R node:node

- AFTER deleting container you have to DELETE VOLUME TOO

### DATABASE_URL Docker buildtime

- wherever you replace getServerSideProps with getStaticProps it will read db buildtime and precompile page with data from db, you can switch getServerSideProps and getStaticProps to test

### Remote containers VS Code

- port forward in devcontainer.json only needed with Dockerfile, already defined in docker-compose.yml

### Traefik reverse proxy

- blog [tutorial](https://www.alexhyett.com/traefik-vs-nginx-docker-raspberry-pi) and Github [repo](https://github.com/alexhyett/traefik-vs-nginx-docker)
- Digital ocean [tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-v2-as-a-reverse-proxy-for-docker-containers-on-ubuntu-20-04)
- Hashnode [tutorial](https://rafrasenberg.hashnode.dev/docker-container-management-with-traefik-v2-and-portainer) and Github [repo](https://github.com/rafrasenberg/docker-traefik-portainer)

### Traefik deploy production

- problem: cannot write to sqlite db, solution: `chmod a+rw prisma prisma/dev.db`, both folder and db file
- `chmod 777 -R prisma` - error, can't read schema.prisma
- but add `chmod a+rw -R uploads` for uploads folder

```bash
scp ./.env.local ubuntu@amd1:/home/ubuntu/traefik-proxy/apps/nextjs-prisma-boilerplate

scp ./prisma/dev.db ubuntu@amd1:/home/ubuntu/traefik-proxy/apps/nextjs-prisma-boilerplate/prisma

# to prisma folder itself non-recursively too
# only these two, not schema or folder recursively
chmod 777 prisma prisma/dev.db
```

```bash
export DATABASE_URL="file:./dev.db"
echo $DATABASE_URL

docker-compose -f docker-compose.prod.yml build

# ---

export HOSTNAME="localhost3000.live"
echo $HOSTNAME

docker-compose -f docker-compose.prod.yml up -d

docker-compose -f docker-compose.prod.yml down

```

- `env_file` inserts into container, not in docker-compose.yml, those are from host (HOSTNAME)

```yml
env_file:
  - .env.production
  - .env.local
labels:
  - 'traefik.http.routers.nextjs-prisma-secure.rule=Host(`nextjs-prisma-boilerplate.${HOSTNAME}`)'
```

- set env vars on host permanently?

### Github Actions - build Docker image

- Docker [docs](https://docs.docker.com/ci-cd/github-actions/)
- [tutorial](https://event-driven.io/en/how_to_buid_and_push_docker_image_with_github_actions/)
- example with [actions/cache@v2](https://evilmartians.com/chronicles/build-images-on-github-actions-with-docker-layer-caching)
- caching [examples](https://github.com/docker/build-push-action/blob/master/docs/advanced/cache.md)

### Postgres

- set env vars Oracle?
- allow remote connections [tutorial](https://docs.cloudera.com/HDPDocuments/HDF3/HDF-3.5.2/installing-hdf/content/configure_postgres_to_allow_remote_connections.html) and [volume paths](https://stackoverflow.com/questions/67172400/how-to-launch-a-postgres-docker-container-with-valid-initial-setting)

```yml
volumes:
  - ./prisma/pg-data:/var/lib/postgresql/data
  - ./prisma/pg-config/pg_hba.conf:/var/lib/postgresql/data/pg_hba.conf
# - ./prisma/pg-config/postgresql.conf:/var/lib/postgresql/data/postgresql.conf
```

- needed to build with local database

```bash
sudo chown -R $USER ./prisma/pg-data
```

### Postgres allow remote connections

#### expose Postgres directly without Traefik (can't route TCP to subdomains, only IPs, layer4)

- set custom location for `postgresql.conf` (remove it from `/var/lib/postgresql/data`)
- can't mount conf files in `/var/lib/postgresql/data`, folder not empty error
- change port to `5433`

```yml
command: postgres -p 5433 -c config_file=/etc/postgresql.conf
```

- set custom location for `pg_hba.conf` in `postgresql.conf`

```bash
hba_file = '/etc/pg_hba.conf'
```

- allow remote connections in `pg_hba.conf`
- [tutorial](https://docs.cloudera.com/HDPDocuments/HDF3/HDF-3.5.2/installing-hdf/content/configure_postgres_to_allow_remote_connections.html)

```bash
# IPv4 local connections:
host    all             all             0.0.0.0/0               trust

# IPv6 local connections:
host    all             all             ::/0                    trust
```

- mount data and config files

```yml
volumes:
  - ./pg-data:/var/lib/postgresql/data
  - ./pg-config/postgresql.conf:/etc/postgresql.conf
  - ./pg-config/pg_hba.conf:/etc/pg_hba.conf
```

### Adminer custom port

- set e.g. `localhost:5433` in the server field

### NEXTAUTH_URL required at build time

- or error: login redirect to http:$protocol
- in `server.ts` log:

```
NEXTAUTH_URL: $PROTOCOL://$HOSTNAME,
```

- pass `build-args:` in Github Actions, must use double quotes, single quotes fail

```
build-args: |
  "ARG_DATABASE_URL=${{ secrets.NPB_DATABASE_URL }}"
  "ARG_NEXTAUTH_URL=${{ secrets.NPB_NEXTAUTH_URL }}"
```

- to reflect NEXTAUTH_URL in `.env.production` change you must rebuild container

- NEXTAUTH_URL different values at build and runtime???
- docker-compose up with force pull latest image?

### Heroku Docker

- port must not be hardcoded in Dockerfile
- upload volume can't work

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

### React Query

- pages are just for routing, views are real pages with fetching

```
await Promise.all([invalidateQueries(...), invalidateQueries(...)])
```

- avatar and header images in Settings form should be in form state and not React Query state
- keep user and post query cache separated (api calls) on client, ok now
- hook return values trigger rerender, session, status `const { data: session, status } = useSession();`
- only replace `getSession` with `getMe` if other props than `user.id` and `user.email` are accessed, else leave `getSession`, no need for db call
- problem: `Error: Rendered more hooks than during the previous render` - different key or subkey in getServerSideProps and useQuery - NO, solution: means you are rendering useQuery useUser hook conditionally and have `if return` before the hook
- add Eslint add BOTH plugin and rule [react docs](https://reactjs.org/docs/hooks-rules.html)

```
yarn add -D eslint-plugin-react-hooks

// Your ESLint configuration
{
  "plugins": [
    // ...
    "react-hooks"
  ],
  "rules": {
    // ...
    "react-hooks/rules-of-hooks": "error", // Checks rules of Hooks
    "react-hooks/exhaustive-deps": "warn" // Checks effect dependencies
  }
}
```

### Serialize Dates in getServerSideProps solved

- use `babel-plugin-superjson-next` and `superjson-next` [Readme](https://github.com/blitz-js/superjson#using-with-nextjs)
- make sure it's `.babelrc` with `.`

### Pagination Prisma

- offset - for small number, must select previos, can jump to page, can sort on any field
- cursor - for infinite scroll facebook timeline, can handle large number, needs one sorted field, can't jump to page
- offset and cursor-based pagination [prisma docs](https://www.prisma.io/docs/concepts/components/prisma-client/pagination) and [tutorial](https://medium.com/@smallbee/super-fast-offset-pagination-with-prisma2-21db93e5cc90)
- Prisma code [example](https://dnlytras.com/snippets/searchable-paginated-endpoint-prisma/)

### Pagination React Query

- `keepPreviousData` and `useQuery` is v3, `usePaginatedQuery` is v2
- official [example](https://github.dev/tannerlinsley/react-query)
- Udemy [example](https://github.dev/bonnie/udemy-REACT-QUERY)

### Prisma Postgres full text search

- text search, `search` prop [docs](https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search)
- filtering `AND, OR, where, contains` [docs](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)

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
- settings form header dropzone, repeat password, done
- style forms, hero img upload, done
- icons in navbar items, done
- global styles button, links..., done
- footer, done
- problem: seed is buggy? solution: prisma 3 has bug with Promise.all([...]), use await, await, await..., done
- traefik container reverse proxy, done
- fix remaining forms, done
- sqlite to postgres, done
- dev, prod remove express https, done
- docker, done
- validation server, client, example [with-joi](https://github.com/vercel/next.js/tree/canary/examples/with-joi), [next-joi](https://github.com/codecoolture/next-joi), done with zod
- extract styles, tailwind, next examples, done
- query key in getServerSidePropa and useQuery and type it, done

---

- logging
- tests, next examples
- ci cd, deploy
- readme
- tailwind and root font-size 10px 1rem, global and component styles
- Header component
- react query, redux toolkit, redux toolkit query
- \_document.tsx
- redux toolkit vercel example
- pagination
- update readme before forget...
- refetch session after user is edited
- try catch to prisma calls getServerSideProps...
- light, dark, orange, blue theme
- soft delete for reseed, or logger
- semantic html
- Next.js Image config
- post - hero image, tag, category
- comments model
- drafts count in session or user state
- protected routes and 404 pages
- typescript silent errors...
- on change tw-base.scss must restart, no intelisense for my utilities
- themes
- docker express maybe, github actions, remote containers
- where to place and call printLoadedEnvVariables() ?
- add prisma migration container, move prisma to devDependencies
- next.js multiple build contexts, next.js app, server.ts and seed.js
- heroku docker
- update traefik-proxy readme
- pagination with prisma and react query
- type all request and response objects
- add search posts field
- create docs folder with mds
- group pagination items
- full text search posts
- request, response types
- me query, only userId and email in session
- throw 404 from zod api...
- error path, db function, getServerSideProps, api endpoint, ask reddit, github
- mutations
- handle errors in getServerSideProps
- edit user, delete user - admin
- progressbar tailwind div
- validate ids in api zod
- replace session.user on server
- leave just id and email in session.user, and type
- users page, pagination, api filtering
- test `await queryClient.prefetchQuery([QueryKeys.POSTS_PROFILE, profile.username, 1]...`
- redirect on protected pages, logged in and admin cases
