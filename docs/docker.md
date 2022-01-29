# Docker

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
