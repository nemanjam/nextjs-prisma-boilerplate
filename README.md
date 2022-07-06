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
- global error handlers for both API and `getServerSideProps`
- request body, query and params validated with Zod schemas (reused on client)
- private API routes protected with auth and admin middleware
- upload images with Multer
- API with CRUD operations on User and Post models
