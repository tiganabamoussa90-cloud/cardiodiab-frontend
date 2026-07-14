import { axiosClient } from "./axiosClient";

export const agentService={
    creerPatient:(payload)=>
        axiosClient.post("/agent/creer-patient",payload).then((r)=>r.data),
}
