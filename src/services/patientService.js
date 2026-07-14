import { axiosClient } from "./axiosClient";

export const patientService = {
  timeline: () => axiosClient.get("/patient/dashboard/timeline").then((r) => r.data),

  indicateurs: () => axiosClient.get("/patient/dashboard/Indicateurs").then((r) => r.data),

  recommandations: () =>
    axiosClient.get("/patient/dashboard/recommandations").then((r) => r.data),

  rapportConsultation: (idConsultation) =>
    axiosClient.get(`/patient/consultation/${idConsultation}/rapport`).then((r) => r.data),
  modifierMotDePasse:(payload)=>
    axiosClient.post("/patient/modifier-mot-de-passe",payload).then((r)=>r.data),
};
