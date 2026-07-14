import { useEffect, useState } from "react";
import { riskLevel, RISK_LEVEL_LABELS } from "../../utils/formatters";

const TONE = {
  cardio: "#E6483D",
  diabete: "#F2A60D",
  track: "#EAECE5",
};

// Calcule la taille de la jauge selon la largeur de l'écran
function useGaugeSize(defaultSize = 180) {
  const [size, setSize] = useState(defaultSize);

  useEffect(() => {
    function update() {
      const w = window.innerWidth;
      if (w < 400)       setSize(140); // petit mobile
      else if (w < 640)  setSize(155); // mobile standard
      else if (w < 1024) setSize(165); // tablette
      else               setSize(defaultSize); // PC — valeur d'origine
    }
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [defaultSize]);

  return size;
}

function Ring({ cx, cy, r, stroke, score, strokeWidth }) {
  const circumference = 2 * Math.PI * r;
  const value = score === null || score === undefined ? 0 : Math.min(100, Math.max(0, score));
  const dash = (value / 100) * circumference;
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} stroke={TONE.track} strokeWidth={strokeWidth} fill="none" />
      <circle
        cx={cx}
        cy={cy}
        r={r}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill="none"
        strokeLinecap="round"
        strokeDasharray={`${dash} ${circumference - dash}`}
        transform={`rotate(-90 ${cx} ${cy})`}
        style={{ transition: "stroke-dasharray 0.6s ease" }}
      />
    </g>
  );
}

export function BioRiskGauge({ cardioScore, diabeteScore, size: sizeProp = 180 }) {
  const size = useGaugeSize(sizeProp);

  const showCardio  = cardioScore  !== null && cardioScore  !== undefined;
  const showDiabete = diabeteScore !== null && diabeteScore !== undefined;
  const cx = size / 2;
  const cy = size / 2;
  const strokeWidth = size * 0.075;

  const primaryScore = showCardio ? cardioScore : diabeteScore;
  const level = riskLevel(primaryScore);

  return (
    <div className="flex flex-col items-center">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {showCardio && (
          <Ring
            cx={cx} cy={cy}
            r={size * 0.42}
            stroke={TONE.cardio}
            score={cardioScore}
            strokeWidth={strokeWidth}
          />
        )}
        {showDiabete && (
          <Ring
            cx={cx} cy={cy}
            r={size * 0.42 - strokeWidth - 4}
            stroke={TONE.diabete}
            score={diabeteScore}
            strokeWidth={strokeWidth}
          />
        )}
        <text
          x={cx} y={cy - 2}
          textAnchor="middle"
          className="font-display"
          style={{ fontSize: size * 0.16, fontWeight: 600, fill: "#0B1F1C" }}
        >
          {showCardio && showDiabete
            ? "2 modèles"
            : `${Number(primaryScore ?? 0).toFixed(0)}%`}
        </text>
        <text
          x={cx} y={cy + size * 0.12}
          textAnchor="middle"
          style={{ fontSize: size * 0.065, fill: "#5B6B66" }}
        >
          {RISK_LEVEL_LABELS[level]}
        </text>
      </svg>

      <div className="mt-3 flex gap-4 text-xs">
        {showCardio && (
          <span className="flex items-center gap-1.5 text-ink-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: TONE.cardio }} />
            Cardio {Number(cardioScore).toFixed(1)}%
          </span>
        )}
        {showDiabete && (
          <span className="flex items-center gap-1.5 text-ink-muted">
            <span className="h-2 w-2 rounded-full" style={{ background: TONE.diabete }} />
            Diabète {Number(diabeteScore).toFixed(1)}%
          </span>
        )}
      </div>
    </div>
  );
}