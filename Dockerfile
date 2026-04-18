FROM quay.io/keycloak/keycloak:23.0.0

ENV KEYCLOAK_ADMIN=admin
ENV KEYCLOAK_ADMIN_PASSWORD=admin123

CMD ["start", "--http-enabled=true", "--hostname-strict=false", "--hostname=0.0.0.0", "--http-port=10000"]
