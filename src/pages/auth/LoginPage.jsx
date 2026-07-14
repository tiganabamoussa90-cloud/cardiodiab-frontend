import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { HeartPulse } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import { useAction } from "../../hooks/useApi";
import { Button } from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Field";
import { Navbar } from "../../components/layout/Navbar";
import { GradientMesh } from "../../components/decor/GradientMesh";
import { homePathForRole } from "../../utils/roles";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [motDePasse, setMotDePasse] = useState("");

  const [doLogin, { isLoading, error }] = useAction(async () => {
    const session = await login(email, motDePasse);
    const redirectTo = location.state?.from?.pathname || homePathForRole(session.role);
    navigate(redirectTo, { replace: true });
  });

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-clinical">
      <GradientMesh variant="subtle" animated={false} className="no-print" />
      <Navbar />
      
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-md">
          {/* En-tête de la carte de connexion */}
          <div className="mb-8 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pulse-500 text-white animate-pulse">
              <HeartPulse className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink">CardioDiab Predict</h1>
            <p className="mt-1 text-sm text-ink-muted">
              Plateforme d'aide au diagnostic cardiovasculaire et métabolique
            </p>
          </div>

          {/* Formulaire - Correction de rounded-xl2 vers rounded-2xl */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              doLogin().catch(() => {});
            }}
            className="space-y-4 rounded-2xl border border-border bg-surface p-7 shadow-card"
          >
            <Field label="Adresse e-mail" required>
              <Input
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="medecin@cardiodiab.ma"
              />
            </Field>

            <Field label="Mot de passe" required>
              <Input
                type="password"
                required
                value={motDePasse}
                onChange={(e) => setMotDePasse(e.target.value)}
                placeholder="••••••••"
              />
            </Field>

            {error && (
              <p className="text-sm font-medium text-cardio-500 animate-shake">
                {error}
              </p>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Se connecter
            </Button>
          </form>

          {/* Liens d'inscription */}
          <div className="mt-6 space-y-2 text-center text-sm text-ink-muted">
            <p>
              Vous êtes médecin et n'avez pas encore de compte ?{" "}
              <Link to="/register-medecin" className="font-semibold text-pulse-500 hover:underline">
                Inscription praticien
              </Link>
            </p>
            <p>
              Vous êtes agent d'admission et n'avez pas encore de compte ?{" "}
              <Link to="/register-agent" className="font-semibold text-pulse-500 hover:underline">
                Inscription agent
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}