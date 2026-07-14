import { Loader2, Inbox } from "lucide-react";

export function Spinner({ label = "Chargement…" }) {
  return (
    // On réduit légèrement le padding vertical sur mobile (py-8) et on garde py-12 sur PC
    <div className="flex items-center justify-center gap-2 py-8 md:py-12 text-ink-muted">
      <Loader2 className="h-5 w-5 animate-spin text-pulse-500" />
      <span className="text-sm">{label}</span>
    </div>
  );
}

export function EmptyState({ icon: Icon = Inbox, title, description, action }) {
  return (
    // Remplacement de px-6 par px-4 sur mobile pour gagner un peu d'espace sur les côtés
    <div className="flex flex-col items-center justify-center gap-2 px-4 md:px-6 py-10 md:py-14 text-center">
      <div className="mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-surface-sunken">
        <Icon className="h-5 w-5 text-ink-faint" />
      </div>
      <p className="font-display text-sm font-semibold text-ink">{title}</p>
      {/* max-w-[280px] sur mobile puis max-w-sm sur PC pour éviter que la description ne colle trop aux bords de l'écran */}
      {description && (
        <p className="max-w-[280px] sm:max-w-sm text-sm text-ink-muted break-words">
          {description}
        </p>
      )}
      {action && <div className="mt-2 w-full sm:w-auto">{action}</div>}
    </div>
  );
}

export function ErrorState({ message, onRetry }) {
  return (
    <div className="flex flex-col items-center gap-3 px-4 md:px-6 py-10 md:py-14 text-center">
      <p className="text-sm font-medium text-cardio-500 max-w-[280px] sm:max-w-sm break-words">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry} 
          // Ajout d'un léger padding vertical/horizontal et d'un fond subtil au survol/clic pour améliorer la réactivité tactile
          className="text-sm font-semibold text-pulse-500 hover:underline active:bg-pulse-50 px-3 py-1.5 rounded-lg transition-colors"
        >
          Réessayer
        </button>
      )}
    </div>
  );
}