// config.js — Keycloak OIDC OAuth2 Configuration
export const AUTH_CONFIG = {
  domain: import.meta.env.VITE_AUTH_DOMAIN || "obiebank-sbx.banfico.io",
  tenant: import.meta.env.VITE_AUTH_TENANT || "provider",
  clientId: import.meta.env.VITE_AUTH_CLIENT_ID || "corebank-spa",
  clientSecret: import.meta.env.VITE_AUTH_CLIENT_SECRET || "corebank-spa-password",
  defaultUsername: "nivas.ganesan+aihackathonteamg@banfico.com",
  defaultPassword: "c@96slwDBgV6un(8*EO9",
};

export const getTokenEndpoint = (domain = AUTH_CONFIG.domain, tenant = AUTH_CONFIG.tenant) => {
  const cleanDomain = domain.replace(/^https?:\/\//, "").replace(/\/+$/, "");
  return `https://auth.${cleanDomain}/auth/realms/${tenant.trim()}/protocol/openid-connect/token`;
};
