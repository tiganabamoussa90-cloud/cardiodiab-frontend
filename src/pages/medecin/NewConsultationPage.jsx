import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, HeartPulse, Droplet, FileText } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, Input, Select, Textarea } from "../../components/ui/Field";
import { BioRiskGauge } from "../../components/charts/BioRiskGauge";
import { useAction } from "../../hooks/useApi";
import { useAuth } from "../../hooks/useAuth";
import { medecinService } from "../../services/medecinService";
import { SMOKING_HISTORY_OPTIONS } from "../../utils/formatters";
import { fluxCouvre } from "../../utils/roles";

const INITIAL = {
  weight: "",
  height: "",
  // Valeurs par défaut neutres pour le bloc cardio
  ap_hi: "120",
  ap_lo: "80",
  cholesterol: "1",
  gluc: "1",
  smoke: "0",
  alco: "0",
  active: "1",
  // Valeurs par défaut neutres pour le bloc diabète (corrigées à "0" / Non pour correspondre au Select)
  antecedent_hypertension: "0",
  antecedent_heart_disease: "0",
  smoking_history: "never",
  HbA1c_level: "5.0",
  blood_glucose_level: "90",
};

export default function NewConsultationPage() {
  const { idPatient } = useParams();
  const { role } = useAuth();
  const navigate = useNavigate();
  const flux = fluxCouvre(role);
  const [form, setForm] = useState(INITIAL);
  const [result, setResult] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const [submit, { isLoading, error }] = useAction(async () => {
    const payload = {
      id_patient: Number(idPatient),
      flux_prediction: role.toUpperCase(),
      weight: Number(form.weight),
      height: Number(form.height),
      ap_hi: Number(form.ap_hi),
      ap_lo: Number(form.ap_lo),
      cholesterol: Number(form.cholesterol),
      gluc: Number(form.gluc),
      smoke: Number(form.smoke),
      alco: Number(form.alco),
      active: Number(form.active),
      smoking_history: form.smoking_history,
      HbA1c_level: Number(form.HbA1c_level),
      antecedent_hypertension: Number(form.antecedent_hypertension),
      antecedent_heart_disease: Number(form.antecedent_heart_disease),
      blood_glucose_level: Number(form.blood_glucose_level),
    };
    const res = await medecinService.enregistrerConsultation(payload);
    setResult(res);
  });

  if (result) {
    return (
      <div>
        <Topbar title="Consultation enregistrée" subtitle={`Dossier patient #${idPatient}`} />
        <div className="flex flex-col items-center gap-6 p-10">
          <Card className="w-full max-w-md">
            <CardBody className="flex flex-col items-center pt-7 text-center">
              <BioRiskGauge
                cardioScore={flux.cardio ? result.ia_predictions.score_cardio_pourcent : null}
                diabeteScore={flux.diabete ? result.ia_predictions.score_diabete_pourcent : null}
              />
              <p className="mt-4 text-sm text-ink-muted">{result.xai_status}</p>
            </CardBody>
          </Card>
          <div className="flex gap-3">
            <Link to={`/medecin/patients/${idPatient}`}>
              <Button variant="secondary">Retour à l'historique</Button>
            </Link>
            <Link to={`/medecin/consultations/${result.id_consultation}`}>
              <Button>Voir l'explicabilité SHAP</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Topbar
        title="Nouvelle consultation"
        subtitle={`Saisie clinique — dossier patient #${idPatient}`}
        actions={
          <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" /> Retour
          </Button>
        }
      />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          submit().catch(() => {});
        }}
        className="space-y-6 p-8"
      >
        <Card>
          <CardHeader title="Données morphologiques" />
          <CardBody className="grid grid-cols-2 gap-4">
            <Field label="Poids (kg)" required hint="Ex : 81.5">
              <Input type="number" step="0.1" min="0" required value={form.weight} onChange={update("weight")} />
            </Field>
            <Field label="Taille (m)" required hint="Ex : 1.72">
              <Input type="number" step="0.01" min="0" required value={form.height} onChange={update("height")} />
            </Field>
          </CardBody>
        </Card>

        {/* ── Bloc Cardio  */}
        {flux.cardio && (
          <Card>
            <CardHeader
              title="Paramètres cardiovasculaires"
              subtitle="Alimente le modèle de risque cardio"
              action={<HeartPulse className="h-5 w-5 text-cardio-500" />}
            />
            <CardBody className="grid grid-cols-2 gap-4">
              <Field label="Pression systolique (ap_hi)" required>
                <Input type="number" min="0" required value={form.ap_hi} onChange={update("ap_hi")} />
              </Field>
              <Field label="Pression diastolique (ap_lo)" required>
                <Input type="number" min="0" required value={form.ap_lo} onChange={update("ap_lo")} />
              </Field>
              <Field label="Cholestérol" required>
                <Select value={form.cholesterol} onChange={update("cholesterol")}>
                  <option value="1">Normal</option>
                  <option value="2">Élevé</option>
                  <option value="3">Très élevé</option>
                </Select>
              </Field>
              <Field label="Glucose (classe)" required>
                <Select value={form.gluc} onChange={update("gluc")}>
                  <option value="1">Normal</option>
                  <option value="2">Élevé</option>
                  <option value="3">Très élevé</option>
                </Select>
              </Field>
              <Field label="Tabagisme actif">
                <Select value={form.smoke} onChange={update("smoke")}>
                  <option value="0">Non</option>
                  <option value="1">Oui</option>
                </Select>
              </Field>
              <Field label="Consommation d'alcool">
                <Select value={form.alco} onChange={update("alco")}>
                  <option value="0">Non</option>
                  <option value="1">Oui</option>
                </Select>
              </Field>
              <Field label="Activité physique">
                <Select value={form.active} onChange={update("active")}>
                  <option value="1">Actif</option>
                  <option value="0">Sédentaire</option>
                </Select>
              </Field>
            </CardBody>
          </Card>
        )}

        {/* ── Bloc Diabète  */}
        {flux.diabete && (
          <Card>
            <CardHeader
              title="Paramètres métaboliques"
              subtitle="Alimente le modèle de risque diabète"
              action={<Droplet className="h-5 w-5 text-diabete-500" />}
            />
            <CardBody className="grid grid-cols-2 gap-4">
              <Field label="Historique tabagique" required>
                <Select value={form.smoking_history} onChange={update("smoking_history")}>
                  {SMOKING_HISTORY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.value}>{o.label}</option>
                  ))}
                </Select>
              </Field>
              <Field label="Taux d'HbA1c (%)" required>
                <Input
                  type="number"
                  step="0.1"
                  min="0"
                  required
                  value={form.HbA1c_level}
                  onChange={update("HbA1c_level")}
                />
              </Field>
              <Field label="Glycémie à jeun (mg/dL)" required>
                <Input
                  type="number"
                  min="0"
                  required
                  value={form.blood_glucose_level}
                  onChange={update("blood_glucose_level")}
                />
              </Field>
              <Field label="Antécédent cardiaque">
                <Select value={form.antecedent_heart_disease} onChange={update("antecedent_heart_disease")}>
                  <option value="0">Non</option>
                  <option value="1">Oui</option>
                </Select>
              </Field>
              <Field label="Antécédent d'hypertension">
                <Select value={form.antecedent_hypertension} onChange={update("antecedent_hypertension")}>
                  <option value="0">Non</option>
                  <option value="1">Oui</option>
                </Select>
              </Field>
            </CardBody>
          </Card>
        )}


        {error && <p className="text-sm font-medium text-cardio-500">{error}</p>}

        <div className="flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Lancer la prédiction
          </Button>
        </div>
      </form>
    </div>
  );
}