import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Users, Activity, HeartPulse, Droplet } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { StatTile } from "../../components/ui/StatTile";
import { Button } from "../../components/ui/Button";
import { Spinner, ErrorState, EmptyState } from "../../components/ui/States";
import { Table, THead, Th, Tr, Td } from "../../components/ui/Table";
import { useApi } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import { medecinService } from "../../services/medecinService";
import { genderLabel, formatDate } from "../../utils/formatters";
import { ROLE_LABELS, fluxCouvre } from "../../utils/roles";

export default function MedecinOverviewPage() {
  const { role } = useAuth();
  const { data: patients, error, isLoading, reload } = useApi(medecinService.listerPatients, []);
  const flux = fluxCouvre(role);

  const recent = useMemo(() => (patients || []).slice(0, 5), [patients]);

  // Petit dictionnaire pour styliser et traduire le statut du lien
  const formatStatutLien = (statut) => {
    switch (statut?.toLowerCase()) {
      case "actif":
      case "active":
        return <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-1 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-600/10">Actif</span>;
      case "en_attente":
      case "pending":
        return <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-1 text-xs font-medium text-amber-700 ring-1 ring-inset ring-amber-600/10">En attente</span>;
      default:
        return <span className="inline-flex items-center rounded-full bg-slate-50 px-2 py-1 text-xs font-medium text-slate-600 ring-1 ring-inset ring-slate-500/10">{statut || "—"}</span>;
    }
  };

  return (
    <div>
      <Topbar
        title={`Bonjour, ${ROLE_LABELS[role]}`}
        subtitle="Vue d'ensemble de votre activité clinique"
        actions={
          <Link to="/medecin/patients">
            <Button size="sm">Gérer mes patients</Button>
          </Link>
        }
      />

      <div className="space-y-6 p-8">
        {/* Tuiles d'indicateurs de performance et de flux */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <StatTile icon={Users} label="Patients suivis" value={patients ? patients.length : "—"} tone="pulse" />
          <StatTile
            icon={HeartPulse}
            label="Module cardiovasculaire"
            value={flux.cardio ? "Actif" : "Inactif"}
            tone="cardio"
          />
          <StatTile
            icon={Droplet}
            label="Module diabète"
            value={flux.diabete ? "Actif" : "Inactif"}
            tone="diabete"
          />
        </div>

        {/* Tableau des liaisons récentes */}
        <Card>
          <CardHeader
            title="Patients récemment liés"
            subtitle="Les 5 derniers dossiers actifs de votre portefeuille"
            action={
              <Link to="/medecin/patients" className="text-sm font-semibold text-pulse-500 hover:underline">
                Voir tout
              </Link>
            }
          />
          <CardBody>
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <ErrorState message={error} onRetry={reload} />
            ) : recent.length === 0 ? (
              <EmptyState
                icon={Activity}
                title="Aucun patient pour le moment"
                description="Liez-en un via son ipp (identifiant permanent du patient)."
                action={
                  <Link to="/medecin/patients">
                    <Button size="sm">Ajouter un patient</Button>
                  </Link>
                }
              />
            ) : (
              <Table>
                <THead>
                  <Th>Patient</Th>
                  <Th>Naissance</Th>
                  <Th>Sexe</Th>
                  <Th>Couverture médicale</Th>
                  <Th>Statut</Th>
                  <Th></Th>
                </THead>
                <tbody>
                  {recent.map((p) => (
                    <Tr key={p.id_patient}>
                      <Td className="font-medium">{p.prenom} {p.nom}</Td>
                      <Td>{formatDate(p.date_naissance)}</Td>
                      <Td>{genderLabel(p.gender)}</Td>
                      <Td>{p.couverture_medicale || "—"}</Td>
                      <Td>{formatStatutLien(p.statut_lien)}</Td>
                      <Td>
                        <Link
                          to={`/medecin/patients/${p.id_patient}`}
                          className="font-semibold text-pulse-500 hover:underline"
                        >
                          Consultations →
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