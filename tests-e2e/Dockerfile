# this Dockerfile is needed because of @testing-library/cypress
# import in tests-e2e/cypress/support/commands.js

# 2x smaller size than 16.3 which is in project
FROM cypress/base:16.14.2

WORKDIR /app

# dependencies will be installed only if the package files change
COPY package.json yarn.lock ./


# by setting CI environment variable we switch the Cypress install messages
# to small "started / finished" and avoid 1000s of lines of progress messages
# https://github.com/cypress-io/cypress/issues/1243
ENV CI=1
RUN yarn install --frozen-lockfile

# verify that Cypress has been installed correctly.
# running this command separately from "cypress run" will also cache its result
# to avoid verifying again when running the tests
RUN npx cypress verify
