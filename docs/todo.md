# Todo

## Todo

- logging
- tests, next examples
- ci cd, deploy
- readme
- tailwind and root font-size 10px 1rem, global and component styles
- Header component
- react query, redux toolkit, redux toolkit query
- redux toolkit vercel example
- update readme before forget...
- refetch session after user is edited
- try catch to prisma calls getServerSideProps...
- soft delete for reseed, or logger
- semantic html
- Next.js Image config
- post - hero image, tag, category
- comments model
- drafts count in session or user state
- protected routes and 404 pages
- typescript silent errors...
- on change tw-base.scss must restart, no intelisense for my utilities
- docker express maybe, github actions, remote containers
- where to place and call printLoadedEnvVariables() ?
- add prisma migration container, move prisma to devDependencies
- next.js multiple build contexts, next.js app, server.ts and seed.js
- heroku docker
- update traefik-proxy readme
- type all request and response objects
- group pagination items function
- request, response types
- me query, only userId and email in session
- throw 404 from zod api...
- error path, db function, getServerSideProps, api endpoint, ask reddit, github
- handle errors in getServerSideProps
- edit user, delete user - admin
- validate ids in api zod
- replace session.user on server
- leave just id and email in session.user, and type
- test `await queryClient.prefetchQuery([QueryKeys.POSTS_PROFILE, profile.username, 1]...`
- redirect on protected pages, logged in and admin cases
- reusable guard or HOC for protected routes, getServerSideProps too
- where to go next doc: markdown editor with image inline and upload, comments, likes, follow, tags, categories
- publish/unpublish checkbox in update, no
- absolute positioning or negative margin, css reddit question
- clear types in a single place, form, request, response
- \_document.tsx
- search and pagination responsive css
- maybe arrays in navbar for mobile
- tests
- drafts count in me
- all in daisy ui
- alert component
- @tailwindcss/line-clamp plugin to limmit posts length
- declerative navbar lesson
- reseed app button in footer
- white border on pagination transparent button css bug
- custom font maybe
- footer styling
- more color themes and navbar gradient
- 404 and 500 pages
- login neutral button color, dark theme
- 2x1px border navbar calculation

```
react query home page refresh, maybe just .next folder...
Warning: Prop `disabled` did not match. Server: "null" Client: "true"
button
Button@webpack-internal:///./components/Button/Button.tsx:26:18
li
ul
nav
Pagination@webpack-internal:///./components/Pagination/Pagination.tsx:18:25
div
div
Home@webpack-internal:///./views/Home/Home.tsx:40:66
```

## Done

- admin role - done, maybe type admin | user in prisma
- middleware folder, withProtect, withRoles - done
- disable prisma seed before migrate - done
- error handling, next-connect - almost done
- rethink routes, extract - done
- fix User type - done
- migrate to axios, fetch has no progress, done
- add types file, mostly done
- fix routing from Post, done
- vs code recommended extensions, done
- install icons, done
- navbar, done
  - responsive, hamburger
  - avatar dropdown
- update next and everything else, done
- faker content, reseed, clean files, done
- settings form header dropzone, repeat password, done
- style forms, hero img upload, done
- icons in navbar items, done
- global styles button, links..., done
- footer, done
- problem: seed is buggy? solution: prisma 3 has bug with Promise.all([...]), use await, await, await..., done
- traefik container reverse proxy, done
- fix remaining forms, done
- sqlite to postgres, done
- dev, prod remove express https, done
- docker, done
- validation server, client, example [with-joi](https://github.com/vercel/next.js/tree/canary/examples/with-joi), [next-joi](https://github.com/codecoolture/next-joi), done with zod
- extract styles, tailwind, next examples, done
- query key in getServerSidePropa and useQuery and type it, done
- mutations, done
- progressbar tailwind div, done
- edit post, done
- create docs folder with mds, done
- fix theme reset on mobile menu, done
- route guards - redirect from getServerSideProps, done
- search fetching... indicator, done
- link to home on login page, done
- router.back() on cancel, done, styling href link,active...
- outside click close mobile menu, done
- mobile text wrap user, username, time, fix with flexbox, done
- responsive pagination and search, done
- dark theme, red, green, theme colors, daisy ui, done
- fix tailwind utility classes error, done
- users page, pagination, api filtering, done
- pagination with prisma and react query, done
- add search posts field, done
- full text search posts, done
