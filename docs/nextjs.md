### next-connect

- next-connect [example](https://github.com/hoangvvo/nextjs-mongodb-app)
- youtube [tutorial](https://www.youtube.com/watch?v=TvCu_oK083U)
- youtube [code](https://github.dev/bmvantunes/youtube-2020-july-next-api-routes-next-connect)
- types for req, res: [Github Readme](https://github.com/hoangvvo/next-connect#typescript)

```ts
// this wil type all handler.get() .post() .use() ...
const handler = nc<NextApiRequest, NextApiResponse>();

// each .post() individualy
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

- use `// use await queryClient.refetchQueries([QueryKeys.ME])` to refetch me after login, no need to pass refetch to context
