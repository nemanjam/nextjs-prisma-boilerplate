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
