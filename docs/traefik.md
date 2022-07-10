### Traefik reverse proxy

- blog [tutorial](https://www.alexhyett.com/traefik-vs-nginx-docker-raspberry-pi) and Github [repo](https://github.com/alexhyett/traefik-vs-nginx-docker)
- Digital ocean [tutorial](https://www.digitalocean.com/community/tutorials/how-to-use-traefik-v2-as-a-reverse-proxy-for-docker-containers-on-ubuntu-20-04)
- Hashnode [tutorial](https://rafrasenberg.hashnode.dev/docker-container-management-with-traefik-v2-and-portainer) and Github [repo](https://github.com/rafrasenberg/docker-traefik-portainer)

### Traefik deploy production

- problem: cannot write to sqlite db, solution: `chmod a+rw prisma prisma/dev.db`, both folder and db file
- `chmod 777 -R prisma` - error, can't read schema.prisma
- but add `chmod a+rw -R uploads` for uploads folder

```bash
scp ./.env.local ubuntu@amd1:/home/ubuntu/traefik-proxy/apps/nextjs-prisma-boilerplate

scp ./prisma/dev.db ubuntu@amd1:/home/ubuntu/traefik-proxy/apps/nextjs-prisma-boilerplate/prisma

# to prisma folder itself non-recursively too
# only these two, not schema or folder recursively
chmod 777 prisma prisma/dev.db
```

```bash
export DATABASE_URL="file:./dev.db"
echo $DATABASE_URL

docker-compose -f docker-compose.prod.yml build

# ---

export HOSTNAME="localhost3000.live"
echo $HOSTNAME

docker-compose -f docker-compose.prod.yml up -d

docker-compose -f docker-compose.prod.yml down

```

- `env_file` inserts into container, not in docker-compose.yml, those are from host (HOSTNAME)

```yml
env_file:
  - .env.production
  - .env.local
labels:
  - 'traefik.http.routers.nextjs-prisma-secure.rule=Host(`nextjs-prisma-boilerplate.${HOSTNAME}`)'
```

- set env vars on host permanently?

#### Renew Let's Encrypt certificate manually

[tutorial](https://traefik.io/blog/how-to-force-update-lets-encrypt-certificates/)

```bash
# -rw------- 1 ubuntu ubuntu 42335 May 15 10:45 acme.json

# download acme.json
scp ubuntu@amd1:/home/ubuntu/traefik-proxy/core/traefik-data/acme.json ./core/traefik-data/acme.json

# remove all from array
"Certificates": []

# push back edited to server
# chmod stays same 600
# -rw------- 1 ubuntu ubuntu 3533 Jul 10 15:27 acme.json
scp ./core/traefik-data/acme.json ubuntu@amd1:/home/ubuntu/traefik-proxy/core/traefik-data/acme.json

# restart traefik
docker-compose down
docker-compose up -d

# backup on server
scp ./core/traefik-data/acme.json ubuntu@amd1:/home/ubuntu/acme.json.back
```
