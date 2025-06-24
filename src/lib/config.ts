export const API_BASE_URL =
  import.meta.env.MODE === "production"
    ? "https://recipes-backend.alejandro-hernandez-00.workers.dev"
    : "https://recipes-backend-dev.alejandro-hernandez-00.workers.dev";
