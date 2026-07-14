import { useState } from "react";
import { Link } from "react-router-dom";
import { Link2, Users } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Modal } from "../../components/ui/Modal";
import { Field, Input } from "../../components/ui/Field";
import { Table, THead, Th, Tr, Td } from "../../components/ui/Table";
import { Spinner, ErrorState, EmptyState } from "../../components/ui/States";
import { useApi, useAction } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import { medecinService } from "../../services/medecinService";
import { genderLabel, formatDate } from "../../utils/formatters";

export default function PatientsListPage() {
  const { data: patients, error, isLoading, reload } = useApi(medecinService.listerPatients, []);
  const toast = useToast();

  const [linkOpen, setLinkOpen] = useState(false);
  const [ipp, setIPP] = useState("");

  const [linkPatient, { isLoading: isLinking, error: linkError }] = useAction(async () => {
    const res = await medecinService.lierPatient(ipp);
    toast.success(res.message); 
    handleCloseModal();
    reload();
  });

  // Gère la fermeture propre de la modale en nettoyant les états internes
  const handleCloseModal = () => {
    setIPP("");
    setLinkOpen(false);
  };

  // Petite aide visuelle pour rendre les statuts de liaison plus lisibles
  const getStatusBadgeClass = (status) => {
    switch (status?.toLowerCase()) {
      case "actif":
      case "approuvé":
      case "valide":
        return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
      case "en_attente":
      case "pending":
        return "bg-amber-50 text-amber-800 ring-amber-600/20";
      default:
        return "bg-slate-50 text-slate-600 ring-slate-500/10";
    }
  };

  return (
    <div>
      <Topbar
        title="Mes patients"
        subtitle="Créez un nouveau dossier ou liez un patient existant"
        actions={
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" onClick={() => setLinkOpen(true)}>
              <Link2 className="h-4 w-4" /> Lier un patient
            </Button>
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
            ) : !Array.isArray(patients) || patients.length === 0 ? (
              <EmptyState
                icon={Users}
                title="Aucun patient lié"
                description="Vos patients liés apparaîtront ici, avec accès direct à leur historique clinique."
              />
            ) : (
              <Table>
                <THead>
                  <Th>Patient</Th>
                  <Th>Naissance</Th>
                  <Th>Sexe</Th>
                  <Th>Statut du lien</Th>
                  <Th></Th>
                </THead>
                <tbody>
                  {patients.map((p) => (
                    <Tr key={p.id_patient}>
                      <Td className="font-medium">{p.prenom} {p.nom}</Td>
                      <Td>{formatDate(p.date_naissance)}</Td>
                      <Td>{genderLabel(p.gender)}</Td>
                      <Td>{p.statut_lien}</Td>
                      <Td>
                        <Link
                          to={`/medecin/patients/${p.id_patient}`}
                          className="font-semibold text-pulse-500 hover:underline"
                        >
                          Voir le dossier →
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

      {/* Liaison de patient */}
      <Modal open={linkOpen} onClose={handleCloseModal} title="Lier un patient existant">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            linkPatient().catch(() => {}); // Évite les uncaught promise rejections
          }}
          className="space-y-4"
        >
          <Field 
            label="Identifiant permanent du patient" 
            required 
            hint="Communiqué par l'agent d'admission"
          >
            <Input
              required
              value={ipp}
              onChange={(e) => setIPP(e.target.value.toUpperCase())}
              placeholder="IPP-XXXXXXXX"
              autoFocus
            />
          </Field>
          
          {linkError && (
            <div className="rounded-md bg-red-50 p-3 ring-1 ring-red-200">
              <p className="text-sm font-medium text-red-800">{linkError}</p>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-1">
            <Button type="button" variant="ghost" onClick={handleCloseModal}>
              Annuler
            </Button>
            <Button type="submit" isLoading={isLinking}>
              Lier ce patient
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}