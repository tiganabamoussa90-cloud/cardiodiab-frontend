import { axiosClient } from "./axiosClient";

export const adminService = {
  medecinsEnAttente: () =>
    axiosClient.get("/admin/medecins/en-attente").then((r) => r.data),

  agentsEnAttente: ()=>
    axiosClient.get("/admin/agents/en-attente").then((r)=>r.data),

  validerMedecin: (id_medecin, action) =>
    axiosClient.post("/admin/medecins/valider", { id_medecin, action }).then((r) => r.data),

  validerAgent:(id_agent,action)=>
    axiosClient.post("/admin/agents/valider",{id_agent,action}).then((r)=>r.data),
  
  suspendreMedecin: (idMedecin) =>
    axiosClient.put(`/admin/medecins/${idMedecin}/suspendre`).then((r) => r.data),

  logsAudit: (limit = 50) =>
    axiosClient.get("/admin/logs/audit", { params: { limit } }).then((r) => r.data),
};
