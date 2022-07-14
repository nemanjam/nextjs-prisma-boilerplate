### next-connect

- next-connect [example](https://github.com/hoangvvo/nextjs-mongodb-app)
- youtube [tutorial](https://www.youtube.com/watch?v=TvCu_oK083U)
- youtube [code](https://github.dev/bmvantunes/youtube-2020-july-next-api-routes-next-connect)
- types for req, res: [Github Readme](https://github.com/hoangvvo/next-connect#typescript)

```ts
// this wil type all handler.get() .post() .use() ...
const handler = nc<NextApiRequest, NextApiResponse>();

// each .post() individually
interface ExtendedRequest {
  user: string;
}
interface ExtendedResponse {
  cookie(name: string, value: string): void;
}

handler.post<ExtendedRequest, ExtendedResponse>((req, res) => {
  req.user = 'Anakin';
  res.cookie('sid', '8108');
});
```

- actualy type `json(body: UserOrPost)` like this:

```ts
handler.get(async (req: NextApiRequest, res: NextApiResponse<PostWithAuthor>) => {
  const post = await getPostWithAuthorById(getId(req));
  res.status(200).json(post);
});
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

### Next.js buildtime, runtime env vars

- .env.\* (development, production, local - secret, test) files [docs](https://nextjs.org/docs/basic-features/environment-variables)
- buildtime vars, env key in `next.config.js` [docs](https://nextjs.org/docs/api-reference/next.config.js/environment-variables)
- runtime vars `serverRuntimeConfig` (private, server), `publicRuntimeConfig` (public, client, server) [docs](https://nextjs.org/docs/api-reference/next.config.js/runtime-configuration)
- tutorial [Youtube](https://www.youtube.com/watch?v=Mh9BJNfAVsM)

### Serialize Dates in getServerSideProps solved

- use `babel-plugin-superjson-next` and `superjson-next` [Readme](https://github.com/blitz-js/superjson#using-with-nextjs)
- make sure it's `.babelrc` with `.`

### Routing

- must use `pages/post/create/[[...id]].tsx` and not `[[id]].tsx``

```
pages/post/create/[[id]].tsx
Error: Optional route parameters are not yet supported ("[[id]]").
```

### Problem - solution

- problem: client and server props not same, solution: delete `.next` folder

### MeContext

- to avoid loading state in child components, easier error handling with suspense and ErrorBoundaries
- all fetching in Views layer

- React 18 FC and children [stackoverflow](https://stackoverflow.com/questions/71788254/react-18-typescript-children-fc)

```ts
import * as React from 'react';

type Props = {
  children?: React.ReactNode
};
const Component: React.FC<Props> = ({children}) => {...}
```

- context and provider nice [example](https://dev.to/alexander7161/react-context-api-with-typescript-example-j7a)

- use `await queryClient.refetchQueries([QueryKeys.ME])` to refetch me after login, no need to pass refetch to context

- 1. Error: This Suspense boundary received an update before it finished hydrating.
     hydratation error, switched to client side rendering, startTransition
     useMe fetching in MeProvider must NOT be ABOVE pages
     solution - move MeProvider to PageLayout

- 2. Error: inconsistent state Server: x, Client: y
     solution - check isMount {isMounted ? children : null}
     something not passed in getServerSideProps, and fetched in useQuery

```ts
/**
 * Must NOT be used ABOVE pages (_app.tsx). Use it in Layouts.
 * Only passes 'me'.
 */
const MeProvider: FC<ProviderProps> = ({ children }) => {
  // prevent inconsistent state Server:x , Client:y error
  const isMounted = useIsMounted();
  const { data } = useMe();

  return (
    <MeContext.Provider value={{ me: data }}>
      {isMounted ? children : null}
    </MeContext.Provider>
  );
};
```

### Next.js .env files

- [docs](https://nextjs.org/docs/basic-features/environment-variables)
- priority (lowest to highest): `.env` -> `.env.development, .env.production` -> `env.local` -> `.env.production.local`
- for `NODE_ENV=test`, `env.local` is ignored (only `.env.test.local` is loaded)

```bash
# naming: .env.something123.local, ends with local
.env*.local
```

### Yarn scripts

- use [dotenv-cli](https://github.com/entropitor/dotenv-cli) for .env.\* files
- both `yarn dev` and `yarn start` share same `.next` folder, so with dev you can run old prod build, delete it, for `prisma migrate dev` too
- actually **bash terminal window has old env variable**, open new terminal

### Update next to 12.1.6

- error:

```
warn  - You have to use React 18 to use `experimental.reactRoot`.
Error: `experimental.runtime` requires `experimental.reactRoot` to be enabled along with React 18.
    at Object.getBaseWebpackConfig [as default] (/home/username/Desktop/nextjs-prisma-boilerplate/node_modules/next/build/webpack-config.ts:355:11)
```

- **solution:** `process.env.__NEXT_REACT_ROOT = 'true';` in server.ts on top, [stackoverflow](https://stackoverflow.com/questions/72551352/error-experimental-runtime-requires-experimental-reactroot-to-be-enabled-al)
- in custom server only

### Remove process.env.NEXT_PUBLIC_BASE_URL from CustomHead, don't do this

- **this must use env var or SSR prop**, must be same on SSR and CSR, no Javascript

```ts
// const baseUrl = process.env.NEXT_PUBLIC_BASE_URL; // with '/'
// const trimmedBaseUrl = baseUrl.replace(/\/$/, ''); // without

// baseUrl https://localhost:3001
// 'false' or url, not good
const baseUrl = isBrowser() && window.location.origin; // without '/'
```

- axios baseUrl works default, but let it have absolute path

```ts
const axiosInstance = axios.create({
  // only if you need other than default
  // baseURL: process.env.NEXT_PUBLIC_BASE_URL,
});
```

### Next.js Image component

- custom loader (only for local images), for full urls just forward src and Image component works

```ts
export const uploadsImageLoader = ({ src, width, quality }: ImageLoaderProps) => {
  // src starts with '/'
  // use relative path for same domain
  // const _src = src.replace(/^\//, '');
  // return `${process.env.NEXT_PUBLIC_BASE_URL}${_src}?w=${width}&q=${quality || 75}`;
  // if its full url https://... just forward it
  return !isUrl(src) ? `${src}?w=${width}&q=${quality || 75}` : src;
};
```

- this will probably fail for google and facebook avatars...?

```ts
// google avatar works
https://lh3.googleusercontent.com/a/AATXAJxGLQSA1Qx-WpSBpKD3GxB9QoiEh=s96-c?w=256&q=75
```

#### Minimal Docker build, todo

- `.next/standalone`, [docs][https://nextjs.org/docs/advanced-features/output-file-tracing], [example](https://github.com/vercel/next.js/tree/canary/examples/with-docker-compose)
