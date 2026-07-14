import { X } from "lucide-react";

export function Modal({ open, onClose, title, children, footer, width = "max-w-lg" }) {
  if (!open) return null;

  return (
    // 1. Sur mobile : On aligne en bas de l'écran (items-end) et on supprime le padding p-4 pour coller aux bords (p-0). 
    // Sur PC : On recentre tout proprement (sm:items-center sm:p-4)
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-ink/40 p-0 sm:p-4 no-print transition-all">
      
      {/* Fond sombre cliquable pour fermer la modale en touchant à côté (facultatif mais super ergonomique) */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />

      <div
        // 2. Sur mobile : coins arrondis uniquement en haut (rounded-t-2xl sm:rounded-xl2), largeur maximale d'office (w-full).
        // Hauteur max légèrement réduite à 85vh pour laisser l'utilisateur voir qu'il est sur une modale, ou 90vh sur PC.
        className={`w-full ${width} rounded-t-2xl sm:rounded-xl2 bg-surface shadow-card max-h-[85vh] sm:max-h-[90vh] flex flex-col overflow-hidden`}
      >
        {/* En-tête : on réduit un peu le padding sur mobile (p-4 sm:p-5) */}
        <div className="flex items-center justify-between border-b border-border p-4 sm:p-5">
          <h3 className="font-display text-base font-semibold text-ink">{title}</h3>
          <button
            onClick={onClose}
            aria-label="Fermer"
            // Zone tactile plus large pour le bouton fermer sur mobile
            className="rounded-lg p-2 sm:p-1.5 text-ink-muted hover:bg-surface-sunken focus:outline-none focus:ring-2 focus:ring-pulse-100"
          >
            <X className="h-5 w-5 sm:h-4 sm:h-4" />
          </button>
        </div>

        {/* Corps de la modale : rendu défilant individuellement (overflow-y-auto) pour ne pas casser l'en-tête et le pied de page */}
        <div className="p-4 sm:p-5 overflow-y-auto flex-1">
          {children}
        </div>

        {/* Pied de page : Boutons d'action. 
            flex-col-reverse sur mobile : le bouton principal (souvent à droite sur PC) se retrouve EN HAUT, 
            très facile d'accès pour le pouce, et le bouton "Annuler" se retrouve en bas. */}
        {footer && (
          <div className="flex flex-col-reverse sm:flex-row justify-end gap-2 border-t border-border p-4">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}