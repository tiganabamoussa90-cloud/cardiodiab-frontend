import { ArrowDown, ArrowRight, ArrowUp } from "lucide-react";

const EVOLUTION_META = {
  HAUSSE: { Icon: ArrowUp, tone: "text-cardio-500", label: "En hausse" },
  BAISSE: { Icon: ArrowDown, tone: "text-pulse-500", label: "En baisse" },
  STABLE: { Icon: ArrowRight, tone: "text-ink-muted", label: "Stable" },
};

export function ImcTrendCard({ corpulence }) {
  if (!corpulence) return null;
  const { imc_actuel, imc_precedent, evolution } = corpulence;
  const meta = EVOLUTION_META[evolution] || EVOLUTION_META.STABLE;

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="label-eyebrow">IMC actuel</p>
        <p className="font-display text-3xl font-semibold text-ink">{imc_actuel}</p>
      </div>
      <div className={`flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5 text-sm font-medium ${meta.tone}`}>
        <meta.Icon className="h-4 w-4" />
        {meta.label}
        {imc_precedent !== null && imc_precedent !== undefined && (
          <span className="text-ink-faint">(précédent : {imc_precedent})</span>
        )}
      </div>
    </div>
  );
}

export function ScoreTrendCard({ score }) {
  if (!score) return null;
  const { score_actuel, score_prec, evolution } = score;
  const meta = EVOLUTION_META[evolution] || EVOLUTION_META.STABLE;

  return (
    <div className="flex items-center gap-4">
      <div>
        <p className="label-eyebrow">Score actuel</p>
        <p className="font-display text-3xl font-semibold text-ink">{score_actuel}</p>
      </div>
      <div className={`flex items-center gap-1.5 rounded-full bg-surface-sunken px-3 py-1.5 text-sm font-medium ${meta.tone}`}>
        <meta.Icon className="h-4 w-4" />
        {meta.label}
        {score_prec !== null && score_prec !== undefined && (
          <span className="text-ink-faint">(précédent : {score_prec})</span>
        )}
      </div>
    </div>
  );
}