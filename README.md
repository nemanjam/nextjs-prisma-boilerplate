<p align="center"><img src="docs/readme-assets/banner-1280x640-200kb.png"></p>

# Next.js Prisma Boilerplate

[![tests](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/tests.yml/badge.svg)](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/tests.yml)
[![docker build](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/build-docker-image.yml/badge.svg)](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/build-docker-image.yml)
[![deploy](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/deploy.yml/badge.svg)](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/deploy.yml)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/nemanjamitic/nextjs-prisma-boilerplate/latest?logo=docker)
![GitHub](https://img.shields.io/github/license/nemanjam/nextjs-prisma-boilerplate)

This is full stack boilerplate built around latest Next.js stack. It is composed of the best practices described in official docs combined with my decisions derived from my own experience and knowledge that I have gathered from working with other people.

Don't spend next 3 months making architectural decisions, choosing libraries, setting up dev and prod environments and CI/CD pipelines, writing boilerplate code, _instead install this boilerplate in 15 minutes and start working on your features **today**._

## Demo

#### Live production demo:

- **[https://nextjs-prisma-boilerplate.localhost3000.live](https://nextjs-prisma-boilerplate.localhost3000.live/)**

#### Gitpod development playground:

> You need Gitpod account, and maybe Postgres database url if my demo database is vandalized. You can create one on [elephantsql.com](elephantsql.com), see [Gitpod Environment](#gitpod-environment) section for details.

- **[Gitpod Workspace Snapshot](https://gitpod.io#snapshot/e338d5fe-1233-48b6-aa92-59a899bc40f4)**

## Screenshots

https://user-images.githubusercontent.com/9990165/177367837-a2692e5d-b694-454e-806d-21e806465836.mp4

## How you can use this

- build your own projects on top of this (blog, social network, e-commerce, Saas...), suitable for any small to medium size web app that can run in a single Linux box, not every start up has billion users from first day
- if you want to go serverless route you can still reuse a lot of code and implementation decisions from this project, few notes: 1. you need to remove custom http server and let Next.js app run natively, 2. you can't run production app in a single Docker container, 3. you must use different Multer storage type for uploads
- reuse any specific design decision, feature or configuration (i.e. VS Code devcontainer can be reused for any Node.js project, theming plugin, email/password login with `next-auth`, etc...)
- use it for learning or as a collection of working examples for reference

## Features

#### Tech stack

React `18.2.0`, Next.js `12.2.0`, Node.js `16.13.1`, Prisma `4`, Postgres `14.3`, TypeScript `4.7.4`, React Query `4-beta`, Axios, React Hook Form `8-alpha`, React Dropzone, Zod, msw, TailwindCSS `3`, Jest `28`, Testing Library React, Cypress `9.6.1`.

#### Frontend:

- authentication with `next-auth` and Facebook, Google and Credentials providers
- uses all Next.js features - routing, SSR, SEO, Image component, error pages, `.env*` files...
- scalable and decoupled component structure `pages` -> `layouts` -> `views` -> `components`
- fully responsive design with TailwindCSS, SCSS and BEM (not a single `!important` statement in entire code)
- themes implemented as a custom Tailwind plugin
- fully configured TypeScript, ESLint and Prettier
- loading and error states handled with Suspense and ErrorBoundary
- forms with React Hook Form, Zod validation schemas and React Dropzone
- data fetching and server state with React Query and custom hooks

#### Backend:

- uses Next.js API with custom server and static folder for serving files at runtime
- Prisma ORM with Postgres database for managing data with Faker seed script
- Prisma schema with User and Post models and API with CRUD operations
- decoupled controller and service layers for clear reasoning and easy testing
- `next-connect` API handlers with middleware for validation and protected routes
- global error handling for both API and `getServerSideProps` with custom error class
- request objects validated with Zod schemas (reused on client)
- images upload with Multer

#### Testing:

- Jest and `testing-library/react` for unit and integration tests
- 3 separate Jest projects configurations - client, server unit and server integration
- unit tests for React components, hooks and React Query hooks, integration tests for views
- API responses for client tests mocked with Mock Service Worker handlers
- test wrappers with mocked QueryClient, router, session, auth user
- `jest-preview` visual debugging, images mocked with Blob polyfill, separate `.env.test*` files
- unit tests for API controllers with Supertest client and mocked services
- API services unit tests with mocked Prisma client singleton instance
- integration tests (controller + service) per API handler with Supertest client and test database
- code coverage for all Jest tests, statements 43%, branches 47%, functions 39%, lines 43%
- Cypress end-to-end tests with configured ESLint and Typescript
- Cypress task to seed and teardown test database, commands to filter errors, seed and login
- custom Docker image with Cypress installed on top of official base image
- both Jest and Cypress are configured to run locally, in Docker and in Github Actions

#### Development environment:

- 3 available configured development environments: local, Docker (VS Code devcontainers) and Gitpod
- included VS Code settings and extensions for syntax highlighting, intellisense, formatting, linting and running tests
- configured development database with Postgres and Adminer Docker containers

#### Production environment:

- two staging environments (local and Docker) for testing app built in production mode
- one live production environment with Docker and Traefik reverse proxy in separate repository [nemanjam/traefik-proxy](https://github.com/nemanjam/traefik-proxy) for deployment on VPS

#### CI/CD:

- 3 Github Actions automated workflows for running tests, building and pushing app production Docker image to Dockerhub and deployment on VPS using ssh

#### Documentation:

- docs folder with documented working notes, problems, solutions and included reference links for every technology used in this project
- it is meant to be turned into human friendly blog articles (this is still work in progress)

#### Core principles:

- take full advantage of Docker containers for development, testing and production
- choose simple, practical and clean solutions
- vendor free - don't couple app architecture with any cloud provider and keep everything under your control
- document everything, especially important and difficult parts

#### Motivation:

There are a lot of talk, theory, opinions, and buzz around JavaScript frameworks... but lets stop talking and actually try it out in practice, check how it works and see if we can build something useful and meaningful with it.

## Development environment

This project has 3 available development environments:

1. local
2. Docker (with and without devcontainers)
3. Gitpod

You can pick whatever environment you prefer.

> **Which one to choose?** If you like conventional approach pick local, if you work in a team and want to have consistent environments with colleagues to easily reproduce bugs and quickly onboard new members pick Docker, and if you want to make sandbox do reproduce a bug and ask for help publicly pick Gitpod.

#### 1. local environment

Clone repository and install dependencies.

```bash
# clone repository
git clone git@github.com:nemanjam/nextjs-prisma-boilerplate.git
cd nextjs-prisma-boilerplate

# install dependencies
yarn install
```

> When you open project folder for the first time VS Code will ask you to install recommended extensions, you should accept them all, they are needed to highlight, autocomplete, lint and format code, run tests, manage containers.

Fill in required **public** environment variables in `.env.development`. Fastest way is to run the app with `http` server.

> You need `https` locally only for Facebook OAuth login. For that you need `mkcert` to install certificates for `localhost`, instructions for that you can find in `docs` folder.

Leave `PORT` as 3001, it is hardcoded in multiple places, if you want to change it you must edit all of them (i.e. all `Dockerfile.*` and `docker-compose.*.yml`)

```bash
# .env.development

SITE_PROTOCOL=http
SITE_HOSTNAME=localhost
PORT=3001

# don't touch these two variables
APP_ENV=local
NEXTAUTH_URL=${SITE_PROTOCOL}://${SITE_HOSTNAME}:${PORT}
```

Create `.env.development.local` file.

```bash
# create local file form example file
cp .env.development.local.example .env.development.local

```

In all environments Postgres container is configured to run as a current non-root user on a Linux host machine. This is important so that database files in volumes are created with correct ownership and permissions. For this you need to define `MY_UID` and `MY_GID`. Best place to set them is in `~/.bashrc`.

```bash
# ~/.bashrc
export MY_UID=$(id -u)
export MY_GID=$(id -g)
```

Fill in required **private** environment variables. The only required variables are for Postgres database connection and JWT secret.

> Facebook and Google credentials are optional and used only for OAuth login. Facebook login requires `https` for redirect url. You can set any values for `POSTGRES_USER`, `POSTGRES_PASSWORD` and `POSTGRES_DB`.

```bash
# .env.development.local

# set database connection
POSTGRES_HOSTNAME=localhost
POSTGRES_PORT=5432
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=password
POSTGRES_DB=npb-db-dev

# don't edit this expanded variable
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public

# jwt secret
SECRET=some-long-random-string

# OAuth logins (optional)
# Facebook (you need https for this)
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

After all variables are set you can run Postgres database inside the Docker container, run Prisma migrations that will create SQL tables from `schema.prisma` and seed database with data.

```bash
# run database container
yarn docker:db:dev:up

# run Prisma migrations (this will create sql tables, database must be running)
yarn prisma:migrate:dev:env

# seed database with data
yarn prisma:seed:dev:env
```

At this point everything is ready, you can now start the app. Open `http://localhost:3001` in the browser to see the running app.

```bash
# start the app in dev mode
yarn dev
```

#### Docker environment

After you cloned repository build app container.

```bash
# terminal on host
yarn docker:dev:build
```

Docker environment will read variables from `envs/development-docker` folder. Create local env file from example file. It has all variables configured already.

```bash
# terminal on host
cp envs/development-docker/.env.development.docker.local.example envs/development-docker/.env.development.docker.local
```

Run the app, database and Adminer containers. That's it. Project folder is mounted to `/app` folder inside container, you can either edit source directly on host or open Remote containers extension tab and right click `npb-app-dev` and select `Attach to Container` and open `/app` folder in remote VS Code instance. Open `http://localhost:3001` in the browser on host to see the running app.

```bash
# terminal on host
yarn docker:dev:up
```

Open new terminal inside the container and seed the database, `docker-compose.dev.yml` already passes correct env files.

```bash
# terminal inside the container
yarn prisma:seed
```

> Note: Git will already exist in container with your account so you can commit and push changes directly from container.

```bash
# check that git config is already set inside the container
git config --list --show-origin
```

> I suggest you install [Portainer Community Edition](https://www.portainer.io/pricing-new) container locally for easier managing and debugging containers, it's free and very useful tool.

#### Gitpod environment

Go to [elephantsql.com](https://elephantsql.com) create free account and create free 20MB Postgres database. Go to [gitpod.io](https://gitpod.io/), login with Github. Open your forked repository in Gitpod by opening following link (replace `your-username` with real one):

```
https://gitpod.io/#https://github.com/your-username/nextjs-prisma-boilerplate
```

Gitpod environment will read variables from `envs/development-gitpod` folder. Create local env file from example file.

```bash
# terminal on Gitpod
cp envs/development-gitpod/.env.development.gitpod.local.example envs/development-gitpod/.env.development.gitpod.local
```

In that local file set the database url from `elephantsql.com`. Other variables are set automatically.

```bash
# envs/development-gitpod/.env.development.gitpod.local
DATABASE_URL=postgres://something:something@tyke.db.elephantsql.com/something
```

Now migrate and seed the database.

> Note: `elephantsql.com` database doesn't have all privileges so you must use `prisma push` command instead of usual `prisma migrate dev`. Read more details about shadow database in [docs/demo-environments.md](docs/demo-environments.md).

```bash
# terminal on Gitpod

# migrate db
yarn gitpod:push:env

# seed db
yarn gitpod:seed:env
```

Everything is set up, you can now run the app in dev mode and open it in new browser tab.

```bash
yarn gitpod:dev:env
```

## Running tests

This project has 4 separate testing configurations plus code coverage configuration. All tests can run locally, in Docker and in Github Actions.

1. Client unit and integration tests - Jest and React Testing Library
2. Server unit tests - Jest
3. Server integration tests - Jest and test database
4. Code coverage report - all Jest tests and test database
5. E2E tests - Cypress, app running in production mode and test database

> Note: You can also run and debug all Jest tests with `orta.vscode-jest` extension that is already included in recommended list.

#### 1. Running client unit and integration tests

Running locally.

```bash
yarn test:client
```

Running in Docker.

```bash
yarn docker:test:client
```

#### 2. Running server unit tests

Running locally.

```bash
yarn test:server:unit
```

Running in Docker.

```bash
yarn docker:test:server:unit
```

#### 3. Running server integration tests

Make sure that test database is up and migrated. You don't need to seed it.

```bash
# run database container
yarn docker:db:test:up

# migrate test database
yarn prisma:migrate:test:env
```

Running locally.

```bash
yarn test:server:integration
```

Running in Docker.

```bash
yarn docker:test:server:integration
```

#### 4. Running code coverage report

You need running test database, same as in previous step.

Running locally.

```bash
yarn test:coverage
```

Running in Docker.

```bash
yarn docker:test:coverage
```

#### 5. Running E2E tests with Cypress

**Running locally:**

You need to run and migrate test database (no need for seed), build app for production, run the app and run Cypress.

```bash
# run database container
yarn docker:db:test:up

# migrate test database
yarn prisma:migrate:test:env
```

Then you need to build app for production.

```bash
# build the app for prod
yarn build
```

Then you need to start both app and Cypress at same time. This will open Cypress GUI.

```bash
# starts the app and Cypress GUI
yarn test:e2e:env
```

You can also run Cypress in headless mode (without GUI).

```bash
# starts the app and Cypress in headless mode
yarn test:e2e:headless:env
```

**Running in Docker:**

Build both app and Cypress images.

```bash
# build testing app image
yarn docker:npb-app-test:build

# build Cypress container
yarn docker:npb-e2e:build
```

Then you can run test database, test app container and Cypress (in headless mode) container at once.

```bash
# run db, app and Cypress headless
yarn docker:npb-e2e:up
```

## Deployment to production

I made a separate repository [nemanjam/traefik-proxy](https://github.com/nemanjam/traefik-proxy) only for deployment with Traefik reverse proxy that needs only environment variables and image from Dockerhub. There are also Github Actions workflows to build, push and redeploy latest image on your server. You should use that for deployment.

For the sake of completeness I described here how to build and run production app locally and in Docker. These two can be useful as staging environments for testing. I also described how to build and push live image to Dockerhub from your local development machine.

#### Build and run production app locally

When building and running app in production mode it will read variables from `.env.production` and `.env.production.local`. At build time the only required variable is `NEXTAUTH_URL` (it is used for base url in `CustomHead` component responsible for SEO). If you use `getStaticProps` (Static Site Generation) you will need to pass `DATABASE_URL` too with correct data. At runtime you need to define all public and private variables in these two files.

To build and run production app run these two commands.

```bash
# build app
yarn build

# start app
yarn start
```

#### Build and run production app in Docker

When building production app inside a Docker image again you need to pass same variables like locally (`NEXTAUTH_URL` and `DATABASE_URL` for SSG), this time these are forwarded with `ARG_NEXTAUTH_URL` and `ARG_DATABASE_URL` in `Dockerfile.prod`. This time environment variables are read from `envs/production-docker/.env.production.docker` and `envs/production-docker/.env.production.docker.local`. At runtime you need to define all public and private variables in these two files.

To build and run Docker production image run this.

```bash
# build production image
yarn docker:prod:build:env

# run production image
yarn docker:prod:up
```

#### Build and push Docker live production image locally

Again you need to set `NEXTAUTH_URL` and `DATABASE_URL` (for SSG) this time in `envs/production-live/.env.production.live.build.local`. Create this file from example file.

```bash
cp envs/production-live/.env.production.live.build.local.example envs/production-live/.env.production.live.build.local
```

You need to edit this yarn script and set your real Dockerhub username and image name.

```bash
# replace your-dockerhub-username and your-image-name with yours

"docker:live:build": "dotenv -e ./envs/production-live/.env.production.live.build.local -- bash -c 'docker build -f Dockerfile.prod -t your-dockerhub-username/your-image-name:latest --build-arg ARG_DATABASE_URL=${DATABASE_URL} --build-arg ARG_NEXTAUTH_URL=${NEXTAUTH_URL} .'",

```

You can now build, tag and push to Dockerhub your production image. To push image you must first login in terminal with `docker login`.

```bash
# build and tag production image
yarn docker:live:build

# push image to Dockerhub
yarn docker:live:push
```

#### Build and push Docker live production image in Github Actions (preferred)

There is already set up workflow to build and push production image in Github Actions in `.github/workflows/build-docker-image.yml`. In your repository settings you just need to set these variables and run workflow.

```bash
# your dockerhub username
DOCKERHUB_USERNAME
# your dockerhub password
DOCKERHUB_TOKEN
# database url (only for SSG)
NPB_DATABASE_URL
# your live production app url (without trailing '/')
# i.e. https://subdomain.my-domain.com
NPB_NEXTAUTH_URL
```

#### Run live production app on VPS with Traefik

You just need to set your image name inside `docker-compose.live.yml`, pass all environment variables to it and deploy it with `docker-compose up -d` on your server.

```yml
# docker-compose.live.yml

services:
  npb-app-live:
    container_name: npb-app-live
    image: your-dockerhub-username/your-image-name:latest
```

For this purpose I already made separate repository [nemanjam/traefik-proxy](https://github.com/nemanjam/traefik-proxy) with Traefik reverse proxy that allows you to host multiple apps inside Docker containers where each container expose different port and Traefik maps ports to subdomains. For details how to configure this see `README.md` file and linked tutorial in it. You just need to run your app container and Traefik will automatically pick it up without you needing to restart Traefik's container manually.

Beside Traefik it also already has `portainer` container for managing containers, `adminer` container for administering production database, `uptime-kuma` for tracking website uptime, and another `postgres` container configured to accept connections from remote hosts (useful for building app in Github Actions).

Bellow are listed all environments variables you need to set. For sake of simplicity I showed you here how to set them in local `.env` file, `docker-compose.yml` file will read it and forward all needed variables into containers. This is ok for demo apps but for real production apps proper way to do this is to set them in your cloud provider's dashboard or use some dedicated vault.

```bash
# create .env file locally and set vars
cp apps/nextjs-prisma-boilerplate/.env.example apps/nextjs-prisma-boilerplate/.env

# copy populated local .env file to server securely with ssh
scp ./apps/nextjs-prisma-boilerplate/.env ubuntu@your-server:~/traefik-proxy/apps/nextjs-prisma-boilerplate
```

These are all needed variables.

> `MY_UID` and `MY_GID` are id's of your current user and group on your Linux server. You can see their values by running `id -u` and `id -g` in your server's terminal. The best place to set them is globally in `~/.bashrc` because they can be needed for multiple containers. They are passed into Postgres container so that volume data files are created with correct permissions and ownership (as current user and not root user).

```bash
# apps/nextjs-prisma-boilerplate/.env

# public vars bellow

APP_ENV=live

# http node server in live, Traefik handles https
SITE_PROTOCOL=http

# real full production public domain (with subdomain), used in app and Traefik
SITE_HOSTNAME=nextjs-prisma-boilerplate.localhost3000.live
PORT=3001

# real url is https and doesn't have port, Traefik handles https and port
NEXTAUTH_URL=https://${SITE_HOSTNAME}

# private vars bellow

# db container
POSTGRES_HOSTNAME=npb-db-live
POSTGRES_PORT=5432
POSTGRES_USER=postgres_user
POSTGRES_PASSWORD=
POSTGRES_DB=npb-db-live

# don't edit this
DATABASE_URL=postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${POSTGRES_HOSTNAME}:${POSTGRES_PORT}/${POSTGRES_DB}?schema=public

# current host user as non-root user in Postgres container, set it here
MY_UID=1001
MY_GID=1001

# or better globally in ~/.bashrc
# export MY_UID=$(id -u)
# export MY_GID=$(id -g)

# jwt secret
SECRET=some-long-random-string

# Facebook
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Google
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
```

#### Redeploy latest Docker live production image on VPS

To avoid manual work there is already Github Actions workflow in `.github/workflows/deploy.yml` that will remove old image and pull and run latest image from Dockerhub using ssh action. All you need to do is to trigger it either manually or chain it on existing build and push workflow.

```yml
# .github/workflows/deploy.yml

# trigger redeploy with build workflow
on:
  workflow_run:
    workflows: ['docker build']
```

## Related projects

- [nemanjam/traefik-proxy](https://github.com/nemanjam/traefik-proxy) - repository for deployment on VPS
- [nemanjam/hydration-test-case](https://github.com/nemanjam/hydration-test-case) - repository to isolate and debug hydration errors

## Roadmap

- add backend support for Next.js `Image` component for locally hosted images
- improve docs
- try to reduce Docker image size with `output: 'standalone'` build option in `next.config.js`
- try to remove `prisma` from prod dependencies with separate container for migrations without making workflow too complicated
- update to `cypress: 10.x` and `next-connect: 1.x` (they have breaking changes)
- handle multiple TypeScript build contexts (Next.js app, custom server, seed script) in better way
- add a feature for client side state and implement it with Redux Toolkit (maybe)

## References

Complete references links are attached in docs files. Most important references are:

- starting template project [tutorial](https://vercel.com/guides/nextjs-prisma-postgres), [prisma/blogr-nextjs-prisma/tree/final](https://github.com/prisma/blogr-nextjs-prisma/tree/final), [prisma-examples/typescript/rest-nextjs-api-routes-auth/](https://github.com/prisma/prisma-examples/tree/latest/typescript/rest-nextjs-api-routes-auth)
- API handlers with `next-connect`, example app [hoangvvo/nextjs-mongodb-app](https://github.com/hoangvvo/nextjs-mongodb-app)
- Vercel examples (custom-server-typescript, with-typescript-eslint-jest, with-docker, with-cypress) [vercel/next.js/tree/canary/examples](https://github.com/vercel/next.js/tree/canary/examples/custom-server-typescript)
- Next.js docs [nextjs.org/docs](https://nextjs.org/docs)
- SEO setup [leerob/leerob.io](https://github.com/leerob/leerob.io)
- Express error handling [jonasschmedtmann/complete-node-bootcamp](https://github.com/jonasschmedtmann/complete-node-bootcamp)
- Jest setup, React Query hooks [alan2207/bulletproof-react](https://github.com/alan2207/bulletproof-react)
- themes as Tailwind plugin [saadeghi/daisyui](https://github.com/saadeghi/daisyui)
- testing React Query [Tkdodo blog](https://tkdodo.eu/blog/testing-react-query), [TkDodo/testing-react-query](https://github.com/TkDodo/testing-react-query)
- Tailwind configuration [tailwindcss.com/docs](https://tailwindcss.com/docs/guides/nextjs)
- deployment with Traefik [tutorial](https://rafrasenberg.hashnode.dev/docker-container-management-with-traefik-v2-and-portainer), [rafrasenberg/docker-traefik-portainer](https://github.com/rafrasenberg/docker-traefik-portainer)
- Next.js testing frontend (ts-jest setup, msw, forms, router) Bruno Antunes YouTube [playlist](https://www.youtube.com/playlist?list=PLYSZyzpwBEWTBdbfStjqJSGaulqcHoNkT)
- Prisma docs, testing backend services, [unit-testing](https://www.prisma.io/docs/guides/testing/unit-testing), [integration-testing](https://www.prisma.io/docs/guides/testing/integration-testing)
- React Hook Form, React Dropzone integration [example](https://github.com/react-hook-form/react-hook-form/discussions/2146#discussioncomment-579355)
- Cypress Docker setup [cypress-io/cypress-example-docker-compose](https://github.com/cypress-io/cypress-example-docker-compose)

## License

This project uses MIT license: [License](LICENSE)
