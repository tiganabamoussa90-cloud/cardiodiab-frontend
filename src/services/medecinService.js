import { axiosClient } from "./axiosClient";

export const medecinService = {

  lierPatient: (ipp) =>
    axiosClient.post("/medecin/lier-patient", { ipp }).then((r) => r.data),

  listerPatients: () => axiosClient.get("/medecin/patients").then((r) => r.data),

  historiqueConsultations: (idPatient) =>
    axiosClient.get(`/medecin/patient/${idPatient}/consultations`).then((r) => r.data),

  enregistrerConsultation: (payload) =>
    axiosClient.post("/medecin/consultation", payload).then((r) => r.data),

  detailConsultation: (idConsultation) =>
    axiosClient.get(`/medecin/consultation/${idConsultation}`).then((r) => r.data),

  mettreAJourCommentaire: (idConsultation, commentaire_medecin) =>
    axiosClient
      .put(`/medecin/consultation/${idConsultation}/commentaire`, { commentaire_medecin })
      .then((r) => r.data),

  rapportConsultation: (idConsultation) =>
    axiosClient.get(`/medecin/consultation/${idConsultation}/rapport`).then((r) => r.data),
};

