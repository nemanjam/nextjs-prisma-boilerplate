# React Query

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

- useEffect runs only on browser, for redirect

```
  useEffect(() => {
    if (me) router.push(Routes.SITE.HOME);
  }, [me, router]);
```

- use `enabled` prop in useQuery to wait until async args are not resolved

- `<Link />` with custom componenta requires `passHref` and `forwardRef` [next docs](https://nextjs.org/docs/api-reference/next/link#dynamic-routes)

- problem: `Loading failed for the <script> with source “https://localhost:3001/_next/static/chunks/pages/settings/%5Busername%5D.js”.` and hard page refresh, solution:

```
// use this
const settingsHref = `/settings/${user.username}`;

// instead of this
const settingsHref = {
  pathname: '/settings/[username]/',
  query: { username: user.username },
};
```

### Pagination React Query

- `keepPreviousData` and `useQuery` is v3, `usePaginatedQuery` is v2
- official [example](https://github.dev/tannerlinsley/react-query)
- Udemy [example](https://github.dev/bonnie/udemy-REACT-QUERY)

### v4 migration

- [docs](https://react-query-beta.tanstack.com/guides/migrating-to-react-query-4)

- QueryKeys array, not a string

```ts
// queries
useQuery<ClientUser, AxiosError>([QueryKeys.ME], fn);
// mutations
queryClient.invalidateQueries([QueryKeys.POSTS_DRAFTS]);
```

- remove setLogger, new logger option

```ts
// v3
import { setLogger } from 'react-query';
setLogger(customLogger);
// v4
const queryClient = new QueryClient();
const queryClient = new QueryClient({ logger: customLogger });
```

- loading, error and empty state [hashnode](https://blog.whereisthemouse.com/good-practices-for-loading-error-and-empty-states-in-react)

- use `// use await queryClient.refetchQueries([QueryKeys.ME])` to refetch me, no need to pass refetch to context

- problem: refetching ME with undefined `id`, solution: `me.id` must be part of the key for fetcher function to use new id arg, Github [discussion](https://github.com/tannerlinsley/react-query/discussions/3514), `useMe` is in `MeProvider` it's mounted on every page

```ts
// clear keys and cache
queryClient.removeQueries([QueryKeys.ME]);
```

### Isolated Jest tests

- use this for shared cache debugging `const queryData = queryClient.getQueriesData(['posts-home'])`

- **problem:** shared QueryCache between tests, error 500 tests pass alone and fail in group
- **solution:**

1.  initial list of handlers passed to setupServer() can **not** be reset, use `server.use(handler500)` inside the test, it **will** override success handler [discussion](https://github.com/mswjs/msw/discussions/1289)

2.  **all constructors** (`new QueryCache(), new MutationCache()`) inside `new QueryClient(config)` must be invoked for each test

```ts
// lib-client/react-query/queryClientConfig.ts

/**
 * important: must be function and not object literal
 * so constructors (new QueryCache ...) are invoked for each test
 * to prevent shared cache between tests
 */
const getQueryClientConfig = (): QueryClientConfig => ({
  defaultOptions: {
    queries: {
      suspense: true,
      useErrorBoundary: true,
    },
    mutations: {
      useErrorBoundary: false,
    },
  },
  // HERE
  queryCache: new QueryCache({
    onError: (error) => formatError('Query', error),
  }),
  mutationCache: new MutationCache({
    onError: (error) => formatError('Mutation', error),
  }),
});
```

- tests pass even without `--runInBand` jest option

### Hydration bug

- useSession and useMe are dependant queries
- fetch userId only in getServerSideProps and pass it as prop or in cache to avoid async useSession call in useMe

- React Query providers before SuspenseWrapper???, probably not, only MeProvider

```jsx
<QueryClientProvider client={queryClient}>
  <Hydrate state={dehydratedState}>
    <SuspenseWrapper suspenseName="root">
      <Component {...pageProps} />
    </SuspenseWrapper>
    <ReactQueryDevtools />
  </Hydrate>
</QueryClientProvider>
```

- `me.id` must be part of the query key, [my discussion](https://github.com/TanStack/query/discussions/3514)

- if it can return undefined must be async for Promise types, interesting

```ts
await queryClient.prefetchQuery([QueryKeys.ME_ID], () => me.id);
await queryClient.prefetchQuery([QueryKeys.ME_ID], async () => me?.id);
```

- error is in some state update after rerender, even if id in useMe is sync, can use useSession
- comment out one by one component to isolate it

- **codesndbox example:** 1. provider around suspense, 2. provider rerenders because it uses state that updates, 3. child od suspense is lazily imported

- memoize childern of Suspense, not of the provider??

```ts
const Counter2 = lazy(() => import('./Counter2'));
```

- separate SuspenseWrapper and ErrorBoundaryWrapper, ErrorBoundaryWrapper can go in root
- root SuspenseWrapper in MeProvider or both in PageLayout
- or useMe to use isLoading and not Suspense
- useMe isnt bellow Suspense but Navbar is for screen Loader

### Refetch queries imperatively

- must use `const queryClient = useQueryClient();` to get same client instance and not `const queryClient = new QueryClient();`, that's why it wouldn't work

```ts
// NOT THIS
const queryClient = new QueryClient();

// this
const queryClient = useQueryClient();

const handleClick = async () => {
  queryClient.invalidateQueries(['me', 1]);
  // or
  await queryClient.refetchQueries(['me', 1], { exact: true });
};
```

### Return Types with dependant queries

- [tkdodo blog](https://tkdodo.eu/blog/react-query-and-type-script#type-safety-with-the-enabled-option)

```ts
// RUNTIME check
// throw error to avoid return type Promise<File | null>

export const getImage = async (imageUrl: string | undefined): Promise<File> => {
  if (!imageUrl) return Promise.reject(new Error('Invalid imageUrl.'));
  //...
  // return success File with axios
};
```

- important: whenever query is not refetching **key didnt change**, is not unique
- this is optimistic updates after mutation, with objects merging story (swr and apollo) instead of refetch

### Hydration bug - final

- **most important cause, drastic:**
- happens when query keys drastically don't match in getServerSideProps `queryClient.prefetchQuery(key, fn)` and `useQuery(key, fn)` on client, page reloads slowly, that's it
- keys need to be managed constant structure... tutorial?, filterkeys() can return different results
- you can pass different data in SSR and CSR and watch render
- debug with React Query tools

- this will help too:

1. block all UI until **all data is ready**, Navbar for example, this
2. all props in UserItem available at same time, fixes it, {user, me}, so so, provider should work same as props

- test case repo [nemanjam/hydration-test-case](https://github.com/nemanjam/hydration-test-case)
- isLoading in MeProvider and Navbar causes more errors in production
