# Nextjs Prisma Boilerplate

## References

### Initial Next-auth and Prisma setup

- prisma/prisma-examples [typescript/rest-nextjs-api-routes-auth](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes-auth)

### Https proxy for Facebook auth

- used custom server
- Github [issue](https://github.com/vercel/next.js/discussions/10935)
- package [local-ssl-proxy](https://www.npmjs.com/package/local-ssl-proxy) - **removed**

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

### Create trusted certificate

- install and run mkcert (instruction at the bottom) with [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy/)
- install mkcert [easy way](https://www.howtoforge.com/how-to-create-locally-trusted-ssl-certificates-with-mkcert-on-ubuntu/)
- to point Node.js to the root certificate add `NODE_EXTRA_CA_CERTS` var permanently in `~/.profile` and log out/log in

```
export NODE_EXTRA_CA_CERTS="$(mkcert -CAROOT)/rootCA.pem"
```

- test with:

```
echo $NODE_EXTRA_CA_CERTS
```

- You should see this in the browser:
  ![certificate](/notes/certificate.png)

### Google auth

- Redirect URI

```
https://localhost:3001/api/auth/callback/google
```

### Facebook auth

- email must be different from Google auth\* - check db in callback
- Just set these two:

  - Basic settings -> Site URL

  ```
  https://localhost:3001/
  ```

  - Facebook login settings -> Valid OAuth Redirect URIs:

  ```
  https://localhost:3001/api/auth/callback/facebook
  ```

### Upload avatar

- [tutorial](https://betterprogramming.pub/upload-files-to-next-js-with-api-routes-839ce9f28430)

### Custom Https Express Typescript server

- to use uploads folder at runtime
- Next.js example (typescript, http) [custom-server-typescript](https://github.com/vercel/next.js/tree/canary/examples/custom-server-typescript)
- Stackoverflow (https, express, js) [example](https://stackoverflow.com/questions/55304101/https-on-localhost-using-nextjs-express)

### Api Error handling

...

### next-connect

...

### Validation

...

### Prisma db reset, migrate, seed

Reset (doesnt work):

```
npx prisma migrate reset --skip-seed

```

Migrate:

```
npx prisma migrate dev --skip-seed

```

Seed:

```
npx prisma db seed

```

### Todo

- admin role - done, maybe type admin | user in prisma
- middleware folder, withProtect, withRoles - done
- disable prisma seed before migrate - done
- error handling, next-connect - almost done
- rethink routes, extract - done

---

- extract styles, tailwind, next examples
- migrate to axios, fetch has no progress
- validation server, client, example [with-joi](https://github.com/vercel/next.js/tree/canary/examples/with-joi), [next-joi](https://github.com/codecoolture/next-joi)
- logging
- tests, next examples
- update next and everything else
- docker
- ci cd, deploy
- readme
- dev, prod remove express https
- add types file
- sqlite to postgres
- tailwind and root font-size 10px 1rem, global and component styles
- Header component
