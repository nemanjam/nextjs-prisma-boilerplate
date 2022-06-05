### Cypress

- run tests on production bulid `yarn build && yarn start && yarn cypress`, [docs](https://nextjs.org/docs/testing#running-your-cypress-tests)

  > Since Cypress is testing a real Next.js application, it requires the Next.js server to be running
  > prior to starting Cypress. We recommend running your tests against your production code to more
  > closely resemble how your application will behave.

- for Cypress and Next.js `NODE_ENV` should be `production` to avoid recompiling
- next-auth [docs](https://next-auth.js.org/tutorials/testing-with-cypress)
- Next.js [docs](https://nextjs.org/docs/testing), with-cypress Github [example](https://github.dev/vercel/next.js/tree/canary/examples/with-cypress)
- Cypress Real world app [repo](https://github.com/cypress-io/cypress-realworld-app), todomvc [example](https://github.com/cypress-io/todomvc)
- short Youtube [playlist](https://www.youtube.com/playlist?list=PLYuQF7T02SRwiJe7iS9WfsbQcO-fmmorN), Github [repo](https://github.com/Scrump31/Client-Manager/tree/cypress)
- `.should('exist')` on cypress instead of `expect()` in jest
- start prod build with test db and seed in beforeAll
- test `DATABASE_URL` is passed at runtime to prisma, not next.js app on build, but dev mode is **also** set at **runtime** in `server.ts` (it's just compiled, env var is not inlined)
- when app is started on host db hostname must be `localhost`, when app is in docker db hostname must be `npb-test-db` service name (dev and test)
- setup:
- `beforeAll, afterAll` -> `before(), after()` in Cypress
- must use `tsconfig.json` for `name.test.ts` Typescript tests

```ts
// add in cypress/support/commands.js
import '@testing-library/cypress/add-commands';
```

- create admin user for cypress?

- ignore specific console error in Cypress

```ts
Cypress.on('uncaught:exception', (err, runnable) => {
  // we expect a 3rd party library error with message 'list not defined'
  // and don't want to fail the test so we return false
  if (err.message.includes('list not defined')) {
    return false;
  }
});
```

- `contains()` same as `findByText()`
- wait() for requests (GET search posts) [tutorial](https://www.cypress.io/blog/2019/12/23/asserting-network-calls-from-cypress-tests/), [docs](https://docs.cypress.io/api/commands/wait#Aliases)

```ts
// needed for wait()
cy.intercept('GET', `${Routes.API.POSTS}*`).as('searchPosts');

// wait for http request
cy.wait('@searchPosts');
```

- assert redirect to another page - it's browser, just url and UI

```ts
// assert redirect to home
cy.url().should('eq', Cypress.config().baseUrl + '/');
cy.findByRole('heading', { name: /^home$/i }).should('exist');
```

- todo: mock session [discussion](https://github.com/nextauthjs/next-auth/discussions/2053)
- seed db task example [repo](https://github.com/cypress-io/cypress-example-recipes/tree/master/examples/server-communication__seeding-database-in-node)
- docs [all examples](https://docs.cypress.io/examples/examples/recipes#Server-Communication)
- cypress docker [article](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/)
- can NOT change and inspect **next** page in within(...) or invoke().then(...), tricky

- intercept http must be before that GET or PATCH... call is made

```ts
// must be before click()
cy.intercept('PATCH', `${Routes.API.POSTS}*`).as('patchPost');

// edit title
cy.findByRole('button', { name: /update/i }).click();

cy.wait('@patchPost');
```

- save element text for later, **it() must use function(){}**

```ts
context('post page', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.findByText(/^log out$/i).should('exist');

    cy.get('.home__list .post-item:first-child h2').invoke('text').as('postTitle');
  });

  // MUST use function() instead of () => {} for this
  it.only('post page, edit and delete post', function () {
    // remember title
    const postTitle = this.postTitle as string;
    // ...
  });
});
```

### Cookies

- whole next-auth session is in `next-auth.session-token` cookie

```ts
// cannot clear session this way, even before beforeAll
Cypress.Cookies.defaults({
  preserve: cookieName,
});
```

```ts
// correct way, disable default cookies clear afterEach test
beforeEach(() => {
  Cypress.Cookies.preserveOnce('next-auth.session-token');
});

// clear after last test, so next run can run
// no, clear cookies in before(), this causes warning
after(async () => {
  cy.clearCookies();
  cy.getCookies().should('be.empty');
});

const loginAsAdmin = () => {
  // assert cookie after login
  cy.getCookie(cookieName).should('exist');
};
```

### Commands

```ts
// cypress/support/index.js

Cypress.Commands.add('loginAsAdmin', () => {
  // ...
});

// usage
cy.loginAsAdmin();
```

- types for commands

```ts
// cypress/global.d.ts

declare global {
  namespace Cypress {
    interface Chainable {
      seedDbViaUI: () => void;
      loginAsAdmin: () => void;
    }
  }
}

export {};
```

### Tasks

- use **tasks** in `cypress/plugins/index.js` to seed, teardown, not commands, returns promise and blocks, run any node process, [tutorial](https://timdeschryver.dev/blog/reseed-your-database-with-cypress#modifying-the-timeout-time), [docs](https://docs.cypress.io/api/commands/task#Return-number-of-files-in-the-folder), [example](https://github.dev/yeungalan0/site-monorepo/blob/main/my_site/cypress/support/commands.ts)

```ts
// cypress/plugins/index.js

on('task', {
  'db:seed': async () => {
    await seedInstance.handledSeed();
    return null;
  },
  'db:teardown': async () => {
    await seedInstance.handledDeleteAllTables();
    return null;
  },
});

// call
cy.task('db:seed');
cy.task('db:teardown');
```

### Cypress Docker

- Bahmutov tutorial [docs](https://www.cypress.io/blog/2019/05/02/run-cypress-with-a-single-docker-command/#testing-site-on-host)
- test **online** website with `cypress/included:4.1.0` Docker image[cypress-example-docker-compose-included](https://github.com/cypress-io/cypress-example-docker-compose-included), make `npb-e2e-chrome` service
- **app** and cypress Dockerfiles and d-c.yml services, Dockerfile needed for **additional** npm devDependencies in Cypress image [cypress-io/cypress-example-docker-compose](https://github.com/cypress-io/cypress-example-docker-compose), **realistic usecase, app and tests in Docker**, no Github Actions, custom Cypress install from **package.json** and base image (only needed for custom cypress install)
- custom install - **any imports inside `/cypress` folder**

```ts
// cypress/support/commands.js
import '@testing-library/cypress/add-commands';
```

- run test as correct non-root user from host [repo](https://github.com/cypress-io/cypress-docker-images/tree/master/examples/included-as-non-root-mapped), this [Dockerfile](https://github.com/cypress-io/cypress-docker-images/blob/master/examples/included-as-non-root-mapped/Dockerfile), create user and group `appuser` with ids from the host passed via ARG

- **problem:**

```
 Error: Webpack Compilation Error
npb-e2e         | [tsl] ERROR
npb-e2e         |       TS18002: The 'files' list in config file 'tsconfig.json' is empty.
```

- **solution:** `tsconfig.json` is not mounted in `tests-e2e`, mount it.

- must replace localhost:3001 with npb-app-test:3001 in `cypress.json`, `.env.e2e` ?

```json
"env": {
  "COOKIE_NAME": "next-auth.session-token",
  "SITE_NAME": "http://localhost:3001" // here
}
```

- uploads folder for images?

### Cypress Github Actions

- [docs](https://docs.cypress.io/guides/continuous-integration/github-actions)
- example repo [bahmutov/cypress-gh-action-included](https://github.com/bahmutov/cypress-gh-action-included) - **this one, additional dependencies**
- docker-compose up -d db-containers in Github Actions [bahmutov/chat.io](https://github.com/bahmutov/chat.io)
- for Cypress in GA use `cypress-io/github-action@v2` action or `cypress/included:4.1.0` docker container???
- Cypress Github Actions example, jobs: install, install-windows, ui-chrome-tests, ui-chrome-mobile-tests, ui-firefox-tests, no docker-compose.yml [cypress-realworld-app](https://github.com/cypress-io/cypress-realworld-app), **complete CI example**
- if you want te reuse local Cypress Docker container in GA you must rebuilt container each time, for additional yarn dependencies? Better use `cypress-io/github-action@v2`
- ` actions/upload-artifact@v3`, `actions/download-artifact@v3` to share build **and dependencies** between jobs

```yaml
jobs:
  install:
    runs-on: ubuntu-latest
    # image with just browsers without Cypress
    container: cypress/browsers:node16.14.2-slim-chrome100-ff99-edge
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      # just install Cypress on bare image with browsers
      # action can install Cypress and run tests
      # probably to avoid Dockerfile with additional dependecies?
      # actually to reuse install step
      - name: Cypress install
        uses: cypress-io/github-action@v2
        with:
          runTests: false

        # reuse - save built code between jobs
        - name: Save build folder
        uses: actions/upload-artifact@v3
        with:
          name: build
          if-no-files-found: error
          path: build

  # reause install job in other jobs
  ui-chrome-tests:
    # this, like depends_on
    needs: install

    steps:
      - name: Checkout
        uses: actions/checkout@v3

        # use built code it like this in ui-chrome-tests job
      - name: Download the build folders
        uses: actions/download-artifact@v3
        with:
          name: build
          path: build

```

### Custom Cypress folder

- `--config-file` vs `--project` [github](https://github.com/cypress-io/cypress-test-nested-projects#faq)
- [docs](https://docs.cypress.io/guides/guides/command-line#cypress-open-project-lt-project-path-gt)

```json
// i need this (moves entire folder with default cypress.json)
"cypress": "cypress open --project ./tests-e2e",
// and not this (moves only cypress.json)
"cypress": "cypress open --config-file tests-e2e/cypress.json",
```

- **cypress container needs:** @testing-library/cypress, prisma, typescript, all imported files from next app, seed.js, all imports from seed.js (bcryptjs, faker), wait-on
- be careful with imports from next.js app in Cypress tests, you need to copy them in container for Docker, **and imports of their imports...**

- fakeUser as fixture, and not import from next.js app, [docs](https://docs.cypress.io/api/commands/fixture), just require json

```ts
// 2-advanced-examples/files.spec.js
const requiredExample = require('../../fixtures/example');
```

- if dates are needed use reviver callback [stackoverflow](https://stackoverflow.com/questions/4511705/how-to-parse-json-to-receive-a-date-object-in-javascript)

```
npb-app-test    | error - ESLint: Failed to load plugin 'cypress' declared in '.eslintrc.json': Cannot find module 'eslint-plugin-cypress' Require stack: - /app/__placeholder__.js Referenced from: /app/.eslintrc.json
```

### Reusable yarn script - function

```json
// original
"test:e2e:env:original": "dotenv -e .env.test.local -- sh -c 'yarn test:e2e'",
// print args
"with:env:debug": "fn() { echo \"1=$1 2=$2 3=$3\";}; fn --",
// fn
"with:env": "fn() { npx dotenv -e \"$3\" -- bash -c \"$2\";}; fn --",
// call
"test:e2e:env": "yarn with:env 'yarn test:e2e' '.env.test.local'"
//
// shorter form without yarn and ''
// always make separate yarn script without :env first
"with:env": "fn() { npx dotenv -e \"$3\" -- bash -c \"yarn $2\";}; fn --",
"test:e2e:env": "yarn with:env test:e2e .env.test.local"
```

### Cypress env vars

- [docs](https://docs.cypress.io/guides/guides/environment-variables#Overriding-Configuration)

```ts
// override, most right - most priority
cypress.config.js -> cypress.env.json -> CYPRESS_*  regular env var -> cypress run --env v1=val -> describe('', {env: {v1: 'val'}}), or it()
```

- `npb-e2e` container does NOT need access to `uploads` folder, all is in `npb-app-test` and via axios, seed is ok

- env overrides for Docker in `docker-compose.yml`

```yaml
npb-e2e:
  # docker env override
  environment:
    # only cy.visit(), cy.request() url
    - CYPRESS_baseUrl=http://npb-app-test:3001
    # seed db_url
    - POSTGRES_HOSTNAME=npb-db-test
  # only db_url for seed, no Next.js vars
  env_file:
    - .env.test.local
```

- app container env overrides, `NEXTAUTH_URL` and db_url, **npb-app-prod?**

```yaml
# docker-compose.test.yml
npb-app-test:
  # docker env override
  environment:
    # ref to itself
    # NEXTAUTH_URL, NEXT_PUBLIC_BASE_URL in axiosInstance, imageLoader
    # NEXTAUTH_URL=$PROTOCOL://$HOSTNAME:$PORT
    - HOSTNAME=npb-app-test
    # db_url
    - POSTGRES_HOSTNAME=npb-db-test
  env_file:
    - .env.test
    - .env.test.local
```

```yaml
# docker-compose.test.yml
npb-app-dev:
  # docker env override
  environment:
    # ref to itself
    # NEXTAUTH_URL, NEXT_PUBLIC_BASE_URL in axios, imageLoader
    - HOSTNAME=npb-app-dev
    # db_url
    - POSTGRES_HOSTNAME=npb-db-dev
  env_file:
    - .env.development
    - .env.local
```

- `environment:` has precedence over `env_file:` in docker-compose.yml
- look resloved env vars in **Portainer**

```bash
# expands later, remains same in container
NEXTAUTH_URL=$PROTOCOL://$HOSTNAME:$PORT
---
# must expand immediately for schema migrate, for seed (next.js) doesn't
# expands immediately, cannot override part
DATABASE_URL=postgresql://${POSTGRES_USER}...
```

- dotenv-cli reddit?
- list all states env.test.integration, env.e2e, env.test.local

```bash
# api integration
# local
# .env.test
HOSTNAME=localhost

# .env.test.local
POSTGRES_HOSTNAME=localhost
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public

# ----
# docker
# .env.test
# http://npb-db-test:3001/api/auth/session - cannot work as localhost...
HOSTNAME=localhost # maybe npb-app-test will work, no browser

# .env.test.local
POSTGRES_HOSTNAME=npb-db-test
DATABASE_URL=expanded

# ------------------
# cypress

# .env.e2e
HOSTNAME=npb-app-test
# Expected baseUrl to be a fully qualified URL (starting with `http://` or `https://`).
# Instead the value was: "$PROTOCOL://$HOSTNAME:$PORT"
# Cypress wont expand
CYPRESS_baseUrl=$PROTOCOL://$HOSTNAME:$PORT
# solution:
# expand it like this
CYPRESS_baseUrl=${PROTOCOL}://${HOSTNAME}:${PORT}

# .env.e2e.local
POSTGRES_HOSTNAME=npb-db-test
DATABASE_URL=expanded
```

- conclusion: both docker test envs are the same, just pass them in d-c.yml as `env_file`, so `.env.test.docker`, `.env.test.docker.local`, next.js in docker will read vars directly without .env files
- conclusion 2: better use single Javascript object or json for .envs
- add d-c.e2e.yml and d-c.test.yml because of different command:
