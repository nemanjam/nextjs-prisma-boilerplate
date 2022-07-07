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
- decoupled routing and display logic with separate `pages` and `views` folders
- reusable per-page layouts
- styling with TailwindCSS and SCSS in separate `.scss` files so JSX is nice and clean
- classes named following BEM convention
- fully responsive design on mobile
- naturally handled specificity, not a single `!important` statement in entire code
- support for themes, implemented as Tailwind plugin
- current theme is persisted in local storage using `next-themes`
- Typescript with enabled `strict` and `strictNullChecks` options
- all Request/Response models types defined in a single place and reused in both client and API
- all routes and redirects defined in a single place as constants
- error handling for queries done with ErrorBoundary
- loading state done with Suspense
- authenticated user passed from root via context and available synchronously
- images loaded using Next.js Image component with custom loader
- data fetching and server state implemented with React Query and custom hooks
- initial query data passed from `getServerSideProps` using Hydrate provider
- paginated queries for both posts and users
- custom error pages (404 and 500)
- basic SEO setup using custom `Head` component
- forms done with React Hook Form
- validation with Zod schemas reused on both client and server
- image uploads with React Dropzone

#### Backend:

- custom server with both `http` and `https` servers and static folder for serving files at runtime
- Prisma ORM with Postgres database for managing data
- seed script used for development, integration and e2e testing
- Prisma exclude utilities for omitting private fields from API responses
- Prisma schema with User and Post models
- decoupled controller and service layers for clear reasoning and easy testing
- `next-connect` API handlers with clean middleware syntax
- global error handlers for both API and `getServerSideProps` with custom error class
- request body, query and params validated with Zod schemas (reused on client)
- private API routes protected with auth and admin middleware
- upload images with Multer
- API with CRUD operations on User and Post models
- full Postgres text search for getUsers and getPosts services

<!-- lighthouse score screenshot -->

#### Testing:

- Jest and `testing-library/react` for unit and integration tests
- React unit tests for components and hooks
- React integration tests for views
- unit tests for React Query hooks
- API responses for client tests mocked with Mock Service Worker handlers
- test wrappers for components and hooks for mocking auth user, session, router providers
- new QueryClient instance per each test to ensure isolated tests with React Query
- Blob polyfill for mocking images in client tests
- load test environment variables in Jest from `.env.test*` files
- `jest-preview` configured for visual debugging client tests
- unit tests for API controllers with supertest client and mocked services
- API services unit tests with mocked Prisma client singleton instance
- integration tests (controller + service) per API handler with supertest client and test database
- separate Jest projects for client, server unit and server integration tests
- all tests are configured to be executed locally, in Docker and in Github Actions
- code coverage configuration that includes all Jest tests
- code coverage currently: statements 43%, branches 47%, functions 39%, lines 43%
- main goal was to have configuration and example for every **kind** of test (client, server, unit, integration, components, hooks, controllers, services)
- Cypress end-to-end tests with configured ESLint and Typescript
- example e2e tests for Home page, main navigation, edit user and post and register new user
- `testing-library/cypress` is used for querying elements in Cypress tests
- Cypress task to seed and teardown test database
- Cypress commands to filter errors, seed and login as admin
- custom Docker image with Cypress installed on top of official base image
- `docker-compose.e2e.yml` with production built app, configured test database and Cypress containers with `.env.test*` files
- Cypress is configured to run locally, in Docker and in Github Actions
