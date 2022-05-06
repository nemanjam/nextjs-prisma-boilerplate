### Backend

- pay attention at arguments (interface) for services - extract interface types - same type as mutations request type adn controller input type (but query params or body)

1. middleware - checks permissions as soon as possible, as soon it has required informations
2. controller - transforms http request into service args, and handles response and statuses, throws http errors
3. service - handles database and provides functions for controller, agnostic of permissions and http and session user, throws only database exceptions, no double checks

- no service depends on logged in user
- services dont return null, either data or exception, and trim password (db operation)
- services check 404 on input and 400 on output, and all db checks (double email, username 409, 403)
- permissions/access rights in middleware, requireAdmin, requireLogin, 401
- too custom permissions in controller, isAdmin || isOwner 401, controllers should be thin
- services should be standalone
- service layer reuses errors from controller, to small app for custom service errors and error translations to controller layer
- 404 checked in service because of `excludeFromUser(user)` so it doesnt throw on null, should be fixed in Prisma
- getServerSideProps reuses services and has its own api error handler wrapper

```ts
handler.delete(
  requireAdmin,
  validateUserCuid(), // validation already done in middleware
  async (req: NextApiRequest, res: NextApiResponse<ClientUser>) => {
      // just to convert to type, remove when next-validation is fixed
    const id = validateUserIdCuid(req.query.id as string);
```
