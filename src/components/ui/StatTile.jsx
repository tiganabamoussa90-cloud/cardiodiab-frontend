export function StatTile({ icon: Icon, label, value, tone = "pulse", trend }) {
  const toneClass = {
    pulse: "bg-pulse-50 text-pulse-600",
    cardio: "bg-cardio-50 text-cardio-600",
    diabete: "bg-diabete-50 text-diabete-600",
    neural: "bg-neural-50 text-neural-ink",
    neutral: "bg-surface-sunken text-ink-muted",
  }[tone];

  return (
    // 1. "p-4 sm:p-5" -> On réduit l'espacement sur mobile pour gagner de la place
    // 2. "gap-3 sm:gap-4" -> On resserre légèrement l'espace entre l'icône et les textes
    <div className="flex items-center gap-3 sm:gap-4 rounded-xl2 border border-border bg-surface p-4 sm:p-5 shadow-card min-w-0 w-full">
      {Icon && (
        // "h-10 w-10 sm:h-11 sm:w-11" -> Icône légèrement plus compacte sur mobile
        <div className={`flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
      )}
      <div className="min-w-0 flex-1"> {/* "min-w-0" et "flex-1" empêchent les textes longs de casser l'alignement */}
        {/* "truncate" -> Coupe proprement le label avec des points de suspension s'il est vraiment trop long sur mobile */}
        <p className="label-eyebrow truncate text-xs">{label}</p>
        
        {/* "text-xl sm:text-2xl" -> 20px sur mobile, 24px sur PC pour éviter que les gros chiffres ne sortent de la tuile */}
        <p className="font-display text-xl sm:text-2xl font-semibold text-ink truncate mt-0.5">{value}</p>
        
        {trend && <p className="text-xs text-ink-muted mt-0.5 truncate">{trend}</p>}
      </div>
    </div>
  );
}