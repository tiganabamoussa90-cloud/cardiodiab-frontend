// Centralized runtime config. Override via .env (VITE_API_URL) for staging/prod.
export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
