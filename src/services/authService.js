import { axiosClient } from "./axiosClient";

export const authService = {
  login: (email, mot_de_passe) =>
    axiosClient.post("/auth/login", { email, mot_de_passe }).then((r) => r.data),

  registerMedecin: (payload) =>
    axiosClient.post("/auth/register-medecin", payload).then((r) => r.data),

  registerAgent: (payload) =>
    axiosClient.post("/auth/register-agent", payload).then((r) => r.data),

};
