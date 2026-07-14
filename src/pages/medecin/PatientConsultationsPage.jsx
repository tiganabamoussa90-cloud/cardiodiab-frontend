import { Link, useParams } from "react-router-dom";
import { ArrowLeft, FileText, Plus } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Table, THead, Th, Tr, Td } from "../../components/ui/Table";
import { Spinner, ErrorState, EmptyState } from "../../components/ui/States";
import { RiskBadge } from "../../components/ui/Badge";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import { medecinService } from "../../services/medecinService";
import { ROLES } from "../../utils/roles";
import { formatDate } from "../../utils/formatters";

export default function PatientConsultationsPage() {
  const { idPatient } = useParams();
  const { role } = useAuth();
  const { data: consultations, error, isLoading, reload } = useApi(
    () => medecinService.historiqueConsultations(idPatient),
    [idPatient]
  );

  const voirCardio  = role !== ROLES.DIABETOLOGUE;
  const voirDiabete = role !== ROLES.CARDIOLOGUE;

  // Validation stricte de la présence d'un score numérique
  const isValidScore = (score) => score !== null && score !== undefined && typeof score === 'number';

  return (
    <div>
      <Topbar
        title="Historique des consultations"
        subtitle={`Dossier patient #${idPatient}`}
        actions={
          <div className="flex gap-2">
            <Link to="/medecin/patients">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4" /> Patients
              </Button>
            </Link>
            <Link to={`/medecin/patients/${idPatient}/nouvelle-consultation`}>
              <Button size="sm">
                <Plus className="h-4 w-4" /> Nouvelle consultation
              </Button>
            </Link>
          </div>
        }
      />

      <div className="p-8">
        <Card>
          <CardBody className="pt-5">
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <ErrorState message={error} onRetry={reload} />
            ) : !Array.isArray(consultations) || consultations.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Aucune consultation enregistrée"
                description="Lancez la première évaluation clinique de ce patient."
                action={
                  <Link to={`/medecin/patients/${idPatient}/nouvelle-consultation`}>
                    <Button size="sm">Démarrer une consultation</Button>
                  </Link>
                }
              />
            ) : (
              <Table>
                <THead>
                  <Th>Date</Th>
                  <Th>Type</Th>
                  {voirCardio  && <Th>Risque cardio</Th>}
                  {voirDiabete && <Th>Risque diabète</Th>}
                  <Th></Th>
                </THead>
                <tbody>
                  {consultations.map((c) => (
                    <Tr key={c.id_consultation}>
                      <Td>{formatDate(c.date_consultation)}</Td>
                      <Td className="capitalize">{c.type_consultation}</Td>
                      {voirCardio && (
                        <Td>
                          <RiskBadge
                            score={c.score_cardio > 0 ? c.score_cardio : null}
                            kind="cardio"
                          />
                        </Td>
                      )}
                      {voirDiabete && (
                        <Td>
                          <RiskBadge
                            score={c.score_diabete > 0 ? c.score_diabete : null}
                            kind="diabete"
                          />
                        </Td>
                      )}
                      <Td>
                        <Link
                          to={`/medecin/consultations/${c.id_consultation}`}
                          className="font-semibold text-pulse-500 hover:underline"
                        >
                          Détails →
                        </Link>
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}