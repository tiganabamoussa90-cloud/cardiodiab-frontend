import { useState } from "react";
import { KeyRound } from "lucide-react";
import { Modal } from "../../components/ui/Modal";
import { Field, Input } from "../../components/ui/Field";
import { Button } from "../../components/ui/Button";
import { useAction } from "../../hooks/useApi";
import { useToast } from "../../hooks/useToast";
import { patientService } from "../../services/patientService";

const INITIAL_STATE = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

export default function ChangePasswordModal({ open, onClose }) {
  const [form, setForm] = useState(INITIAL_STATE);
  const [validationError, setValidationError] = useState("");
  const toast = useToast();

  const update = (field) => (e) => {
    setForm((f) => ({ ...f, [field]: e.target.value }));
    if (validationError) setValidationError("");
  };

  const handleClose = () => {
    setForm(INITIAL_STATE);
    setValidationError("");
    onClose();
  };

  const [submitChange, { isLoading, error: apiError }] = useAction(async () => {
    if (form.newPassword !== form.confirmPassword) {
      setValidationError("Les nouveaux mots de passe ne correspondent pas.");
      return;
    }

    if (form.newPassword.length < 6) {
      setValidationError("Le nouveau mot de passe doit contenir au moins 6 caractères.");
      return;
    }

    const payload = {
    ancien_mot_de_passe: form.currentPassword,   // ✅ Correspond à Pydantic
    nouveau_mot_de_passe: form.newPassword,     // ✅ Correspond à Pydantic
  };

    const res = await patientService.modifierMotDePasse(payload);
    toast.success(res.message || "Votre mot de passe a bien été mis à jour.");
    handleClose();
  });

  return (
    <Modal open={open} onClose={handleClose} title="Modifier mon mot de passe">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          submitChange().catch(() => {});
        }}
        className="space-y-4"
      >
        <div className="flex justify-center py-2">
          <div className="rounded-full bg-pulse-50 p-3 ring-8 ring-pulse-50/50">
            <KeyRound className="h-6 w-6 text-pulse-500" />
          </div>
        </div>

        <Field label="Mot de passe actuel" required>
          <Input
            type="password"
            required
            value={form.currentPassword}
            onChange={update("currentPassword")}
            placeholder="••••••••"
          />
        </Field>

        <hr className="border-border my-2" />

        <Field label="Nouveau mot de passe" required hint="Minimum 6 caractères">
          <Input
            type="password"
            required
            value={form.newPassword}
            onChange={update("newPassword")}
            placeholder="••••••••"
          />
        </Field>

        <Field label="Confirmer le nouveau mot de passe" required>
          <Input
            type="password"
            required
            value={form.confirmPassword}
            onChange={update("confirmPassword")}
            placeholder="••••••••"
          />
        </Field>

        {/* Remplacement du bloc d'erreur en bas du formulaire */}
        {(validationError || apiError) && (
        <div className="rounded-md bg-red-50 p-3 ring-1 ring-red-200">
            <p className="text-sm font-medium text-red-800">
            {validationError || (
                typeof apiError === "string" 
                ? apiError 
                : apiError?.response?.data?.detail // Si l'erreur vient d'Axios/FastAPI classique
                    ? (typeof apiError.response.data.detail === "string" 
                        ? apiError.response.data.detail 
                        : JSON.stringify(apiError.response.data.detail))
                    : apiError?.message || "Une erreur est survenue."
            )}
            </p>
        </div>
        )}

        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="ghost" onClick={handleClose}>
            Annuler
          </Button>
          <Button type="submit" isLoading={isLoading}>
            Mettre à jour
          </Button>
        </div>
      </form>
    </Modal>
  );
}