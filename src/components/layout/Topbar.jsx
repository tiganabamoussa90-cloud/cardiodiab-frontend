// Topbar.jsx
import { LogOut } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { ROLE_LABELS } from "../../utils/roles";
import { Badge } from "../ui/Badge";

export function Topbar({ title, subtitle, actions }) {
  const { role, logout } = useAuth();

  return (
    <header className="no-print flex items-center justify-between border-b border-border bg-clinical/80 px-4 py-4 backdrop-blur-sm sm:px-8 sm:py-5">

      {/* Titre + sous-titre */}
      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-base font-semibold text-ink sm:text-xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-0.5 hidden truncate text-sm text-ink-muted sm:block">
            {subtitle}
          </p>
        )}
      </div>

      {/* Actions + badge + déconnexion */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">

        {/* Actions passées en prop — masquées sur très petit écran */}
        {actions && (
          <div className=" items-center gap-2">
            {actions}
          </div>
        )}

        {/* Badge rôle — masqué sur mobile */}
        <span className="hidden sm:block">
          <Badge tone="pulse">{ROLE_LABELS[role] || role}</Badge>
        </span>

        {/* Bouton déconnexion — icône seule sur mobile, texte sur desktop */}
        <button
          onClick={logout}
          className="flex items-center gap-1.5 rounded-lg px-2 py-2 text-sm font-medium text-ink-muted hover:bg-surface-sunken sm:px-3"
          aria-label="Se déconnecter"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Déconnexion</span>
        </button>
      </div>
    </header>
  );
}