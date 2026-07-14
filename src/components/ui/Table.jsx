export function Table({ children }) {
  return (
    // "scrollbar-thin" (optionnel) permet de garder une barre de défilement discrète.
    // On s'assure que le conteneur gère le défilement de manière fluide sur iOS/Android (touch-pan-x).
    <div className="w-full overflow-x-auto scrollbar-thin [-webkit-overflow-scrolling:touch]">
      <table className="w-full min-w-[600px] sm:min-w-full text-left text-sm">
        {children}
      </table>
    </div>
  );
}

export function THead({ children }) {
  return (
    <thead>
      <tr className="border-b border-border text-xs font-semibold uppercase tracking-wide text-ink-faint bg-surface-sunken/40">
        {children}
      </tr>
    </thead>
  );
}

export function Th({ children, className = "" }) {
  return (
    // "px-3 sm:px-4" -> On réduit l'espace horizontal sur mobile pour compacter le tableau
    // "whitespace-nowrap" -> Évite que les titres de colonnes ne se coupent bizarrement
    <th className={`px-3 sm:px-4 py-3 font-semibold whitespace-nowrap ${className}`}>
      {children}
    </th>
  );
}

export function Td({ children, className = "" }) {
  return (
    // "px-3 sm:px-4 py-3 sm:py-3.5" -> Padding plus compact sur mobile pour afficher plus de données
    <td className={`px-3 sm:px-4 py-3 sm:py-3.5 text-ink text-xs sm:text-sm ${className}`}>
      {children}
    </td>
  );
}

export function Tr({ children, className = "", ...props }) {
  return (
    <tr 
      className={`border-b border-border last:border-0 hover:bg-surface-sunken/60 transition-colors ${className}`} 
      {...props}
    >
      {children}
    </tr>
  );
}