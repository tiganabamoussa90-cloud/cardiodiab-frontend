import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Stethoscope } from "lucide-react";
import { authService } from "../../services/authService";
import { useAction } from "../../hooks/useApi";
import { Button } from "../../components/ui/Button";
import { Field, Input, Select } from "../../components/ui/Field";
import { Navbar } from "../../components/layout/Navbar";
import { GradientMesh } from "../../components/decor/GradientMesh";

const SPECIALITES = [
  { value: "CARDIOLOGUE", label: "Cardiologue" },
  { value: "DIABETOLOGUE", label: "Diabétologue" },
];

export default function RegisterMedecinPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nom: "",
    prenom: "",
    email: "",
    telephone: "",
    specialite: "CARDIOLOGUE",
    mot_de_passe: "",
    num_ordre_cnom: "",
    code_inpe: "",
  });
  const [confirmation, setConfirmation] = useState(null);

  const update = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const [submit, { isLoading, error }] = useAction(async () => {
    const res = await authService.registerMedecin(form);
    setConfirmation(res.message);
  });

  // ── Écran de confirmation après envoi réussi ────────────────────────────────
  if (confirmation) {
    return (
      <div className="relative flex min-h-screen flex-col overflow-hidden bg-clinical">
        <GradientMesh variant="subtle" animated={false} className="no-print" />
        <Navbar />
        <div className="relative flex flex-1 items-center justify-center px-4">
          {/* Correction : rounded-2xl */}
          <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-card flex flex-col items-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-pulse-500 text-white">
              <Stethoscope className="h-6 w-6" />
            </div>
            <h2 className="font-display text-lg font-semibold text-ink">Demande envoyée</h2>
            <p className="mt-2 text-sm text-ink-muted">{confirmation}</p>
            <p className="mt-1 text-sm text-ink-muted">
              Un administrateur doit approuver votre compte avant votre première connexion.
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
              <Stethoscope className="h-6 w-6" />
            </div>
            <h1 className="font-display text-2xl font-semibold text-ink">Inscription praticien</h1>
            <p className="mt-1 text-sm text-ink-muted">Votre compte sera soumis à validation administrative.</p>
          </div>

          {/* Correction : rounded-2xl */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              submit().catch(() => {});
            }}
            className="space-y-4 rounded-2xl border border-border bg-surface p-7 shadow-card"
          >
            <div className="grid grid-cols-2 gap-4">
              <Field label="Nom" required>
                <Input required placeholder="Ex : Fofana" value={form.nom} onChange={update("nom")} />
              </Field>
              <Field label="Prénom" required>
                <Input required placeholder="Ex : Abdoul" value={form.prenom} onChange={update("prenom")} />
              </Field>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <Field label="N° d'Ordre National" required>
                <Input required placeholder="Ex: 8569" value={form.num_ordre_cnom} onChange={update("num_ordre_cnom")} />
              </Field>
              <Field label="Code INPE" required>
                <Input required placeholder="Ex: 123456789" value={form.code_inpe} onChange={update("code_inpe")} />
              </Field> 
            </div>

            <Field label="Adresse e-mail" required>
              <Input type="email" placeholder="medecin@cardiodiab.ma" required value={form.email} onChange={update("email")} />
            </Field>

            <Field label="Téléphone" required>
              <Input required placeholder="06XXXXXXXX" value={form.telephone} onChange={update("telephone")} />
            </Field>

            <Field label="Spécialité" required>
              <Select required value={form.specialite} onChange={update("specialite")}>
                {SPECIALITES.map((s) => (
                  <option key={s.value} value={s.value}>
                    {s.label}
                  </option>
                ))}
              </Select>
            </Field>

            <Field label="Mot de passe" required>
              <Input
                type="password"
                required
                minLength={6}
                placeholder="••••••••"
                value={form.mot_de_passe}
                onChange={update("mot_de_passe")}
              />
            </Field>

            {error && (
              <p className="text-sm font-medium text-cardio-500">
                {error.message || "Erreur lors de la soumission de la demande."}
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