import { useState } from "react";
import { Copy, Check, Printer, UserPlus } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Field, Input, Select } from "../../components/ui/Field";
import { useAction } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import { agentService } from "../../services/agentService";

// ── Constantes ────────────────────────────────────────────────────────────────

const EMPTY_PATIENT = {
  nom: "",
  prenom: "",
  email: "",
  telephone: "",
  date_naissance: "",
  gender: 1, // ✅ Initialisé directement en tant que Number pour correspondre à l'API
  cin: "",
  couverture_medicale: "AMO",
};

const COUVERTURES = [
  { value: "AMO",             label: "AMO — Assurance Maladie Obligatoire" },
  { value: "MUTUELLE",        label: "Mutuelle" },
  { value: "SANS_COUVERTURE", label: "Sans couverture médicale" },
];

// ── Page principale ───────────────────────────────────────────────────────────

export default function AgentOverviewPage() {
  const toast = useToast();
  const [form, setForm] = useState(EMPTY_PATIENT);
  const [newCredentials, setNewCredentials] = useState(null);

  // Gestion dynamique des entrées du formulaire
  const update = (field) => (e) => {
    const val = field === "gender" ? Number(e.target.value) : e.target.value;
    setForm((f) => ({ ...f, [field]: val }));
  };

  const [createPatient, { isLoading: isCreating, error: createError }] =
    useAction(async () => {
      // ✅ Le payload utilise directement les types propres
      const res = await agentService.creerPatient(form);
      setNewCredentials(res.details);
      toast.success(res.message);
      setForm(EMPTY_PATIENT);
    });

  return (
    <div>
      <Topbar
        title="Espace Agent d'admission"
        subtitle="Créez un dossier patient et transmettez-lui ses identifiants"
      />

      <div className="p-8 max-w-2xl">
        {newCredentials ? (
          // ── Affichage des identifiants après création ──
          <Card className="print-target">
            <CardHeader
              title="Dossier créé avec succès"
            />
            <CardBody>
              <CreatedCredentials
                credentials={newCredentials}
                onDone={() => setNewCredentials(null)}
              />
            </CardBody>
          </Card>
        ) : (
          // ── Formulaire de création ──
          <Card className="print:hidden">
            <CardHeader
              title="Nouveau dossier patient"
              subtitle="Remplissez les informations administratives du patient"
              action={<UserPlus className="h-5 w-5 text-pulse-500" />}
            />
            <CardBody>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  createPatient().catch(() => {});
                }}
                className="space-y-4"
              >
                {/* Identité */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Nom" required>
                    <Input
                      required
                      placeholder="Ex : Dupont"
                      value={form.nom}
                      onChange={update("nom")}
                    />
                  </Field>
                  <Field label="Prénom" required>
                    <Input
                      required
                      placeholder="Ex : Hassan"
                      value={form.prenom}
                      onChange={update("prenom")}
                    />
                  </Field>
                </div>

                {/* Contact */}
                <Field label="Adresse e-mail" required>
                  <Input
                    type="email"
                    required
                    placeholder="patient@exemple.ma"
                    value={form.email}
                    onChange={update("email")}
                  />
                </Field>
                <Field label="Téléphone" required>
                  <Input
                    required
                    placeholder="06XXXXXXXX"
                    value={form.telephone}
                    onChange={update("telephone")}
                  />
                </Field>

                {/* Naissance & Genre */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="Date de naissance" required>
                    <Input
                      type="date"
                      required
                      value={form.date_naissance}
                      onChange={update("date_naissance")}
                    />
                  </Field>
                  <Field label="Sexe" required>
                    <Select value={form.gender} onChange={update("gender")}>
                      <option value={1}>Femme</option>
                      <option value={2}>Homme</option>
                    </Select>
                  </Field>
                </div>

                {/* Administratif */}
                <div className="grid grid-cols-2 gap-4">
                  <Field label="CIN" required hint="Carte d'identité nationale">
                    <Input
                      required
                      placeholder="Ex : AB123456"
                      value={form.cin}
                      onChange={update("cin")}
                    />
                  </Field>
                  <Field label="Couverture médicale" required>
                    <Select
                      value={form.couverture_medicale}
                      onChange={update("couverture_medicale")}
                    >
                      {COUVERTURES.map((c) => (
                        <option key={c.value} value={c.value}>
                          {c.label}
                        </option>
                      ))}
                    </Select>
                  </Field>
                </div>

                {createError && (
                  <p className="text-sm font-medium text-cardio-500">
                    {createError}
                  </p>
                )}

                <div className="flex justify-end gap-2 pt-2">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => setForm(EMPTY_PATIENT)}
                  >
                    Réinitialiser
                  </Button>
                  <Button type="submit" isLoading={isCreating}>
                    Créer le dossier
                  </Button>
                </div>
              </form>
            </CardBody>
          </Card>
        )}
      </div>
    </div>
  );
}

// ── Composant d'affichage des identifiants (Inclus dans le même fichier) ──────

function CreatedCredentials({ credentials, onDone }) {
  const [copied, setCopied] = useState(false);

  const text =
    `Identifiant Permanent du Patient (IPP) : ${credentials.ipp_genere}\n` +
    `Mot de passe temporaire : ${credentials.mot_de_passe}`;

  const handleCopy = () => {
    navigator.clipboard?.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    // Injecter un style CSS temporaire pour masquer le reste de l'interface lors de l'impression
    const style = document.createElement("style");
    style.innerHTML = `
      @media print {
        body * { visibility: hidden; }
        .print-target, .print-target * { visibility: visible; }
        .print-target { position: absolute; left: 0; top: 0; width: 100%; border: none; box-shadow: none; }
        .print-actions { display: none !important; }
      }
    `;
    document.head.appendChild(style);
    window.print();
    document.head.removeChild(style);
  };

  return (
    <div className="space-y-4">
      {/* Style d'explication corrigé */}
      <p className="text-sm text-ink-muted">
        Veuillez remettre ces accès au patient. Il utilisera son <strong>IPP</strong> comme 
        identifiant de connexion et le <strong>mot de passe associé</strong> ci-dessous 
        pour sa première connexion.
      </p>

      {/* Bloc identifiants */}
      <div className="rounded-lg border border-border bg-surface-sunken p-4 font-mono text-sm space-y-1">
        <p>
          IPP :{" "}
          <span className="font-semibold text-pulse-600">
            {credentials.ipp_genere}
          </span>
        </p>
        <p>
          Mot de passe :{" "}
          <span className="font-semibold text-pulse-600">
            {credentials.mot_de_passe}
          </span>
        </p>
      </div>

      {/* Actions (Serrées dans un conteneur masqué à l'impression) */}
      <div className="flex gap-2 print-actions">
        <Button variant="secondary" size="sm" onClick={handleCopy}>
          {copied ? (
            <Check className="h-4 w-4" />
          ) : (
            <Copy className="h-4 w-4" />
          )}
          {copied ? "Copié !" : "Copier les identifiants"}
        </Button>

        <Button variant="secondary" size="sm" onClick={handlePrint}>
          <Printer className="h-4 w-4" /> Imprimer le ticket
        </Button>
      </div>

      <div className="flex justify-end pt-2 border-t border-border print-actions">
        <Button onClick={onDone}>
          <UserPlus className="h-4 w-4 animate-pulse" /> Nouveau patient
        </Button>
      </div>
    </div>
  );
}