FROM quay.io/keycloak/keycloak:23.0.0

ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin123

#Database configuration
ENV KC_DB=postgres
ENV KC_DB_URL=jdbc:postgresql://dpg-d7joak1o3t8c73djs2fg-a.virginia-postgres.render.com:5432/keycloak_elva_db
ENV KC_DB_USERNAME=keycloak_elva_db_user
ENV KC_DB_PASSWORD=WQiLBB4Idsd8y4CpBRnctnPyWOBM9OEl
ENV KC_CACHE=local
ENV KC_HTTP_ENABLED=true
ENV KC_HOSTNAME_STRICT=false
ENV KC_CACHE_STACK=none
ENV KC_PROXY=edge

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--http-port=8080", "--hostname-strict=false"]
