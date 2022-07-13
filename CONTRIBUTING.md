# Contributing guide

Thank you for taking interest in improving Next.js Prisma Boilerplate. Here is the brief overview to get you started quickly.

## Report a bug or suggest a new feature

- open a new issue, pick correct template (bug or feature) and fill it in appropriately

## Unwanted features

- please note this is meant to be template project so we want to avoid adding too specific features that would reduce it's reusability and make people invest work to remove them, for example adding new database models, too specific styling, adding packages without consensus
- good place for such features are forks and real specific projects

## Fix a bug or implement a new feature

- check existing [Issues tab](issues) and [Roadmap](README.md#roadmap) and see if you can pick some of them
- all pull requests must be associated with issue number(s)
- pick existing issue you want to work on and communicate in a comment that you will work on it and provide concise explanation how you plan to implement it so I can provide feedback
- if there isn't existing issue about that topic open a new issue

## Work on documentation

- existing documentation is pretty bare and contains mostly definitions for a problem, solution and linked reference, it needs to be turned into human friendly articles with more context, it's a good opportunity to do that while you test out related implementations

## Development environment

- please use Node.js `v16.x` and `yarn` package manager
- instructions how to setup development environment you can find in [Development environment](README.md#development-environment) section

## Before you open a pull request

- make sure to include issue number(s) in the pull request title
- if it's a work on a bug or feature make sure to cover it with a test
- if your change uses code from other people please update documentation with a link from the tutorial or github repo so we can use it for a reference and give credit
- use concise and descriptive commit messages to describe the changes

- when you finish implementation make sure that:
  - app compiles in both dev and prod mode
  - there aren't new typing and linting errors
  - code is formatted using existing prettier configuration
  - existing Jest (unit and integration) and Cypress e2e tests pass, more info: [Running tests](README.md#running-tests)
  - there are no new errors in browser console and Node.js terminal

```bash
# build dev mode
yarn dev

# build prod mode
yarn build

# check types
yarn types

# check linting
yarn lint

# format code with Prettier
yarn format

# run client unit and integration tests with Jest
yarn test:client

# run server unit tests with Jest
yarn test:server:unit

# run server integration tests with Jest
yarn test:server:integration

# run e2e tests with Cypress
yarn test:e2e:headless:env
```
