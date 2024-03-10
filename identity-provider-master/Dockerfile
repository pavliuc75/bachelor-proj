FROM quay.io/keycloak/keycloak:19.0.2 as builder

ENV KC_HEALTH_ENABLED=true
ENV KC_METRICS_ENABLED=true
ENV KC_FEATURES=token-exchange
ARG KC_DB=postgres
ENV KC_DB $KC_DB

# Install custom providers
RUN curl -sL https://github.com/aerogear/keycloak-metrics-spi/releases/download/2.5.3/keycloak-metrics-spi-2.5.3.jar -o /opt/keycloak/providers/keycloak-metrics-spi-2.5.3.jar
RUN /opt/keycloak/bin/kc.sh build

FROM quay.io/keycloak/keycloak:19.0.2
COPY --from=builder /opt/keycloak/ /opt/keycloak/
WORKDIR /opt/keycloak
# for demonstration purposes only, please make sure to use proper certificates in production instead
RUN keytool -genkeypair -storepass password -storetype PKCS12 -keyalg RSA -keysize 2048 -dname "CN=server" -alias server -ext "SAN:c=DNS:localhost,IP:127.0.0.1" -keystore conf/server.keystore

ARG KEYCLOAK_ADMIN
ARG KEYCLOAK_ADMIN_PASSWORD
ARG KC_DB_URL_HOST=marketplace-keycloak-dev.cezz8zuqhk5x.eu-north-1.rds.amazonaws.com
ARG KC_DB_USERNAME
ARG KC_DB_PASSWORD
ARG KC_HOSTNAME=localhost

ENV KEYCLOAK_ADMIN $KEYCLOAK_ADMIN
ENV KEYCLOAK_ADMIN_PASSWORD $KEYCLOAK_ADMIN_PASSWORD
ENV KC_DB_URL_HOST $KC_DB_URL_HOST
ENV KC_DB_USERNAME $KC_DB_USERNAME 
ENV KC_DB_PASSWORD $KC_DB_PASSWORD
ENV KC_HOSTNAME $KC_HOSTNAME

COPY themes/marketplace /opt/keycloak/themes/marketplace
ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]

#export KEYCLOAK_ADMIN=admin
#export KEYCLOAK_ADMIN_PASSWORD=admin
#export KC_DB_USERNAME=postgres
#export KC_DB_PASSWORD=rgH#eyMV2fN^
#export KC_HOSTNAME=localhost
#export KC_DB_URL_HOST=marketplace-keycloak-dev.cezz8zuqhk5x.eu-north-1.rds.amazonaws.com


#docker build --build-arg KEYCLOAK_ADMIN=$KEYCLOAK_ADMIN \
#             --build-arg KEYCLOAK_ADMIN_PASSWORD=$KEYCLOAK_ADMIN_PASSWORD \
#             --build-arg KC_DB_USERNAME=$KC_DB_USERNAME \
#             --build-arg KC_DB_PASSWORD=$KC_DB_PASSWORD \
#             --build-arg KC_DB_URL_HOST=$KC_DB_URL_HOST -t ct .
