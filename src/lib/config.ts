// src/lib/config.ts
declare const __BRANCH__: string;

export const API_BASE_URL =
  __BRANCH__ === "main"
    ? "https://recipes-backend-prod.alejandro-hernandez-00.workers.dev"
    : "https://recipes-backend.alejandro-hernandez-00.workers.dev";