# Nextjs Prisma Boilerplate

## References

### Initial Next-auth and Prisma setup

- prisma/prisma-examples [typescript/rest-nextjs-api-routes-auth](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes-auth)

### Https proxy for Facebook auth

- Github [issue](https://github.com/vercel/next.js/discussions/10935)
- package [local-ssl-proxy](https://www.npmjs.com/package/local-ssl-proxy)

### ESlint and Prettier configuration

- official Vercel example [with-typescript-eslint-jest](https://github.com/vercel/next.js/tree/canary/examples/with-typescript-eslint-jest)

- useful [tutorial](https://paulintrognon.fr/blog/typescript-prettier-eslint-next-js)

### Credentials provider

- [docs](https://next-auth.js.org/providers/credentials)
- Prisma example [Todomir/next-prisma-auth-credentials](https://github.com/Todomir/next-prisma-auth-credentials)
- MongoDB [tutorial](https://dev.to/dawnind/authentication-with-credentials-using-next-auth-and-mongodb-part-1-m38)
- MongoDB code [DawnMD/next-auth-credentials](https://github.com/DawnMD/next-auth-credentials)

### Custom SignIn page

- [v4 docs](https://next-auth.js.org/configuration/pages)

### Google auth

Redirect URI

```
https://localhost:3001/api/auth/callback/google
```
