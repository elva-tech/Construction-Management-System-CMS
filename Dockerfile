FROM quay.io/keycloak/keycloak:23.0.0

ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin123

#Database configuration
ENV KC_DB=postgres
ENV KC_DB_URL=jdbc:postgresql://dpg-d7k8ssd7vvec7396fpg0-a.virginia-postgres.render.com:5432/keycloack_elva_db?sslmode=require&ssl=true
ENV KC_DB_USERNAME=keycloack_elva_db_user
ENV KC_DB_PASSWORD=L5g2nskAJTlDyQ3mZ2HlCYHoMrxdIy5w
ENV KC_CACHE=local
ENV KC_HTTP_ENABLED=true
ENV KC_HOSTNAME_STRICT=false
ENV KC_PROXY=edge
ENV KC_HTTP_PORT=8080
ENV KC_DB_URL_PROPERTIES="sslmode=require"

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
#CMD ["start", "--http-port=8080", "--hostname-strict=false","--spi-initialization-admin-create=true"]
CMD ["sh", "-c", "/opt/keycloak/bin/kc.sh start-dev --http-port=${PORT}"]
