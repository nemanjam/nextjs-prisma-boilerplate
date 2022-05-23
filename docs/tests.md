### Setup tests in Next.js (no type checking)

- [docs](https://nextjs.org/docs/testing)
- jest setup [vercel example](https://github.com/vercel/next.js/tree/canary/examples/with-jest)

### Setup tests in Next.js (ts-jest)

- youtube [playlist](https://www.youtube.com/watch?v=7uKVFD_VMT8&list=PLYSZyzpwBEWTBdbfStjqJSGaulqcHoNkT&index=2)

#### Install ts-jest

```sh
yarn add --dev jest ts-jest @types/jest

# create jest.config.js
yarn ts-jest config:init
```

#### Install React Testing Library

```sh
yarn add --dev @testing-library/react @testing-library/user-event @testing-library/dom @testing-library/jest-dom

# package.json
"test": "jest",
```

```js
// jest.config.js
testEnvironment: 'jsdom',
globals: {
    'ts-jest': {
        tsconfig: './tsconfig.jest.json',
    },
},
setupFilesAfterEnv: ['./jest.setup.ts'],

// jest.setup.ts
import '@testing-library/jest-dom';
```

#### Setup Eslint

```sh
# test with fit()
yarn add --dev eslint eslint-plugin-jest

# test with screen.debug()
yarn add --dev eslint-plugin-testing-library
```

- rtlRender in unit tests, customRender with loggedin user and all providers in integration tests

### React Query testing

- [docs](https://react-query.tanstack.com/guides/testing)
- [tkdodo blog](https://tkdodo.eu/blog/testing-react-query)
- [tkdodo repo](https://github.com/TkDodo/testing-react-query)
- test mutation [codesandbox](https://codesandbox.io/s/friendly-brahmagupta-1dz7v?file=/src/App.test.js) - perform mutation and assert result on ui

### Forms testing

- Bruno Antunes [youtube](https://www.youtube.com/watch?v=MhFSuOjU624)
- Github [code](https://github.com/bmvantunes/youtube-react-testing-video8-forms-react-testing-library)

### React Testing Libraries queries

- bug: `TypeError: window.matchMedia is not a function`, [solution](https://stackoverflow.com/questions/39830580/jest-test-fails-typeerror-window-matchmedia-is-not-a-function)

- Print element by class - `screen.debug()`

```ts
const postsList = document.querySelector('.home__list');
screen.debug(postsList, 20 * 1000);
```

- if it has state (async) update debug has to wait (`state wrapped with act() warning`) if not already bellow waitFor(), findby()...

```ts
await waitFor(() => {
  const postsList = document.querySelector('.home__list');
  screen.debug(postsList, 20000);
});
```

- better name element you are selecting

```ts
const title = screen.getByRole('heading', {
  name: /home/i,
});
```

- select text input

```ts
// option 1
const searchInput = screen.getByRole('textbox', {
  name: /search/i,
});
// option 2
const searchInput = screen.getByLabelText(/search/i);
```

- run only one test or describe

```
yarn jest -t "describe desc..." // single describe()
yarn jest -t "test desc..." // single test()
yarn test:client --onlyFailures // run only failed tests

test.only('...')
describe.only('...')

test.skip('...')
describe.skip('...')
```

- problem: `The above error occurred in the <Link> component, Error: Uncaught [TypeError: Cannot read properties of undefined (reading 'catch')]`, solution: `jest.fn() must return promise` (important, spent half day on it)

```ts
prefetch: jest.fn(() => Promise.resolve()),
reload: jest.fn(() => Promise.resolve(true)),
```

- variable inside a regex

```ts
const title = await screen.findByRole('heading', {
  name: RegExp(`${searchTerm}`, 'i'),
});
```

- integration tests - views folder, unit - components, hooks
- ask afterEach() clear router.push: jest.fn()?
- optimal query for spaces \s? `screen.getByLabelText(/confirm password/i);`, answer: use space

```ts
// space is space
\s matches any whitespace character (equivalent to [\r\n\t\f\v ])
```

- mock single property/fn from module import

```ts
// https://stackoverflow.com/questions/59312671/mock-only-one-function-from-module-but-leave-rest-with-original-functionality
// cast type
// https://stackoverflow.com/a/60007123/4383275
// jest.requireActual(...) - most important

// import
import { signIn, ClientSafeProvider } from 'next-auth/react';

// set
jest.mock('next-auth/react', () => ({
  ...(jest.requireActual('next-auth/react') as {}), // cast just for spread
  signIn: jest.fn().mockReturnValue({ ok: false }),
}));
const mockedSignIn = jest.mocked(signIn, true); // just for type .mockClear();

// assert
await waitFor(() => expect(mockedSignIn).toHaveBeenCalledWith(providers.facebook.id));
// cleanup mock
mockedSignIn.mockClear();
```

- alternative way - spyOn(), difference?
- views folder - integration tests

- mock image File [gist](https://gist.github.com/josephhanson/372b44f93472f9c5a2d025d40e7bb4cc)
- mock URL.createObjectURL in jest-dom [stackoverflow](https://stackoverflow.com/questions/52968969/jest-url-createobjecturl-is-not-a-function)

- how to use jest.spyOn() to mock local function [tutorial](https://www.carlrippon.com/how-to-mock-a-function-in-jest-with-typescript/)

```ts
// jest.spyOn(object, methodName);
import * as data from './data'; // local import
const mock = jest.spyOn(data, 'getCharacter').mockResolvedValue('Bob'); // za promise
mock.mockRestore(); // oslobodi fju na kraju testa
```

- image mocked as {} somewhere ??? [next docs](https://nextjs.org/docs/testing), bad way, use msw
- msw mock image binary response [docs](https://mswjs.io/docs/recipes/binary-response-type)

- load `.env.test` and `.env.test.local` in tests [stackoverflow](https://stackoverflow.com/questions/63934104/environment-variables-undefined-in-nextjs-when-running-jest)

- mock File and Blob in Node.js polyfill [@web-std/file](https://www.npmjs.com/package/@web-std/file) - doesn't work in jsdom, only node.js, **don't use it**

- mock Blob with [blob-polyfill](https://www.npmjs.com/package/blob-polyfill)

```ts
yarn add -D blob-polyfill

// jest.setup.ts
import { Blob } from 'blob-polyfill';

// mock Blob with polyfill
global.Blob = Blob;

// useUpdateUser.ts getImage()
// replace File with Blob - works
const file = new File([response.data], 'default-image');

const file = new Blob([response.data], { type: 'image/jpeg' });
file['lastModifiedDate'] = new Date();
file['name'] = 'default-image';

return file as File;
// debug
// const text = await file.text();
// console.log('text', text);
```

- mock `URL.createObjectURL` [jsdom-worker](https://github.com/developit/jsdom-worker), **this works**

```ts
// jest.config.js
setupFiles: ['jsdom-worker'];
```

- wait for more than one element to disapear

```ts
await waitForElementToBeRemoved(() => [
  screen.getByTestId(/header\-placeholder/i),
  screen.getByTestId(/avatar\-placeholder/i),
]);
```

- jest log upside down, first error at bottom...
- userEvent v14 breaking changes `clear()` (select text and delete input) and `type()` [docs](https://testing-library.com/docs/user-event/utility)

```ts
// utils
userEvent.clear();
userEvent.type(); // utility api
userEvent.click(); // convinience api
// keyboard, pointer...
const user = userEvent.setup();

await user.keyboard('[ShiftLeft>]'); // > hold key, /release
await user.click(element);
```

```ts
// v13 working
// edit name
userEvent.type(nameInput, `{selectall}${updatedName}`);

// click submit
const submitButton = screen.getByRole('button', {
  name: /submit/i,
});

userEvent.click(submitButton);

// ------------

// v14 working
// edit name
await userEvent.clear(nameInput);
await userEvent.type(nameInput, updatedName);

// click submit
const submitButton = screen.getByRole('button', {
  name: /submit/i,
});

await userEvent.click(submitButton);
```

- wrapped in act warning - something async is out of order and not awaited, race and state update, forms e.g., events, (react state update is always async)

- submit form without button click

```ts
import { fireEvent } from '@testing-library/react';

fireEvent.submit(searchInput); // or form element
// enter key
fireEvent.keyPress(input, { key: 'Enter', charCode: 13 });
```

- problem: msw handler not fired and console logging, solution: order of handlers is wrong, route is overridden by other handler, move it to top, **actually:** routes overlap, must be in same handler with switch statement, Next.js handles priority by default

- useSession in useMe needs SessionProvider to call msw `/api/auth/session/` endpoint

```ts
const { result, waitFor } = renderHook(() => useMe(), {
  wrapper: createWrapper(), // here
});
```

- who sets `process.env.NODE_ENV === 'test'`

- hooks test examples [github](https://github.com/juliencrn/usehooks-ts/tree/master/lib/src)

- useViewport hook test [github](https://github.com/juliencrn/usehooks-ts/blob/master/lib/src/useWindowSize/useWindowSize.test.ts)

- assert element content `expect(screen.getByTestId('my-test-id')).toHaveTextContent('some text');`

- problem: cant find element by role, solution: `getByRole()` is in describe block instead od test block

- :root element <html /> `screen.debug(document.documentElement)`, assert class `expect(element).toHaveClass('some-class')`

- search input validation error message test [toHaveErrorMessage docs github](https://github.com/testing-library/jest-dom#tohaveerrormessage)
- [Bruno Antunes Youtube](https://www.youtube.com/watch?v=MhFSuOjU624)

```tsx
// aria tags for toHaveErrorMessage()
<input
  aria-errormessage="search-err-msg-id"
  aria-invalid="true"
/>
<p id="search-err-msg-id">err msg</p>

// no error message regex `.+` - at least 1 char
expect(searchInput).not.toHaveErrorMessage(/.+/i);
```

- test happy path form onSubmit

```tsx
// mock
const onSubmit = jest.fn();
// clear just that mock
afterEach(() => {
  onSubmit.mockClear();
});
// pass
customRender(<SearchInput onSearchSubmit={onSubmit} />);
// assert
expect(onSubmit).toHaveBeenCalledWith(inputText);
```

- clear one and all mocks

```ts
// must be declared in describe scope to be cleaned in afterEach()
const onSubmit = jest.fn();

// ones with jest.clearAllMocks(); can be defined in local test scope

afterEach(() => {
  // one
  onSubmit.mockClear();
  // all
  jest.clearAllMocks();
});
```

### Suspense

- when wrapped with Suspense and `suspense: true` in React Query initially always loader is dispalyed
- `await screen.findByText()` IS solution because you need to wait a bit more, or you will get empty `<body><div/></body>`
- **point** - wait for final wanted elements with `findById`, not all intermidiate loaders one by one with `waitForToBeRemoved`

```ts
customRender(<Footer />);
// either wait for loader to disappear
await waitForElementToBeRemoved(() => screen.getByTestId(/loading/i));

// or retry first element - preferred solution
const contentText = await screen.findByText(/footer 2022/i);
```

### Error 500 handlers

- cant listen with 2 handlers on same route
- mock console.log(), error(), warn()

```ts
const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation();
...
mockedConsoleError.mockRestore(); // clean
```

- test error 500 useQuery, must be wrapped with `<SuspenseWrapper />`, and ` suspense: true, useErrorBoundary: true` is in `queryClientConfig` so `result.current.isError` is undefined, you must assert message text on ErrorBoundary **component**, hook is rendered inside a component, use `import { screen } from '@testing-library/react'` screen from rtl import

- only for mutations ErrorBoundary is disabled `useErrorBoundary: false`

```ts
// result.current=null

test('fail 500 query user hook', async () => {
  const mockedConsoleError = jest.spyOn(console, 'error').mockImplementation();

  const params: UserGetQueryParams = { username: fakeUser.username };

  // return 500 from msw
  errorHandler500();
  renderHook(() => useUser(params), {
    wrapper: createWrapper(),
  });

  // uses ErrorBoundary, isError is undefined
  // queries: { suspense: true, useErrorBoundary: true }
  // assert ErrorBoundary and message and not result.current.isError
  const errorBoundaryMessage = await screen.findByTestId(/error\-boundary\-test/i);
  expect(errorBoundaryMessage).toHaveTextContent(errorMessage500);

  mockedConsoleError.mockRestore();
});
```

- error handling with Axios interceptor for transforming error, for sideeffects React Query global handler is enough

```ts
const queryClientConfig: QueryClientConfig = {
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
    },
    mutations: {
      useErrorBoundary: false,
    },
  },
  queryCache: new QueryCache({
    onError: (error) => console.error('global Query error handler:', error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => console.error('global Mutation error handler:', error),
  }),
};
```

- msw concurrent run limitation [issue](https://github.com/mswjs/msw/issues/474)

### Node.js Api unit testing

- unit services: input - argument object, mock prisma, assert service output
- unit controllers: input - http supertest, mock service, assert http response and status, assert service mock calledWithArgs
- always mock one layer bellow
- any class can be unit tested

#### Services unit tests

- Prisma client is mocked, singleton or dependency injection
- Prisma [docs](https://www.prisma.io/docs/guides/testing/unit-testing) - unit testing db services

- assert rejected promise [stackoverflow](https://stackoverflow.com/a/58326750/4383275)
- assert ApiError `toBeInstanceOf()` and set correct constructor name [stackoverflow](https://stackoverflow.com/questions/68899615/how-to-expect-a-custom-error-to-be-thrown-with-jest)

#### Controllers unit tests

- controller needs to be isolated from db to be unit tested
- TomDoesTech Youtube tutorial [Github repo](https://github.com/TomDoesTech/Testing-Express-REST-API), mock service value `.mockReturnValueOnce(userPayload);` and assert service input args `expect(createUserServiceMock).toHaveBeenCalledWith(userInput);`, unit for controllers, service mocked, controller forwards same input to service, supertest, ok

- supertest testClient with Next.js [dev.to tutorial](https://dev.to/noclat/build-a-full-api-with-next-js-1ke), [stackoverflow example](https://stackoverflow.com/questions/66446689/next-js-mock-api-endpoints-send-params-in-req-body-for-post)

```ts
// match part of the object, ignore Date()
expect(body).toEqual(
  expect.objectContaining({
    id: fakePostWithAuthor.id,
    title: fakePostWithAuthor.title,
    content: fakePostWithAuthor.content,
  })
);

// partial match nested object
expect(nestedObject).toEqual(
  expect.objectContaining({
    payload: expect.objectContaining({
      specific: 'specific value',
    }),
  })
);
```

### Node.js Api integration testing

- test database in Docker
- Prisma [docs](https://www.prisma.io/docs/guides/testing/integration-testing)
- connect to test db with `env.test.local`, `DATABASE_URL`, so it can be remote db

- entire test env should be decoupled from dev, db + node.js
- seed/trunc db for each tests suite in beforeAll, afterAll, describe or test file
- for each tests run create/destroy Docker container `docker-compose up -d`, `docker-compose down`
- asserts with database queries
- cannot start app without seed data

- Hashnode Github Actions integration [tutorial](https://blog.ludicroushq.com/a-better-way-to-run-integration-tests-with-prisma-and-postgresql), [Github](https://github.com/ludicroushq/prisma-integration-test-example)
- replaces PrismaClient with mock `prisma/__mocks__/index.ts` and `jest.mock('./prisma/index');` (real file)
- run Postgres directly in Github Actions
- `.env.test` and `.env.dev`?

- docs example [testing-express](https://github.com/prisma/prisma-examples/tree/latest/typescript/testing-express), integration tests, supertest, sqlite, `prisma-test-environment.js` class

- service unit with test db, asserts by reading db, integration with createServer(), fetch and test db, 2 containers Node.js and Postgres, Github Actions example code, Dev.to [tutorial](https://dev.to/eddeee888/how-to-write-tests-for-prisma-with-docker-and-jest-593i), Github [repo](https://github.com/eddeee888/topic-prisma-testing)

- productioncoder [youtube](https://www.youtube.com/watch?v=Fa-oNdqOOYg&list=PL1Nml43UBm6eTkjJtAPfdfjk-x2I_1r-Y&index=6), [Github](https://github.com/productioncoder/test-node-with-docker), test.sh pg_ready, migrations postgres volume

- Github Actions postgres docker-compose up [Github](https://github.com/andersnylund/next-js-prisma-integration-tests)

- must create user in db before post, so it can connect, and for loggedin user mock
- must mock loggedin user for protected endpoints, maybe possible to manipulate req object

```ts
// mock logged in user
// todo: maybe this is possible without mock, manipulate req object
const mockedGetMeService = jest.spyOn(usersService, 'getMe').mockResolvedValue(author);
```

- use describe blocks and afterAll() to delete all tables for new context

### Multiple Jest projects - client, server

- [tutorial](https://homoly.me/posts/organizing-tests-with-jest-projects)
- [stackoverflow](https://stackoverflow.com/questions/47192083/how-do-you-setup-multiple-jest-configs-within-a-single-project)
- [gist example](https://gist.github.com/wldcordeiro/6dc2eb97a26a52d548ed4aa86f2fc5c0)
- [base config](https://orlandobayo.com/blog/monorepo-testing-using-jest/)

- for Api unit tests services layer is required

- userEvent v14 `click(), clear(), type()` must be wrapped in act, bug, Github [issue](https://github.com/testing-library/user-event/issues/938#issuecomment-1111976312)
- all tests fail in parallel because of this
- **MUST run in sequence for msw 500**

### Docker test environment (local testing only)

- both database and node.js containers
- same env for integration api test and cypress e2e
- derrived from prod, no edit, no install packages, frontend prod build
- both Dockerfile.test (from dev, simple enough) and docker-compose.test.yml (from prod) in pair
- Docker only for local test run, in GA it runs directly in os
- dont drop database, create and destroy container
- `POSTGRES_DB=nextjs_prisma_test_db` in .env file will create db in container

- order:

  1. Start the container and create the database
  2. Migrate the schema
  3. Run the tests
  4. Destroy the container

- app works without seed, just migrated schema without data
- app built in Dockerfile, no volumes and live reload, simple
- no, build app in container runtime - cant rebuild while app is runing, but it will rebuild just app without container
- seed in beforeAll in tests only
- change postgres port to 5435 so test-db container can run concurently with dev-db

```yml
# docker-compose.test.yml
npb-db-test:
  # change internal port
  command: postgres -p 5435
  # expose it to host
  ports:
    - '5435:5435'
```

```bash
# .env.test.local
POSTGRES_PORT=5435
```

- app is not running so `NODE_ENV=test` probably? api integration `test`, Cypress `production`
- basically you just need test database
- cant run dev and test concurently node_modules are shared, so use same port
- volumes so you just rebuild app and not container, Dockerfile CMD too
- PrismaClient singleton for seed [stackoverflow](https://stackoverflow.com/a/57455542/4383275)
- separate yarn script for integration tests because unit tests dont need database
- seed not needed in beforeAll()

```js
// singleton class example
class PrismaSingleton {
  constructor(prisma) {
    this.prisma = prisma;
    PrismaSingleton.instance = this;
  }

  static getInstance() {
    if (!PrismaSingleton.instance) {
      PrismaSingleton.instance = new PrismaSingleton(new PrismaClient());
    }
    return PrismaSingleton.instance;
  }
}
```

### Run tests in Docker, yarn scripts

- `wait-for-it.sh ip:port` needed only when tests run on host, otherwise `depends_on` works

### Github Actions test CI

- Github [repo](https://github.com/eddeee888/topic-prisma-testing)
-

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
cy.findByRole('heading', { name: /home/i });
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
