FROM quay.io/keycloak/keycloak:23.0.0

ENV KC_BOOTSTRAP_ADMIN_USERNAME=admin
ENV KC_BOOTSTRAP_ADMIN_PASSWORD=admin123

ENTRYPOINT ["/opt/keycloak/bin/kc.sh"]
CMD ["start", "--http-port=8080", "--hostname-strict=false"]
