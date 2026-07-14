export function Card({ className = "", children, ...props }) {
  return (
    <div
      className={`rounded-xl2 border border-border bg-surface shadow-card ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, className = "" }) {
  return (
    // Changement : On passe en flex-col sur mobile si un bouton d'action est présent, et en flex-row (côte à côte) dès la taille "sm" (tablette/PC)
    // On réduit aussi légèrement le padding sur mobile : p-4 au lieu de p-5
    <div className={`flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 p-4 md:p-5 pb-3 md:pb-4 ${className}`}>
      <div className="min-w-0"> {/* Le min-w-0 évite que les textes très longs ne cassent le flex */}
        <h3 className="font-display text-base font-semibold text-ink break-words">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-ink-muted break-words">{subtitle}</p>}
      </div>
      
      {/* Si une action existe (ex: un bouton d'export ou un filtre), elle s'aligne proprement */}
      {action && (
        <div className="flex items-center sm:self-start">
          {action}
        </div>
      )}
    </div>
  );
}

export function CardBody({ className = "", children }) {
  return (
    // Changement : px-4 (16px) sur mobile pour gagner de la place, et px-5 (20px) sur PC
    <div className={`px-4 md:px-5 pb-4 md:pb-5 ${className}`}>
      {children}
    </div>
  );
}