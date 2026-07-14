import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, FileDown, HeartPulse, Droplet, Save } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Textarea } from "../../components/ui/Field";
import { Spinner, ErrorState } from "../../components/ui/States";
import { BioRiskGauge } from "../../components/charts/BioRiskGauge";
import { ShapInfluenceChart } from "../../components/charts/ShapInfluenceChart";
import { useApi, useAction } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import { useToast } from "../../hooks/useToast";
import { medecinService } from "../../services/medecinService";
import { ROLES } from "../../utils/roles";
import { formatDate } from "../../utils/formatters";

export default function ConsultationDetailPage() {
  const { idConsultation } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const { role } = useAuth();

  const { data, error, isLoading } = useApi(
    () => medecinService.detailConsultation(idConsultation),
    [idConsultation]
  );

  const [commentaire, setCommentaire] = useState("");

  useEffect(() => {
    if (data?.donnees_cliniques?.commentaire_medecin !== undefined) {
      setCommentaire(data.donnees_cliniques.commentaire_medecin || "");
    }
  }, [data]);

  const [saveCommentaire, { isLoading: isSaving }] = useAction(async () => {
    await medecinService.mettreAJourCommentaire(idConsultation, commentaire);
    toast.success("Commentaire mis à jour avec succès.");
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  const consultation = data.donnees_cliniques;
  const shap = data.explicabilite_shap || {};

  // ── Filtrage par rôle ─────────────────────────────────────────────────────
  const voirCardio = role !== ROLES.DIABETOLOGUE;
  const voirDiabete = role !== ROLES.CARDIOLOGUE;

  const scoreCardio =
    voirCardio &&
    consultation.score_cardio !== null &&
    consultation.score_cardio !== undefined &&
    consultation.score_cardio >= 0
      ? consultation.score_cardio
      : null;

  const scoreDiabete =
    voirDiabete &&
    consultation.score_diabete !== null &&
    consultation.score_diabete !== undefined &&
    consultation.score_diabete >= 0
      ? consultation.score_diabete
      : null;

  return (
    <div>
      <Topbar
        title={`Consultation du ${formatDate(consultation.date_consultation)}`}
        subtitle={`Dossier patient #${consultation.id_patient}`}
        actions={
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-4 w-4" /> Retour
            </Button>
            <Link to={`/medecin/consultations/${idConsultation}/rapport`}>
              <Button size="sm">
                <FileDown className="h-4 w-4" /> Rapport imprimable
              </Button>
            </Link>
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 p-8 lg:grid-cols-3">
        {/* Jauge — n'affiche que les anneaux autorisés par le rôle */}
        <Card className="lg:col-span-1">
          <CardHeader
            title="Scores prédictifs"
            subtitle={
              role === ROLES.CARDIOLOGUE
                ? "Vue cardiologue — risque cardiovasculaire"
                : "Vue diabétologue — risque diabétique"
            }
          />
          <CardBody className="flex flex-col items-center">
            <BioRiskGauge cardioScore={scoreCardio} diabeteScore={scoreDiabete} />
          </CardBody>
        </Card>

        {/* Constantes cliniques — toujours visibles */}
        <Card className="lg:col-span-2">
          <CardHeader title="Constantes cliniques" />
          <CardBody>
            <dl className="grid grid-cols-2 gap-x-4 gap-y-4 text-sm sm:grid-cols-3">
              <Metric label="Poids" value={`${consultation.weight} kg`} />
              <Metric label="Taille" value={`${consultation.height} m`} />
              <MetricRole role={role} consultation={consultation} />
            </dl>
          </CardBody>
        </Card>

        {/* SHAP Cardio — masqué pour le diabétologue */}
        {voirCardio && shap.cardio && (
          <Card className="lg:col-span-3">
            <CardHeader
              title="Explicabilité — risque cardiovasculaire"
              action={<HeartPulse className="h-5 w-5 text-cardio-500" />}
            />
            <CardBody>
              <ShapInfluenceChart shapValues={shap.cardio} />
            </CardBody>
          </Card>
        )}

        {/* SHAP Diabète — masqué pour le cardiologue */}
        {voirDiabete && shap.diabete && (
          <Card className="lg:col-span-3">
            <CardHeader
              title="Explicabilité — risque diabétique"
              action={<Droplet className="h-5 w-5 text-diabete-500" />}
            />
            <CardBody>
              <ShapInfluenceChart shapValues={shap.diabete} />
            </CardBody>
          </Card>
        )}

        {/* Recommandations — tous rôles */}
        <Card className="lg:col-span-3">
          <CardHeader
            title="Recommandations cliniques"
            subtitle="Visibles par le patient dans son espace personnel"
          />
          <CardBody>
            <Textarea rows={4} value={commentaire} onChange={(e) => setCommentaire(e.target.value)} />
            <div className="mt-3 flex justify-end">
              <Button size="sm" isLoading={isSaving} onClick={() => saveCommentaire().catch(() => {})}>
                <Save className="h-4 w-4" /> Enregistrer
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="space-y-0.5">
      <dt className="text-xs font-medium text-ink-faint uppercase tracking-wider">{label}</dt>
      <dd className="text-base font-semibold text-ink">{value ?? "—"}</dd>
    </div>
  );
}

function MetricRole({ role, consultation }) {
  if (role === ROLES.CARDIOLOGUE) {
    return (
      <>
        <Metric label="Pression artérielle" value={`${consultation.ap_hi}/${consultation.ap_lo} mmHg`} />
        <Metric label="Cholestérol (classe)" value={consultation.cholesterol} />
        <Metric label="Glucose (classe)" value={consultation.gluc} />
        <Metric label="Tabagisme" value={consultation.smoke ? "Oui" : "Non"} />
        <Metric label="Activité physique" value={consultation.active ? "Active" : "Sédentaire"} />
        <Metric label="Alcool" value={consultation.alco ? "Oui" : "Non"} />
      </>
    );
  }

  // Pour les diabétologues (ou par défaut pour les autres rôles autorisés)
  return (
    <>
      <Metric label="HbA1c" value={consultation.HbA1c_level ? `${consultation.HbA1c_level} %` : "—"} />
      <Metric label="Glycémie à jeun" value={consultation.blood_glucose_level ? `${consultation.blood_glucose_level} mg/dL` : "—"} />
      <Metric label="Tabagisme" value={consultation.smoking_history || "—"} />
      <Metric label="Antécédent cardiaque" value={consultation.antecedent_heart_disease ? "Oui" : "Non"} />
      <Metric label="Antécédent d'hypertension" value={consultation.antecedent_hypertension ? "Oui" : "Non"} />
    </>
  );
}