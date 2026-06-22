FROM quay.io/keycloak/keycloak:23.0.0

ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin123

#Database configuration
ENV KC_DB=mysql
ENV KC_DB_URL=jdbc:mysql://92.4.91.87:3306/keycloack_elva_db?useSSL=false
ENV KC_DB_USERNAME=elvatech
ENV KC_DB_PASSWORD=root123
ENV KC_CACHE=local
ENV KC_HTTP_ENABLED=true
ENV KC_HOSTNAME_STRICT=false
#ENV KC_PROXY=edge
#ENV KC_HTTP_PORT=8080
#ENV KC_DB_URL_PROPERTIES="sslmode=require"

ENTRYPOINT []
#CMD ["start", "--http-port=8080", "--hostname-strict=false","--spi-initialization-admin-create=true"]
#CMD ["sh", "-c", "/opt/keycloak/bin/kc.sh start-dev --http-port=${PORT}"]
CMD ["sh", "-c", "/opt/keycloak/bin/kc.sh start --http-enabled=true --http-host=0.0.0.0 --http-port=${PORT}"]
