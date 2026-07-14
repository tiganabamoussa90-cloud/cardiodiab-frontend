import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { HeartPulse, Menu, X } from "lucide-react";
import { Button } from "../ui/Button";

const SECTION_LINKS = [
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#fonctionnalites",   label: "Fonctionnalités"   },
];

export function Navbar({ sections = false }) {
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen]         = useState(false);

  const onLogin        = location.pathname === "/login";
  const onRegistermed  = location.pathname === "/register-medecin";
  const onRegisteragent= location.pathname === "/register-agent";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Ferme le menu mobile à chaque changement de route
  useEffect(() => { setOpen(false); }, [location.pathname]);

  return (
    <header
      className={`no-print sticky top-0 z-40 transition-colors duration-200 ${
        scrolled || !sections
          ? "border-b border-border bg-white/80 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-10">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-pulse-500 text-white sm:h-9 sm:w-9">
            <HeartPulse className="h-4 w-4 sm:h-5 sm:w-5" />
          </div>
          {/* Nom complet sur sm+, abrégé sur mobile */}
          <span className="hidden font-display text-base font-semibold text-ink sm:block">
            CardioDiab Predict
          </span>
          <span className="font-display text-sm font-semibold text-ink sm:hidden">
            CardioDiab
          </span>
        </Link>

        {/* Nav desktop */}
        <nav className="hidden items-center gap-7 sm:flex">
          {sections ? (
            SECTION_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="text-sm font-medium text-ink-muted hover:text-ink">
                {l.label}
              </a>
            ))
          ) : (
            <Link to="/" className="text-sm font-medium text-ink-muted hover:text-ink">
              Accueil
            </Link>
          )}
        </nav>

        {/* Boutons desktop */}
        <div className="hidden items-center gap-2 sm:flex">
          {!onLogin && (
            <Link to="/login">
              <Button variant="ghost" size="sm">Se connecter</Button>
            </Link>
          )}
          {!onRegistermed && (
            <Link to="/register-medecin">
              <Button size="sm">Espace praticien</Button>
            </Link>
          )}
          {!onRegisteragent && (
            <Link to="/register-agent">
              <Button size="sm">Espace agent</Button>
            </Link>
          )}
        </div>

        {/* Hamburger mobile */}
        <button
          className="sm:hidden rounded-lg p-1.5 text-ink-muted hover:bg-surface-sunken"
          onClick={() => setOpen((o) => !o)}
          aria-label="Ouvrir le menu"
        >
          {open
            ? <X    className="h-5 w-5 text-ink" />
            : <Menu className="h-5 w-5 text-ink" />
          }
        </button>
      </div>

      {/* Menu mobile déroulant */}
      {open && (
        <div className="border-t border-border bg-white px-6 py-4 sm:hidden">
          <div className="flex flex-col gap-3">

            {/* Liens de section (landing page) */}
            {sections
              ? SECTION_LINKS.map((l) => (
                  <a 
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className="text-sm font-medium text-ink-muted"
                  >
                    {l.label}
                  </a>
                ))
              : ( <div className="flex flex-col gap-3 items-center justify-center">
                  <Link to="/" onClick={() => setOpen(false)} className="items-center text-sm font-medium text-white bg-pulse-500 rounded-lg">
                    Accueil
                  </Link>
                  </div>
                )
            }

            {/* Séparateur si liens de section + boutons */}
            {sections && <hr className="border-border" />}

            {/* Boutons d'action — masqués si déjà sur la page correspondante */}
            {!onLogin && (
              <Link to="/login" onClick={() => setOpen(false)}>
                <Button variant="secondary" size="sm" className="w-full">
                  Se connecter
                </Button>
              </Link>
            )}
            {!onRegistermed && (
              <Link to="/register-medecin" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">
                  Espace praticien
                </Button>
              </Link>
            )}
            {!onRegisteragent && (
              <Link to="/register-agent" onClick={() => setOpen(false)}>
                <Button size="sm" className="w-full">
                  Espace agent
                </Button>
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}