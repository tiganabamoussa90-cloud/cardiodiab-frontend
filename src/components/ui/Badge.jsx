const TONES = {
  neutral: "bg-surface-sunken text-ink-muted",
  pulse: "bg-pulse-50 text-pulse-600",
  neural: "bg-neural-50 text-neural-ink",
  cardio: "bg-cardio-50 text-cardio-600",
  diabete: "bg-diabete-50 text-diabete-600",
  danger: "bg-red-50 text-red-600", // Optionnel : une vraie couleur d'alerte pour le danger/critique si tu as ces classes
};

export function Badge({ tone = "neutral", className = "", children }) {
  return (
    <span
      // Ajout de "whitespace-nowrap" pour empêcher le texte du badge de sauter à la ligne sur mobile
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}

// Maps a 0-100 risk score to a consistent tone + label across the app.
export function RiskBadge({ score, kind = "cardio" }) {
  if (score === null || score === undefined) {
    return <Badge tone="neutral">Non évalué</Badge>;
  }

  // Si le score est supérieur ou égal à 75 (Critique), on utilise le ton "danger"
  const tone = score >= 75 ? "danger" : (kind === "diabete" ? "diabete" : "cardio");
  
  let label = "Faible";
  if (score >= 75) label = "Critique";
  else if (score >= 50) label = "Élevé";
  else if (score >= 20) label = "Modéré";

  return <Badge tone={tone}>{label} · {Number(score).toFixed(1)}%</Badge>;
}