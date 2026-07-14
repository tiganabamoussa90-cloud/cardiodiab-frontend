import { useState } from "react";
import { Outlet } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Sidebar } from "./Sidebar";
import { useAuth } from "../../hooks/useAuth";
import { GradientMesh } from "../decor/GradientMesh";

export function AppShell() {
  const { role } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative flex h-screen overflow-hidden bg-clinical">
      <GradientMesh variant="subtle" fixed animated={false} className="no-print" />

      {/* ── Sidebar desktop — toujours visible sur lg+ ── */}
      <div className="hidden lg:block">
        <Sidebar role={role} />
      </div>

      {/* ── Sidebar mobile — s'ouvre en overlay ── */}
      {sidebarOpen && (
        <>
          {/* Fond sombre derrière la sidebar */}
          <div
            className="fixed inset-0 z-30 bg-ink/40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
          {/* La sidebar elle-même */}
          <div className="fixed inset-y-0 left-0 z-40 lg:hidden">
            <Sidebar role={role} onClose={() => setSidebarOpen(false)} />
          </div>
        </>
      )}

      {/* ── Contenu principal ── */}
      <main className="relative z-10 flex flex-1 flex-col overflow-y-auto">

        {/* Barre mobile avec bouton hamburger — masquée sur desktop */}
        <div className="flex items-center gap-3 border-b border-border bg-clinical/80 px-4 py-3 backdrop-blur-sm lg:hidden no-print">
          <button
            onClick={() => setSidebarOpen(true)}
            aria-label="Ouvrir le menu"
            className="rounded-lg p-1.5 text-ink-muted hover:bg-surface-sunken"
          >
            <Menu className="h-5 w-5" />
          </button>
          <span className="font-display text-sm font-semibold text-ink">
            CardioDiab Predict
          </span>
        </div>

        <Outlet />
      </main>
    </div>
  );
}