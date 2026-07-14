import { Component, HeartPulse } from "lucide-react";
import logo from "/logo.png";
import { SMOKING_HISTORY_LABELS, CHOLESTEROL_LABELS, GLUCOSE_LABELS } from "../utils/formatters";

// audience = "medecin" ou "patient"
export function ReportDocument({ report, audience }) {
  if (!report) return null;

  const isMedecin = audience === "medecin";

  const title = report.entete_etablissement;
  const dateLine = report.date_edition;
  const patient = report.dossier_patient;
  const constants = report.constantes_biologiques;
  const conclusions = report.conclusions_ia;
  const notes = report.recommandations_therapeutiques;

  // Détermine le bloc à afficher SANS ambiguïté
  const bloc = isMedecin ? report.specialite : report.type_consultation;
  const isCardio = bloc === "CARDIOLOGUE" || bloc === "CARDIOLOGIE";
  const isDiabete = bloc === "DIABETOLOGUE" || bloc === "DIABETOLOGIE";

  const genderLabel = constants?.gender === 2 ? "Homme" : constants?.gender === 1 ? "Femme" : "—";

  return (
    // MODIFICATION : px-4 py-6 sur mobile (gain de place), px-10 py-12 sur PC (sm:), et retrait des marges horizontales d'impression
    <div className="mx-auto max-w-2xl bg-white px-4 sm:px-10 py-6 sm:py-12 print:px-0 print:py-0 w-full">
      
      {/* En-tête du document */}
      <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row sm:items-center gap-3 border-b border-border pb-6">
        <img src={logo} alt="Logo" className="h-12 w-auto sm:h-16 object-contain self-start sm:self-auto" />
        <div>
          <p className="font-display text-base sm:text-lg font-semibold text-ink leading-tight">{title}</p>
          <p className="text-xs text-ink-muted">Édité le {dateLine}</p>
        </div>
      </div>

      {patient && (
        <Section title="Identification du patient">
          <p className="text-sm text-ink leading-relaxed">
            <strong className="font-semibold">{patient.prenom} {patient.nom}</strong> — né(e) le {patient.date_naissance}
            {isMedecin && (
              <>
                <br />
                <span className="text-xs sm:text-sm">
                  CIN : {patient.cin} — Couverture médicale {patient.couverture_medicale}
                </span>
              </>
            )}
          </p>
        </Section>
      )}

      <Section title="Date de l'examen">
        <p className="text-sm text-ink">{report.date_examen}</p>
      </Section>

      <Section title="Constantes biologiques">
        {isMedecin ? (
          // MODIFICATION : grid-cols-1 par défaut sur mobile (une ligne par constante), grid-cols-2 dès la taille "sm" (PC)
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border border-border/55 rounded-xl p-4 sm:p-0 sm:border-0 sm:rounded-none">
            <Row label="Âge" value={constants.age ? `${constants.age} ans` : null} />
            <Row label="Genre" value={genderLabel} />
            <Row label="Poids" value={`${constants.poids_kg} kg`} />
            <Row label="Taille" value={`${constants.taille_m} m`} />
            <Row label="IMC" value={constants.imc_calcule} />

            {isCardio && (
              <>
                <Row
                  label="Pression artérielle"
                  value={`${constants.pression_systolique} / ${constants.pression_diastolique} mmHg`}
                />
                <Row label="Cholestérol (classe)" value={CHOLESTEROL_LABELS[constants.cholesterol_classe]} />
                <Row label="Glucose (classe)" value={GLUCOSE_LABELS[constants.glucose_classe]} />
                <Row label="Fumeur" value={constants.smoke === 1 ? "Oui" : "Non"} />
                <Row label="Alcool" value={constants.alcool === 1 ? "Oui" : "Non"} />
                <Row label="Activité physique" value={constants.activite_physique === 1 ? "Oui" : "Non"} />
              </>
            )}

            {isDiabete && (
              <>
                <Row label="Antécédent d'hypertension" value={constants.antecedent_hypertension === 1 ? "Oui" : "Non"} />
                <Row label="Antécédent cardiaque" value={constants.antecedent_heart_disease === 1 ? "Oui" : "Non"} />
                <Row label="Historique tabagique" value={SMOKING_HISTORY_LABELS[constants.smoking_history]} />
                <Row label="Hémoglobine glyquée (HbA1c)" value={constants.taux_hemoglobine_glyquee} />
                <Row label="Glycémie à jeun" value={constants.glycemie_a_jeun} />
              </>
            )}
          </dl>
        ) : (
          // --- Version PATIENT : narrative, fluide, sans jargon technique ---
          <p className="text-sm leading-relaxed text-ink text-justify">
            Vous êtes un{constants.gender === 1 ? "e" : ""} patient{constants.gender === 1 ? "e" : ""}
            {constants.age ? ` de ${constants.age} ans` : ""}, pesant {constants.poids_kg} kg pour une
            taille de {constants.taille_m} m, soit un Indice de Masse Corporelle (IMC) de{" "}
            <strong className="font-semibold">{constants.imc_calcule}</strong>.
            {isCardio && (
              <>
                {" "}Votre tension artérielle mesurée est de <strong className="font-semibold">{constants.pression_systolique} / {constants.pression_diastolique} mmHg</strong>. Votre taux de cholestérol est classé{" "}
                <strong className="font-semibold">{CHOLESTEROL_LABELS[constants.cholesterol_classe]}</strong>, et votre taux de glucose est classé{" "}
                <strong className="font-semibold">{GLUCOSE_LABELS[constants.glucose_classe]}</strong>.
              </>
            )}
            {isDiabete && (
              <>
                {" "}Votre taux d'hémoglobine glyquée (HbA1c) est de <strong className="font-semibold">{constants.taux_hemoglobine_glyquee}%</strong>,
                et votre glycémie à jeun est de <strong className="font-semibold">{constants.glycemie_a_jeun} mg/dL</strong>.
                {constants.antecedent_hypertension === 1 && " Vous avez un antécédent d'hypertension."}
                {constants.antecedent_heart_disease === 1 && " Vous avez un antécédent de maladie cardiaque."}
              </>
            )}
          </p>
        )}
      </Section>

      <Section title="Conclusions de l'analyse prédictive">
        {/* MODIFICATION : Passage en 1 colonne sur mobile, 2 colonnes sur PC */}
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm border border-border/55 rounded-xl p-4 sm:p-0 sm:border-0 sm:rounded-none">
          {conclusions.risque_cardiovasculaire && (
            <Row label="Risque cardiovasculaire" value={conclusions.risque_cardiovasculaire} />
          )}
          {conclusions.risque_diabete && (
            <Row label="Risque diabétique" value={conclusions.risque_diabete} />
          )}
        </dl>
      </Section>

      <Section title="Recommandations thérapeutiques">
        <p className="whitespace-pre-wrap text-sm text-ink leading-relaxed text-justify">{notes}</p>
      </Section>

      <p className="mt-10 text-center text-[10px] sm:text-[11px] text-ink-faint leading-normal">
        Document généré par CardioDiab Predict — à usage d'aide à la décision clinique, ne remplace pas un avis médical direct.
      </p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div className="mb-6 sm:mb-7">
      <p className="label-eyebrow mb-2 border-l-2 border-pulse-500 pl-2 text-xs uppercase tracking-wider font-semibold text-ink-muted">{title}</p>
      {children}
    </div>
  );
}

function Row({ label, value }) {
  return (
    // MODIFICATION : Utilisation d'un conteneur flex avec border-b discret sur mobile pour séparer visuellement les constantes
    <div className="flex justify-between items-center py-1 sm:py-0.5 border-b border-dashed border-border sm:border-0 last:border-0">
      <dt className="text-ink-muted text-xs sm:text-sm">{label}</dt>
      <dd className="text-right font-medium text-ink text-xs sm:text-sm">{value ?? "—"}</dd>
    </div>
  );
}