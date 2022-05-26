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
