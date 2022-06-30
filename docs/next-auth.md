### Initial Next-auth and Prisma setup

- prisma/prisma-examples [typescript/rest-nextjs-api-routes-auth](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes-auth)

### Credentials provider

- [docs](https://next-auth.js.org/providers/credentials)
- Prisma example [Todomir/next-prisma-auth-credentials](https://github.com/Todomir/next-prisma-auth-credentials)
- MongoDB [tutorial](https://dev.to/dawnind/authentication-with-credentials-using-next-auth-and-mongodb-part-1-m38)
- MongoDB code [DawnMD/next-auth-credentials](https://github.com/DawnMD/next-auth-credentials)

### Custom SignIn page

- [v4 docs](https://next-auth.js.org/configuration/pages)

### Create trusted certificate

- install and run mkcert (instruction at the bottom) with [local-ssl-proxy](https://github.com/cameronhunter/local-ssl-proxy/) - not this, abanodoned
- install mkcert [easy way](https://www.howtoforge.com/how-to-create-locally-trusted-ssl-certificates-with-mkcert-on-ubuntu/) - this
- to point Node.js to the root certificate add `NODE_EXTRA_CA_CERTS` var permanently in `~/.profile` and log out/log in

```
# add this in ~/.profile
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

- email must be different from Google auth - check db in callback
- Just set these two:

  - Basic settings -> Site URL

  ```
  https://localhost:3001/
  ```

  - Facebook login settings -> Valid OAuth Redirect URIs:

  ```
  https://localhost:3001/api/auth/callback/facebook
  ```

### NEXTAUTH_URL variable, once for all

- **build and start prod without NEXTAUTH_URL:**

```ts
// axios fails
http://localhost:3001/undefined/api/posts/?page=2

// avatars and headers fail with
undefined/uploads/headers/header0.jpg?w=3840&q=75

// login fails, redirects to http://localhost:3000/ fallback
```

- it has `http://localhost:3000/` default fallback (at runtime), and that's it

- **build without and start prod with NEXTAUTH_URL:**

```ts
// next-auth login works (its only runtime variable)

// axios fails in same way because it's inlined because of NEXT_PUBLIC_
NEXT_PUBLIC_BASE_URL: `${process.env.NEXTAUTH_URL}/`,

// MUST be set at runtime for OAuth redirect_urls to work
```

- **conclusion:** it's possible to omit it at build time by passing `BASE_URL` (without NEXT*PUBLIC*) to `publicRuntimeConfig: {}` in `next.config.js`, **but only SSR, not SSG**
- that's why official Next.js Docker example is without NEXTAUTH_URL
- next-auth can work because its SSR
- for SEO and SSG pages `<Head />` must provide it build time
- **MUST be set at runtime for OAuth redirect_urls to work**
- of course it must be same at build and runtime
- **important:** for live production behind Traefik proxy (Traefik handles https) app uses http node server `SITE_PROTOCOL=http`, but NEXTAUTH_URL must be set to real https url for OAuth redirect_urls to work `NEXTAUTH_URL=https://${SITE_HOSTNAME}`

- image loader can use relative path for image in same domain as app [docs](https://nextjs.org/docs/api-reference/next/image#src)

```bash
# http node server in live, Traefik handles https
SITE_PROTOCOL=http

# real url is https and doesn't have port, Traefik handles https and port
NEXTAUTH_URL=https://${SITE_HOSTNAME}
```

### Google and Facebook must not use same email, unhandled

- crashes prod server...

```
[next-auth][error][CALLBACK_OAUTH_ERROR] ,
[next-auth][error][OAUTH_CALLBACK_ERROR] ,
    stack: 'TypeError: no access token provided\n' +,
https://next-auth.js.org/errors#oauth_callback_error no access token provided {,
  error: {,
      '    at Client.requestResource (/app/node_modules/openid-client/lib/client.js:1134:13)\n' +,
    message: 'no access token provided',
```
