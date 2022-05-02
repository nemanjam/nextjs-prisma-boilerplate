### Api Error handling

- Jonas Schmedtmann Udemy NodeJs tutorial [code](https://github.com/jonasschmedtmann/complete-node-bootcamp)
- Toptal [tutorial](https://www.toptal.com/nodejs/node-js-error-handling)
- productioncoder [youtube](https://www.youtube.com/watch?v=DyqVqaf1KnA) and [code](https://github.com/productioncoder/express-error-handling)
- NextJs api middleware [example](https://jasonwatmore.com/post/2021/08/23/next-js-api-global-error-handler-example-tutorial) (not used)
- [tutorial](https://sematext.com/blog/node-js-error-handling/)

### Handle errors in getServerSideProps with next-connect

- [stackoverflow example](https://stackoverflow.com/questions/66763973/how-to-handle-errors-inside-getserversideprops-in-next-js-using-next-connect)
- [handler.run(req, res)](https://github.com/hoangvvo/next-connect#handlerrunreq-res)
- [req.result example](https://github.com/hoangvvo/next-connect/issues/147)

### ErrorBoundary and Suspense - frontend - loading, data, empty, error states

- Hashnode [tutorial](https://blog.whereisthemouse.com/good-practices-for-loading-error-and-empty-states-in-react)
- Tkdodo, React Query Error Handling, ErrorBoundary [tutorial](https://tkdodo.eu/blog/react-query-error-handling)
- React Query reset ErrorBoundary, enable Suspense [docs](https://react-query-beta.tanstack.com/guides/suspense)
- ErrorBoundary, Suspense Render-as-you-fetch example (queryClient.prefetchQuery) [Codesandbox](https://codesandbox.io/s/github/tannerlinsley/react-query/tree/master/examples/suspense?file=/src/index.js)
- SWR Suspense [example](https://github.dev/vercel/swr/tree/main/examples/suspense)

- enable Suspense and ErrorBoundary in React Query -`suspense: true`, `useErrorBoundary: true`, thats it

- disable globaly ErrorBoundary for a mutation `useErrorBoundary: false` for `isError`, `error` for local Alert

```ts
// lib-client/react-query/queryClientConfig.ts

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


// _app.tsx
const { reset } = useQueryErrorResetBoundary();
const [queryClient] = useState(() => new QueryClient(queryClientConfig));

const fallbackRender = (fallbackProps: FallbackProps) => (
  <ErrorFallback {...fallbackProps} fallbackType="screen" />
);

return (
<QueryErrorResetBoundary>
  <ErrorBoundary fallbackRender={fallbackRender} onReset={reset}>
    <Suspense fallback={<Loading loaderType="screen" />}>
    ...
    </Suspense>
  </ErrorBoundary>
</QueryErrorResetBoundary>
);

// test-utils.tsx
// add to wrapper too...
const createTestQueryClient = () =>
  new QueryClient({
    ...queryClientConfig,
    defaultOptions: {
      ...queryClientConfig.defaultOptions,
      queries: {
        ...queryClientConfig.defaultOptions.queries,
        retry: false,
      },
    },
    ...
});
```

- useMe overrides default error handler from defaultOptions, React Query default, useHook and mutation options granularity

```ts
onError: (error) => {
    console.error('me query error: ', error.response);

    // id exists but not valid session, clear it
    if (id && error.response.status === 404) {
        signOut();
    }
},
```

- for `safeParse().error` type `"strict": true` is required in `tsconfig.json` (says in docs)

```ts
const result = postsGetSchema.safeParse(req.query);
if (!result.success) throw ApiError.fromZodError(result.error);

// tsconfig.json
"compilerOptions": {
  "strict": true, // true required for zod
```

### Suspense and MeProvider

- solution: pass `await queryClient.prefetchQuery([QueryKeys.ME, me.id], () => me);` in every page
- must be in every page separatelly or entire app will be server side rendered (no static site generation) - Custom App component [Next.js docs](https://nextjs.org/docs/advanced-features/custom-app)

```tsx
const MeProvider: FC<ProviderProps> = ({ children }) => {
  // prevent inconsistent state Server:x , Client:y error...

  /* Uncaught Error: This Suspense boundary received an update before it finished hydrating. 
  This caused the boundary to switch to client rendering. The usual way to fix this is 
  to wrap the original update in startTransition. */

  const isMounted = useIsMounted();
  const { data } = useMe();

  return (
    <MeContext.Provider value={{ me: data }}>
      {children}
      {/* this causes navbar flashing */}
      {/* {isMounted ? children : null} */}
    </MeContext.Provider>
  );
};
```

- `if (!data) return null;` in views is because of Typescript `"strictNullChecks": true`, because React Query data has type `SomeData | undefined`

### Validation Api

- **important:** only `req.query` are strings (`[key: string]: string | string[];`), `req.body` preserves correct types (number, boolean), for validation schemas and services argument types

- you can validate id's too with middleware because of `req.query.id`

```ts
const validateUserCuid = withValidation({
  schema: userIdCuidSchema,
  type: 'Zod',
  mode: 'query',
});
```

### Typescript strictNullChecks

- non-nullable props [stackoverflow](https://stackoverflow.com/questions/61912019/how-to-make-specific-props-non-nullable-in-typescript)

- env variables types `environment.d.ts` [stackoverflow](https://stackoverflow.com/questions/45194598/using-process-env-in-typescript)
- env var in Node.js is `string | undefined`, can't be number, must use `parseInt(envVar)`
