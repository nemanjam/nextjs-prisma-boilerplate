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
