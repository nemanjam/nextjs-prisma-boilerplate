<p align="center"><img src="docs/readme-assets/banner-1280x640-200kb.png"></p>

# Next.js Prisma Boilerplate

[![tests](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/tests.yml/badge.svg)](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/tests.yml)
[![docker build](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/build-docker-image.yml/badge.svg)](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/build-docker-image.yml)
[![deploy](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/deploy.yml/badge.svg)](https://github.com/nemanjam/nextjs-prisma-boilerplate/actions/workflows/deploy.yml)
![Docker Image Size (tag)](https://img.shields.io/docker/image-size/nemanjamitic/nextjs-prisma-boilerplate/latest?logo=docker)
![GitHub](https://img.shields.io/github/license/nemanjam/nextjs-prisma-boilerplate)

This is full stack boilerplate built around latest Next.js stack. It is composed of the best practices described in official docs combined with my decisions derived from my own experience and knowledge that I have gathered from working with other people.

Don't spend next 3 months making architectural decisions, choosing libraries, setting up development environment and CI/CD pipelines, writing boilerplate code, _instead install this boilerplate in 15 minutes and start working on your features **today**._

## Screenshots

https://user-images.githubusercontent.com/9990165/177367837-a2692e5d-b694-454e-806d-21e806465836.mp4

## Features

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
- separate Jest projects for client, server unit and server integration tests
- code coverage for all Jest tests, statements 43%, branches 47%, functions 39%, lines 43%
- Cypress end-to-end tests with configured ESLint and Typescript
- example tests for Home, navigation, edit user and post and register new user
- Cypress task to seed and teardown test database, commands to filter errors, seed and login
- custom Docker image with Cypress installed on top of official base image
- both Jest and Cypress are configured to run locally, in Docker and in Github Actions
