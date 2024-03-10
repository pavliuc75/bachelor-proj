# Keycloak Identity-provider

This repository customizes the keycloak identity provider

## Local development

1. Open a terminal and export following variables(at least the required ones)

```bash
# Required build-args
export KEYCLOAK_ADMIN=<CHANGE-ME>
export KEYCLOAK_ADMIN_PASSWORD=<CHANGE-ME>
export KC_DB_USERNAME=<CHANGE-ME>
export KC_DB_PASSWORD=<CHANGE-ME>
# Optional build-args
export KC_HOSTNAME=localhost
export KC_DB_URL_HOST=marketplace-keycloak-dev.cezz8zuqhk5x.eu-north-1.rds.amazonaws.com
```
2. Build the docker image 

```bash
docker build --build-arg KEYCLOAK_ADMIN=$KEYCLOAK_ADMIN \
             --build-arg KEYCLOAK_ADMIN_PASSWORD=$KEYCLOAK_ADMIN_PASSWORD \
             --build-arg KC_DB_USERNAME=$KC_DB_USERNAME \
             --build-arg KC_DB_PASSWORD=$KC_DB_PASSWORD \
             --build-arg KC_DB_URL_HOST=$KC_DB_URL_HOST -t ct .

```
3. 
```bash
docker run --rm --name optimized_keycloak -p 8443:8443 ct start --optimized
```
The health checkpoints are:

- https://localhost:8443/health
- https://localhost:8443/health/ready
- https://localhost:8443/health/live

Metrics are available at:

- https://localhost:8443/metrics