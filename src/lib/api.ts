const AUTH_TOKEN = "Bearer SECRET_TOKEN_123";

/**
 * Wrapper sobre fetch() que agrega automáticamente el token de autorización.
 */
export async function authFetch(input: RequestInfo, init: RequestInit = {}) {
  const headers = {
    ...(init.headers || {}),
    "Authorization": AUTH_TOKEN,
  };

  return fetch(input, {
    ...init,
    headers,
  });
}