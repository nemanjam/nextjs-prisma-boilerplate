# Prisma

### Prisma db reset, migrate, seed

Reset (doesnt work):

```
npx prisma migrate reset --skip-seed

```

Migrate:

```
npx prisma migrate dev --skip-seed

```

Seed:

```
npx prisma db seed

```

Dashboard:

```
npx prisma studio

```

### Prisma User Model path

```typescript
import { User } from '@prisma/client';
import { User } from '.prisma/client';
```

---

### Pagination Prisma

- offset - for small number, must select previous, can jump to page, can sort on any field
- cursor - for infinite scroll facebook timeline, can handle large number, needs one sorted field, can't jump to page
- offset and cursor-based pagination [prisma docs](https://www.prisma.io/docs/concepts/components/prisma-client/pagination) and [tutorial](https://medium.com/@smallbee/super-fast-offset-pagination-with-prisma2-21db93e5cc90)
- Prisma code [example](https://dnlytras.com/snippets/searchable-paginated-endpoint-prisma/)

### Prisma Postgres full text search

- text search, `search` prop [docs](https://www.prisma.io/docs/concepts/components/prisma-client/full-text-search)
- filtering `AND, OR, where, contains` [docs](https://www.prisma.io/docs/concepts/components/prisma-client/filtering-and-sorting)

- problem: prisma `where` and `orderBy` type errors, solution: cast object e.g `{...} as Prisma.UserOrderByWithRelationAndSearchRelevanceInput,`

- Prisma generates client on yarn install automatically

### Upgrade to Prisma 4

- [docs](https://www.prisma.io/docs/guides/upgrade-guides/upgrading-versions/upgrading-to-prisma-4#breaking-changes)
- validate schema `npx prisma validate`
- nothing changed, all works

### Full text search with Postgres

- `_` matches space literally, I need that and not `&` to match phrase with space `cat dog`
- `cat & dog` matches those two words **anywhere in same content**, in any order, `cat some text dog`
- Github [issue](https://github.com/prisma/prisma/issues/8939)
