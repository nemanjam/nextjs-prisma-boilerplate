### Github Actions - build Docker image

- Docker [docs](https://docs.docker.com/ci-cd/github-actions/)
- [tutorial](https://event-driven.io/en/how_to_buid_and_push_docker_image_with_github_actions/)
- example with [actions/cache@v2](https://evilmartians.com/chronicles/build-images-on-github-actions-with-docker-layer-caching)
- caching [examples](https://github.com/docker/build-push-action/blob/master/docs/advanced/cache.md)

- Postgres container can run inside Github Actions locally [tutorial](https://blog.ludicroushq.com/a-better-way-to-run-integration-tests-with-prisma-and-postgresql)
- maybe docker in docker...???

```yaml
name: main
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres
        env:
          POSTGRES_USER: root
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: example
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 14.x
        uses: actions/setup-node@v1
        with:
          node-version: '14.x'

      - run: npm ci

      - run: npm run ci:test
        env:
          DATABASE_URL: 'postgresql://root:postgres@localhost:5432/example'
```

### Github Actions - tests

- services: for database
- prisma mysql example [tutorial](https://zenn.dev/mano_r/articles/e9242cee1f4411)
- node caching [actions/setup-node](https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#caching-packages-data)
- prisma mongo [example](https://github.com/prisma/prisma-examples/blob/latest/.github/workflows/test-mongodb.yaml)
- prisma blog postgres [example](https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-deployment-bbba1ps7kip5)
- general tests CI [example](https://blog.testproject.io/2021/02/01/using-github-actions-to-run-automated-tests/)
- Cypress real world app [repo](https://github.dev/cypress-io/cypress-realworld-app)

### Print commit id and message

- [stackoverflow](https://stackoverflow.com/a/54413284/4383275)

```yml
- name: Print commit id and message
  run: |
    git show -s --format='%h %s'
```

### Github Actions env vars and env files

- in GA NODE_ENV=test so prod app loads .env.test and all env vars already exist, maybe NODE_ENV=ci?
- jest loads .env.test too
- limit jobs timeout
- Cypress `"start:e2e": "NODE_ENV=test node dist/index.js"`... yarn script ci: maybe...
- better to use yaml file for env vars than .env files
- monorepo structure with packages and gitmodules

### NODE_ENV vs APP_ENV

- **point:** there is already existing convention for `NODE_ENV=dev | prod | test` that all npm libraries respect, it can't have custom value (will affect libs), **reserved already**
- custom value is same as undefined and same as development
- use `APP_ENV` for custom values that describe environment, e.g. local-prod, local-test, ci-test...

- simpler [tutorial](https://rafaelalmeidatk.com/blog/why-you-should-not-use-a-custom-value-with-node-env)
- another [tutorial](https://seanconnolly.dev/dont-be-fooled-by-node-env)
- good [tutorial](https://koistya.medium.com/demystifying-node-env-var-b25ed43c9af)

- CI-CD build job needs to set APP_VERSION var and tag
- both local and GA are `NODE_ENV=test` but `APP_ENV=local-test and ci-test`

- Next.js automatically sets NODE_ENV based on start command (or yarn scripts for custom server) [Blitz.md](https://github.com/blitz-js/blitz/blob/canary/nextjs/errors/non-standard-node-env.md)
- use NODE_ENV and APP_ENV in combination

```bash
# local, docker, ci, gitpod, replit
# public var
APP_ENV=

# development, production, test
NODE_ENV=
```

- put all vars with APP_ENV prefix in .env.local, .env.development and .env.production and use APP_ENV to select evironment - file, write override logic in app.config.js, NODE_ENV only in yarn scripts
- use Next.js system to preserve priority loading system
- `.env.development` - public, same for all users
- `.env.local` - secret, or public specific for a user

- where env vars are used (recapitulation):

```bash

# custom server.js (not next app)
# docker-compose.yml
# Dockerfile
PROTOCOL=
HOSTNAME=
PORT=

# [...next-auth] api
# axios baseUrl React Query
# docker-compose.prod.yml
NEXTAUTH_URL=


# Postgres container
POSTGRES_HOSTNAME=
POSTGRES_PORT=
POSTGRES_USER=
POSTGRES_PASSWORD=
POSTGRES_DB=
MY_UID=
MY_GID=

# schema.prisma
# docker-compose.prod.yml
DATABASE_URL=

# Cypress container
CYPRESS_baseUrl=
```

- ${!VAR2} - variable indirection doesn't work in Next.js `.env*` files
- impossible to calculate vars directly in `.env*` files, for Postgres docker-compose.yml for example, so calc in js does not make sense
- use one file per `APP_ENV` instead all APP_ENVs in a single file

```bash
# variable indirection
DEV_APP_ENV=LOCAL
NAME_PORT=${DEV_APP_ENV}_PORT
PORT=${!NAME_PORT} # does not work
```

- **chosen solution:**

- use Method 6 `dotenv-cli` with `sh -c ''` because it loads files for both Next.js app, tests and docker-compose.yml, simple load .env file you need, every process starts with yarn script
- one `.env.${APP_ENV}`, `.env.${APP_ENV}.local` per `APP_ENV`
- just `APP_ENV` and yarn file must match, that's it
- vars loaded with `dotenv -e file` go into `process.env` so have highest priority and override other files (which is good, `.env.development.docker` from container will override `.env.development` from volume)

- all possible methods [tutorial](https://getridbug.com/reactjs/how-to-use-different-env-files-with-nextjs/)
- blitz.js `APP_ENV` [docs](https://blitzjs.com/docs/environment-variables)

```json
"test:e2e:env": "dotenv -e .env.test.local -- sh -c 'yarn test:e2e'",
```

- better use `.env.development.local` and `.env.production.local` instead of single `.env.local`, it's possible
- when you comment out vars in .env file you have multiple .env files in that file
- Next.js recognizes production, so use local and docker production terms for staging (environment to test production deployment)

- **Github Actions env vars final:**
  -Next.js app will load `.env.test` (`.env.test.local` isn't commited) because Jest sets `NODE_ENV=test`, but `process.env.VARS` hardcoded in `tests.yml` will override everything
- all jobs use local yarn commands (withoud cmd:env)
