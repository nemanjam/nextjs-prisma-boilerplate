### Backend

- pay attention at arguments (interface) for services - extract interface types - same type as mutations request type adn controller input type (but query params or body)

1. middleware - checks permissions as soon as possible, as soon it has required informations
2. controller - transforms http request into service args, and handles response and statuses, throws http errors
3. service - handles database and provides functions for controller, agnostic of permissions and http and session user, throws only database exceptions, no double checks

- no service depends on logged in user
