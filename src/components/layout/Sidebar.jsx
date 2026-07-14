// Sidebar.jsx
import { NavLink } from "react-router-dom";
import { HeartPulse, LayoutDashboard, Users, ShieldCheck, ScrollText, X } from "lucide-react";
import { ROLES } from "../../utils/roles";

const NAV_BY_ROLE = {
  medecin: [
    { to: "/medecin",          label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
    { to: "/medecin/patients", label: "Patients",        icon: Users },
  ],
  patient: [{ to: "/patient", label: "Mon suivi",       icon: LayoutDashboard, end: true }],
  admin: [
    { to: "/admin",      label: "Vue d'ensemble", icon: LayoutDashboard, end: true },
    { to: "/admin/logs", label: "Journal d'audit", icon: ScrollText },
  ],
  agent: [{ to: "/agent", label: "Créer patients", icon: Users, end: true }],
};

function groupForRole(role) {
  if (role === ROLES.PATIENT) return "patient";
  if (role === ROLES.ADMIN)   return "admin";
  if (role === ROLES.AGENT)   return "agent";
  return "medecin";
}

export function Sidebar({ role, onClose }) {
  const items = NAV_BY_ROLE[groupForRole(role)];

  return (
    <aside className="no-print flex h-screen w-64 shrink-0 flex-col bg-pulse-900 text-white/90">

      {/* Header */}
      <div className="flex items-center justify-between px-6 py-6">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neural text-pulse-900">
            <HeartPulse className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-sm font-semibold leading-tight text-white">CardioDiab</p>
            <p className="text-[11px] uppercase tracking-wider text-white/50">Predict</p>
          </div>
        </div>

        {/* Bouton fermer — mobile uniquement */}
        {onClose && (
          <button
            onClick={onClose}
            aria-label="Fermer le menu"
            className="rounded-lg p-1.5 text-white/60 hover:bg-white/10 lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3">
        {items.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            onClick={onClose}  // ferme le menu mobile après navigation
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-white/10 text-white"
                  : "text-white/60 hover:bg-white/5 hover:text-white"
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="flex items-center gap-2 px-6 py-5 text-xs text-white/40">
        <ShieldCheck className="h-3.5 w-3.5" />
        Données cliniques chiffrées
      </div>
    </aside>
  );
}