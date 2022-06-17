### Github Actions - build Docker image

- Docker [docs](https://docs.docker.com/ci-cd/github-actions/)
- [tutorial](https://event-driven.io/en/how_to_buid_and_push_docker_image_with_github_actions/)
- example with [actions/cache@v2](https://evilmartians.com/chronicles/build-images-on-github-actions-with-docker-layer-caching)
- caching [examples](https://github.com/docker/build-push-action/blob/master/docs/advanced/cache.md)

- Postgres container can run inside Github Actions locally [tutorial](https://blog.ludicroushq.com/a-better-way-to-run-integration-tests-with-prisma-and-postgresql)
- maybe docker in docker...???

```yaml
name: main
on: [push]
jobs:
  test:
    runs-on: ubuntu-latest

    services:
      postgres:
        image: postgres
        env:
          POSTGRES_USER: root
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: example
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432

    steps:
      - uses: actions/checkout@v2
      - name: Use Node.js 14.x
        uses: actions/setup-node@v1
        with:
          node-version: '14.x'

      - run: npm ci

      - run: npm run ci:test
        env:
          DATABASE_URL: 'postgresql://root:postgres@localhost:5432/example'
```

### Github Actions - tests

- services: for database
- prisma mysql example [tutorial](https://zenn.dev/mano_r/articles/e9242cee1f4411)
- node caching [actions/setup-node](https://github.com/actions/setup-node/blob/main/docs/advanced-usage.md#caching-packages-data)
- prisma mongo [example](https://github.com/prisma/prisma-examples/blob/latest/.github/workflows/test-mongodb.yaml)
- prisma blog postgres [example](https://www.prisma.io/blog/backend-prisma-typescript-orm-with-postgresql-deployment-bbba1ps7kip5)
- general tests CI [example](https://blog.testproject.io/2021/02/01/using-github-actions-to-run-automated-tests/)
- Cypress real world app [repo](https://github.dev/cypress-io/cypress-realworld-app)

### Github Actions env vars and env files

- in GA NODE_ENV=test so prod app loads .env.test and all env vars already exist, maybe NODE_ENV=ci?
- jest loads .env.test too
- limit jobs timeout
- Cypress `"start:e2e": "NODE_ENV=test node dist/index.js"`... yarn script ci: maybe...
- better to use yaml file for env vars than .env files
- monorepo structure with packages and gitmodules

### NODE_ENV vs APP_ENV

- **point:** there is already existing convention for `NODE_ENV=dev | prod | test` that all npm libraries respect, it can't have custom value (will affect libs), **reserved already**
- custom value is same as undefined and same as development
- use `APP_ENV` for custom values that describe environment, e.g. local-prod, local-test, ci-test...

- simpler [tutorial](https://rafaelalmeidatk.com/blog/why-you-should-not-use-a-custom-value-with-node-env)
- another [tutorial](https://seanconnolly.dev/dont-be-fooled-by-node-env)
- good [tutorial](https://koistya.medium.com/demystifying-node-env-var-b25ed43c9af)

- CI-CD build job needs to set APP_VERSION var and tag
