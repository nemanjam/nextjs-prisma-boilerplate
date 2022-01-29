# Postgres

- set env vars Oracle?
- allow remote connections [tutorial](https://docs.cloudera.com/HDPDocuments/HDF3/HDF-3.5.2/installing-hdf/content/configure_postgres_to_allow_remote_connections.html) and [volume paths](https://stackoverflow.com/questions/67172400/how-to-launch-a-postgres-docker-container-with-valid-initial-setting)

```yml
volumes:
  - ./prisma/pg-data:/var/lib/postgresql/data
  - ./prisma/pg-config/pg_hba.conf:/var/lib/postgresql/data/pg_hba.conf
# - ./prisma/pg-config/postgresql.conf:/var/lib/postgresql/data/postgresql.conf
```

- needed to build with local database

```bash
sudo chown -R $USER ./prisma/pg-data
```

### Postgres allow remote connections

#### expose Postgres directly without Traefik (can't route TCP to subdomains, only IPs, layer4)

- set custom location for `postgresql.conf` (remove it from `/var/lib/postgresql/data`)
- can't mount conf files in `/var/lib/postgresql/data`, folder not empty error
- change port to `5433`

```yml
command: postgres -p 5433 -c config_file=/etc/postgresql.conf
```

- set custom location for `pg_hba.conf` in `postgresql.conf`

```bash
hba_file = '/etc/pg_hba.conf'
```

- allow remote connections in `pg_hba.conf`
- [tutorial](https://docs.cloudera.com/HDPDocuments/HDF3/HDF-3.5.2/installing-hdf/content/configure_postgres_to_allow_remote_connections.html)

```bash
# IPv4 local connections:
host    all             all             0.0.0.0/0               trust

# IPv6 local connections:
host    all             all             ::/0                    trust
```

- mount data and config files

```yml
volumes:
  - ./pg-data:/var/lib/postgresql/data
  - ./pg-config/postgresql.conf:/etc/postgresql.conf
  - ./pg-config/pg_hba.conf:/etc/pg_hba.conf
```

### Adminer custom port

- set e.g. `localhost:5433` in the server field
