import { useState } from "react";
import { Check, X, ShieldAlert, UserCog } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Field";
import { Table, THead, Th, Tr, Td } from "../../components/ui/Table";
import { Spinner, ErrorState, EmptyState } from "../../components/ui/States";
import { Badge } from "../../components/ui/Badge";
import { useApi, useAction } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import { adminService } from "../../services/adminService";

export default function AdminOverviewPage() {
  const { data: pending, error, isLoading, reload } = useApi(adminService.medecinsEnAttente, []);
  const { data: pending2, error: error2, isLoading: isLoading2, reload: reload2 } = useApi(adminService.agentsEnAttente, []);
  const toast = useToast();
  
  const [suspendId, setSuspendId] = useState("");
  // ✅ États pour suivre quel médecin ou agent précis est en cours de validation
  const [processingMedecinId, setProcessingMedecinId] = useState(null);
  const [processingAgentId, setProcessingAgentId] = useState(null);

  // Décision pour les médecins
  const [decide, { isLoading: isDeciding }] = useAction(async (idMedecin, action) => {
    setProcessingMedecinId(idMedecin);
    try {
      const res = await adminService.validerMedecin(idMedecin, action);
      toast.success(res.message);
      reload();
    } finally {
      setProcessingMedecinId(null);
    }
  });

  // Décision pour les agents
  const [decide2, { isLoading: isDeciding2 }] = useAction(async (idAgent, action) => {
    setProcessingAgentId(idAgent);
    try {
      const res = await adminService.validerAgent(idAgent, action);
      toast.success(res.message);
      reload2();
    } finally {
      setProcessingAgentId(null);
    }
  });

  // Suspension de compte
  const [suspend, { isLoading: isSuspending, error: suspendError }] = useAction(async () => {
    const res = await adminService.suspendreMedecin(Number(suspendId));
    toast.success(res.message);
    setSuspendId("");
    // ✅ Recharger les listes pour s'assurer que les données affichées à l'écran sont fraîches
    reload();
  });

  return (
    <div>
      <Topbar 
        title="Administrateur" 
        subtitle="Validation des praticiens, des agents d'admission et supervision de la plateforme" 
      />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
        {/* SECTION MÉDECINS */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Médecins en attente d'approbation"
            subtitle="Vérifiez l'identité, le N° d'ordre national, le code INPE et la spécialité avant validation"
          />
          <CardBody>
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <ErrorState message={error} onRetry={reload} />
            ) : !pending || pending.length === 0 ? (
              <EmptyState
                icon={UserCog}
                title="Aucune demande en attente"
                description="Les nouvelles inscriptions de praticiens apparaîtront ici."
              />
            ) : (
              <Table>
                <THead>
                  <Th>Praticien</Th>
                  <Th>N° d'Ordre National</Th>
                  <Th>Code INPE</Th>
                  <Th>Spécialité</Th>
                  <Th></Th>
                </THead>
                <tbody>
                  {pending.map((m) => {
                    const isCurrentMedecinProcessing = processingMedecinId === m.id_medecin;
                    return (
                      <Tr key={m.id_medecin}>
                        <Td>
                          <p className="font-medium">{m.prenom} {m.nom}</p>
                          <p className="text-xs text-ink-faint">{m.email}</p>
                        </Td>
                        <Td><p className="font-medium">{m.num_ordre_cnom}</p></Td>
                        <Td><p className="font-medium">{m.code_inpe}</p></Td>
                        <Td><Badge tone="pulse">{m.specialite}</Badge></Td>
                        <Td>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              isLoading={isCurrentMedecinProcessing}
                              disabled={isDeciding && !isCurrentMedecinProcessing}
                              onClick={() => decide(m.id_medecin, "REJETE").catch(() => {})}
                            >
                              <X className="h-4 w-4" /> Rejeter
                            </Button>
                            <Button
                              size="sm"
                              isLoading={isCurrentMedecinProcessing}
                              disabled={isDeciding && !isCurrentMedecinProcessing}
                              onClick={() => decide(m.id_medecin, "APPROUVE").catch(() => {})}
                            >
                              <Check className="h-4 w-4" /> Approuver
                            </Button>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* SECTION AGENTS D'ADMISSION */}
        <Card className="lg:col-span-2">
          <CardHeader
            title="Agents en attente d'approbation"
            subtitle="Vérifiez l'identité, le matricule et le service d'affectation avant validation"
          />
          <CardBody>
            {isLoading2 ? (
              <Spinner />
            ) : error2 ? (
              <ErrorState message={error2} onRetry={reload2} />
            ) : !pending2 || pending2.length === 0 ? (
              <EmptyState
                icon={UserCog}
                title="Aucune demande en attente"
                description="Les nouvelles inscriptions d'agents d'admission apparaîtront ici."
              />
            ) : (
              <Table>
                <THead>
                  <Th>Agent</Th>
                  <Th>Matricule</Th>
                  <Th>Service d'affectation</Th>
                  <Th></Th>
                </THead>
                <tbody>
                  {pending2.map((a) => {
                    const isCurrentAgentProcessing = processingAgentId === a.id_agent;
                    return (
                      <Tr key={a.id_agent}>
                        <Td>
                          <p className="font-medium">{a.prenom_agent} {a.nom_agent}</p>
                          <p className="text-xs text-ink-faint">{a.email}</p>
                        </Td>
                        <Td><p className="font-medium">{a.matricule}</p></Td>
                        <Td><p className="font-medium">{a.service_affectation}</p></Td>
                        <Td>
                          <div className="flex justify-end gap-2">
                            <Button
                              size="sm"
                              variant="secondary"
                              isLoading={isCurrentAgentProcessing}
                              disabled={isDeciding2 && !isCurrentAgentProcessing}
                              onClick={() => decide2(a.id_agent, "REJETE").catch(() => {})}
                            >
                              <X className="h-4 w-4" /> Rejeter
                            </Button>
                            <Button
                              size="sm"
                              isLoading={isCurrentAgentProcessing}
                              disabled={isDeciding2 && !isCurrentAgentProcessing}
                              onClick={() => decide2(a.id_agent, "APPROUVE").catch(() => {})}
                            >
                              <Check className="h-4 w-4" /> Approuver
                            </Button>
                          </div>
                        </Td>
                      </Tr>
                    );
                  })}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>

        {/* SECTION SUSPENSION */}
        <Card>
          <CardHeader title="Suspendre un compte" action={<ShieldAlert className="h-5 w-5 text-cardio-500" />} />
          <CardBody>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                suspend().catch(() => {});
              }}
              className="space-y-3"
            >
              <Field label="Identifiant médecin" required hint="Visible sur le dossier praticien">
                <Input
                  type="number"
                  required
                  value={suspendId}
                  onChange={(e) => setSuspendId(e.target.value)}
                />
              </Field>
              {suspendError && <p className="text-sm font-medium text-cardio-500">{suspendError}</p>}
              <Button type="submit" variant="danger" className="w-full" isLoading={isSuspending}>
                Suspendre l'accès
              </Button>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}