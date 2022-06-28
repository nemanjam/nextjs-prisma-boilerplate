# Docker

### Dockerfile and docker-compose dev and prod

- production official Dockerfile [example](https://github.com/vercel/next.js/blob/canary/examples/with-docker/Dockerfile)
- production multistage Dockerfile [example](https://github.com/kachar/yadi/blob/main/web/next.js/Dockerfile)
- dev and prod docker-compose, Dockerfile [gist](https://gist.github.com/kennethnwc/efc81d448a6381f07fd42b4305f12f68)
- dev Dockerfile and docker-compose [tutorial](https://dev.to/kumareth/next-js-docker-made-easy-2bok)
- multistage Dockerfile only for prod, other images aren't uploaded anywhere (dev, test)
- if Dockerfile doesn't have CMD or entrypoint it has some default from base image
- `env_file` vs `--env-file` [docs](https://docs.docker.com/compose/environment-variables/#using-the---env-file--option)

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

### Migration container

- separate container is needed and Github Action job, keep 2 images on Dockerhub, versions must match
- keep migration in same image for simplicity

### Run volumes as current (non root) user

- [stackoverflow](https://stackoverflow.com/questions/40462189/docker-compose-set-user-and-group-on-mounted-volume)

- add `UID` and `GID` ENV vars in `~/.profile`, [stackoverflow](https://stackoverflow.com/questions/56188573/permission-issue-with-postgresql-in-docker-container)

```bash
# UID and GID env vars for Docker volumes permissions
export UID=$(id -u)
export GID=$(id -g)
```

```bash
# shell variable
echo $UID
1000
---
# environment variable
printenv | grep UID  # no output
env | grep UID # same
```

- **solution:**
- **UID** is already defined variable in bash - for warning
- only works from `.bashrc`, and **not** from `.profile`

```bash
# UID and GID env vars for Docker volumes permissions
export MY_UID=$(id -u)
export MY_GID=$(id -g)
```

- must create `.next, dist, node_modules` manualy on host as user before d-c up for `npb-app-test`, although folders created in Dockerfile.test

#### Postgres volume non-root user solution:

- Docker Postgres **Arbitrary --user Notes** [docs](https://hub.docker.com/_/postgres), on Github [docker-library/docs/blob/master/postgres/content.md](https://github.com/docker-library/docs/blob/master/postgres/content.md#arbitrary---user-notes)

- **simplest:** use `postgres:14.3-bullseye` (133.03 MB) instead of `postgres:14-alpine` (85.81 MB)
- in docker-compose.yml `user: '${MY_UID}:${MY_GID}'` (1000:1000)
- and **must create manually folder `pg-data-test` on host**, and then it leaves it alone (maybe good enough)

- **it works:** mount one dir above (`prisma/pg-data`) and set data dir as subdirectory (`prisma/pg-data/data-test`), add `prisma/pg-data/.gitkeep`
- Gitlab [example](https://gitlab.apertis.org/infrastructure/qa-report-app/-/merge_requests/39)

```yml
# maybe hardcode 1000:1000 for prod
user: '${MY_UID}:${MY_GID}'
volumes:
  - ./prisma/pg-data:/var/lib/postgresql/data
environment:
  - PGDATA=/var/lib/postgresql/data/data-test
```

```bash
# .gitignore, .dockerignore
# ignore data, commit .gitkeep
prisma/pg-data/data-*
```

### docker-compose override, extend

- [docs](https://docs.docker.com/compose/extends/)

- remember this: `services with 'depends_on' cannot be extended`

```bash
ERROR: Cannot extend service 'npb-app-test' in /home/username/Desktop/nextjs-prisma-boilerplate/docker-compose.test.yml: services with 'depends_on' cannot be extended
```

- merge d-c1 and d-c2 [tutorial](https://hackernoon.com/how-to-extend-docker-compose-file-jc723ypq)

```bash
docker-compose -f docker-compose.yml -f docker-compose.prod.yml config > docker-compose.stack.yml
```

- extends with -f dc1 -f dc2 works, both containers have same name

```json
// to run npb-app-test omit -f docker-compose.e2e.yml
// exits because it doesn't have start command
"docker:npb-app-test:npb-db-test:up": "docker-compose -f docker-compose.test.yml -p npb-test up -d npb-app-test npb-db-test",

// to run npb-app-test (e2e) include -f docker-compose.e2e.yml
// container renamed with:
// container_name: npb-app-e2e
"docker:npb-app-test:npb-db-test:e2e:up": "docker-compose -f docker-compose.test.yml -f docker-compose.e2e.yml -p npb-test up -d npb-app-test npb-db-test",
```

- for build **both** d-c.yml file are needed, because of other services
- doceker-compose.yml is runtime configuration

### docker-compose debugging

- use `docker-compose config` to see if env vars are substituted, or for resulting docker-compose.override.yml
- replace `build, up ...` with `config` in yarn script

```yml
services:
  web:
    image: 'webapp:${TAG}'
```

```bash
docker-compose --env-file ./config/.env.dev config
```

### docker-compose up for production

- can pass custom `./my/path/.env.live` file to `docker-compose up` command
- all vars must be in a single file, Github [issue](https://github.com/docker/compose/issues/7326)

```bash
docker-compose --env-file ./config/.env.dev up
```

### docker-compose live production

- **staging:**
- `docker-compose.prod.yml`, `/envs/production-docker/` - this is staging practically, to test production locally
- `.env.production*` - to reuse Next.js envs configuration, locally
- don't build image on live server, 1GB RAM enough to host and 4GB to build image

- **live (real production):** - other repo, no Traefik install here

- you can pass many files into container (`env_file:`), but **only one** file to docker-compose.yml (`--env-file` option)

#### alternative 1 (all env vars in a single file):

- put all (1. container's public, private, 2. docker-compose.yml) env vars in a single file and let docker-compose.yml forward them into container
- Note: better comment out private vars here and set them on OS or use some dedicated vault (best)

```bash
# .env

# app container vars -------------------
# public vars
- APP_ENV=live
- SITE_PROTOCOL=http
- SITE_HOSTNAME=subdomain.domain.com
- PORT=3001
- NEXTAUTH_URL=https://subdomain.domain.com
# private vars
- DATABASE_URL
- SECRET=long-string
- FACEBOOK_CLIENT_ID
- FACEBOOK_CLIENT_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET

# postgres container vars -------------------
# private vars
- POSTGRES_HOSTNAME=npb-db-live
- POSTGRES_PORT=5432
- POSTGRES_USER=postgres_user
- POSTGRES_PASSWORD=
- POSTGRES_DB=live-db

# docker-compose.yml vars
- SITE_HOSTNAME # already defined above for app container
- MY_UID=1001 # id -u && id -g in ~/.bashrc or here, used in postgres container
- MY_GID=1001
```

#### alternative 2 (separate app and docker-compose vars):

- pass container's env vars with `env_file:` in docker-compose.yml
- pass docker-compose.yml vars with `docker-compose up --env-file=.env.production.live.dc` or export them via shell before `docker-compose up`

```bash
# app container's public vars
# .env.production.live
- APP_ENV=live
- SITE_PROTOCOL=http
- SITE_HOSTNAME=subdomain.domain.com
- PORT=3001
- NEXTAUTH_URL=https://subdomain.domain.com

# app and postgres container's private vars
# .env.production.live.local
# app
- DATABASE_URL
- SECRET=long-string
- FACEBOOK_CLIENT_ID
- FACEBOOK_CLIENT_SECRET
- GOOGLE_CLIENT_ID
- GOOGLE_CLIENT_SECRET
# postgres
- POSTGRES_HOSTNAME=npb-db-live
- POSTGRES_PORT=5432
- POSTGRES_USER=postgres_user
- POSTGRES_PASSWORD=
- POSTGRES_DB=live-db

# docker-compose.yml vars
# .env.production.live.dc
- SITE_HOSTNAME
- MY_UID=1001
- MY_GID=1001
```

- docker-compose can build image but can't tag image in same command (will use tag from `image:` in d-c.yml), `docker build` can tag [cheatsheet](https://www.saltycrane.com/cheat-sheets/docker/)

### yarn scripts for Docker

- `docker:dev:up` is enough because source and `.env*` files are mounted via volume plus correct `.env*` files are passed in `docker-compose.yml` via `env_file:` (**of course**), no need for `docker:dev:up:env`, same for docker:tests
- env viles are only needed for `docker:prod:build` script (ARGs)
