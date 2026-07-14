import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Headset } from "lucide-react"; 
import { useAction } from "../../hooks/useApi";
import { Button } from "../../components/ui/Button";
import { Field, Input } from "../../components/ui/Field";
import { Navbar } from "../../components/layout/Navbar";
import { GradientMesh } from "../../components/decor/GradientMesh";
import { authService } from "../../services/authService";

export default function RegisterAgentPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom_agent: "",
    prenom_agent: "",
    matricule: "",
    service_affectation: "",
    email: "",
    mot_de_passe: "",
    telephone: "",
  });

  const [confirmation, setConfirmation] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const [submit, { isLoading, error }] = useAction(async () => {
    const res = await authService.registerAgent(form);
    setConfirmation(res.message);
  });

  // ── Écran de confirmation après soumission réussie ────────────────────────
  if (confirmation) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-clinical">
        <GradientMesh variant="subtle" animated={false} className="no-print" />
        <Navbar />
        <div className="relative flex flex-1 items-center justify-center px-4">
          {/* Correction : max-w-md & rounded-2xl */}
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-card flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pulse-500 text-white">
              <Headset className="h-6 w-6" />
            </div>
            <h2 className="font-display text-lg font-semibold text-ink">Demande envoyée</h2>
            {/* Correction : text-sm */}
            <p className="mt-2 text-sm text-ink-muted">{confirmation}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Un administrateur doit approuver votre <br/>compte avant votre première connexion.
            </p>
            <Button className="mt-6 w-full" onClick={() => navigate("/login")}>
              Retour à la connexion
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // ── Formulaire d'inscription actif ─────────────────────────────────────────
  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden bg-clinical">
      <GradientMesh variant="subtle" animated={false} className="no-print" />
      <Navbar />
      <div className="relative flex flex-1 items-center justify-center px-4 py-10">
        <div className="w-full max-w-lg">
          <div className="mb-7 flex flex-col items-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pulse-500 text-white">
              <Headset className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink">Inscription agent</h1>
            <p className="mt-1 text-sm text-ink-muted">Votre compte sera soumis à validation administrative.</p>
          </div>
          
          {/* Correction : rounded-2xl, border & shadow-card */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              submit().catch(() => {});
            }}
            className="space-y-4 rounded-2xl border border-border bg-surface p-7 shadow-card"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nom" required>
                <Input required placeholder="Ex : Tigana" value={form.nom_agent} onChange={update("nom_agent")} />
              </Field>
              <Field label="Prénom" required>
                <Input required placeholder="Ex : Amine" value={form.prenom_agent} onChange={update("prenom_agent")} />
              </Field>
              <Field label="Matricule" required>
                <Input required placeholder="Ex : 123456" value={form.matricule} onChange={update("matricule")} />
              </Field>
              <Field label="Téléphone" required>
                <Input required placeholder="06XXXXXXXX" value={form.telephone} onChange={update("telephone")} />
              </Field>
            </div>

            <Field label="Service Affectation" required>
              <Input required placeholder="Ex : Consultations Externes" value={form.service_affectation} onChange={update("service_affectation")} />
            </Field>

            <Field label="Adresse e-mail" required>
              <Input type="email" placeholder="agent@cardiodiab.ma" required value={form.email} onChange={update("email")} />
            </Field>

            <Field label="Mot de passe" required>
              <Input 
                type="password"
                required 
                placeholder="••••••••"
                minLength={6}
                value={form.mot_de_passe} 
                onChange={update("mot_de_passe")}
              />
            </Field>

            {/* Correction : font-medium */}
            {error && (
              <p className="font-medium text-sm text-cardio-500">
                {error.message || "Erreur lors de l'inscription"}
              </p>
            )}

            <Button type="submit" className="w-full" isLoading={isLoading}>
              Soumettre ma demande
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-ink-muted">
            Déjà inscrit ?{" "} 
            <Link to="/login" className="font-semibold text-pulse-500 hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}