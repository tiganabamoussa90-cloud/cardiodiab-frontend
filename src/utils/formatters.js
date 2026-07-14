export function formatDate(value) {
  if (!value) return "—";
  // Backend already sends YYYY-MM-DD or "YYYY-MM-DD HH:MM"
  const [datePart, timePart] = String(value).split(" ");
  const [y, m, d] = datePart.split("-");
  if (!y || !m || !d) return value;
  return timePart ? `${d}/${m}/${y} · ${timePart}` : `${d}/${m}/${y}`;
}

export function formatPercent(value) {
  if (value === null || value === undefined) return "—";
  return `${Number(value).toFixed(1)} %`;
}

export function genderLabel(g) {
  return Number(g) === 2 ? "Homme" : "Femme";
}

export const CHOLESTEROL_LABELS = { 1: "Normal", 2: "Élevé", 3: "Très élevé" };
export const GLUCOSE_LABELS = { 1: "Normal", 2: "Élevé", 3: "Très élevé" };

export const SMOKING_HISTORY_OPTIONS = [
  { value: "never", label: "N'a jamais fumé" },
  { value: "current", label: "Fumeur actuel" },
  { value: "former", label: "Ancien fumeur" },
  { value: "ever", label: "A déjà fumé" },
  { value: "not current", label: "Ne fume plus actuellement" },
  { value: "No Infos", label: "Information inconnue" },
];
export const SMOKING_HISTORY_LABELS={
  never_smoked:"N'a jamais fumé",
  current_smoker:"Fumeur actuel",
  former_smoker:"Ancien fumeur",
}
// Human-readable labels for raw SHAP feature keys returned by the backend.
export const FEATURE_LABELS = {
  age: "Âge",
  diff_PS_PD: "Pression différentielle (PS - PD)",
  diastolic_pressure: "Pression diastolique",
  bmi: "Indice de Masse Corporelle",
  cholesterol: "Cholestérol",
  glucose: "Glucose",
  gender: "Sexe",
  smoking_status: "Statut tabagique",
  alcohol_status: "Consommation d'alcool",
  physical_activity: "Activité physique",
  HbA1c_level: "Taux d'hémoglobine glyquée",
  blood_glucose_level: "Glycémie à jeun",
  hypertension: "Antécédent d'hypertension",
  heart_disease: "Antécédent cardiaque",
};

export function featureLabel(key) {
  return FEATURE_LABELS[key] || key;
}

export function riskLevel(score) {
  if (score === null || score === undefined) return "inconnu";
  if (score < 20) return "faible";
  if (score < 50) return "modéré";
  if (score < 75) return "élevé";
  return "critique";
}

export const RISK_LEVEL_LABELS = {
  inconnu: "Non évalué",
  faible: "Risque faible",
  modéré: "Risque modéré",
  élevé: "Risque élevé",
  critique: "Risque critique",
};
