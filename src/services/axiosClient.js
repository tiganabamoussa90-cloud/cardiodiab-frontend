import axios from "axios";
import { API_BASE_URL } from "../config";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
});

// Attach the JWT badge to every request.
axiosClient.interceptors.request.use((reqConfig) => {
  const token = localStorage.getItem("cardiodiab_token");
  if (token) {
    reqConfig.headers.Authorization = `Bearer ${token}`;
  }
  return reqConfig;
});

// Centralize 401 handling: the badge is gone or expired, force a clean re-login
// instead of letting every page handle it separately.
let onUnauthorized = null;
export function registerUnauthorizedHandler(handler) {
  onUnauthorized = handler;
}

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && onUnauthorized) {
      onUnauthorized();
    }
    // Surface the backend's French `detail` message uniformly. A raw axios
    // "Network Error" means the server never responded at all (down, crashé,
    // ou requête bloquée par CORS) — on le dit explicitement plutôt que de
    // laisser le message technique anglais s'afficher.
    const message =
      error.response?.data?.detail ||
      (error.message === "Network Error"
        ? "Impossible de contacter le serveur CardioDiab. Vérifiez qu'il est démarré et accessible."
        : error.message) ||
      "Une erreur réseau est survenue.";
    return Promise.reject(new Error(message));
  }
);
