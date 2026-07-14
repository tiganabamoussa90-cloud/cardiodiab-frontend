export function Field({ label, hint, error, required, children }) {
  return (
    <label className="block">
      {/* On garde un texte de label bien lisible */}
      <span className="mb-1.5 block text-sm font-medium text-ink">
        {label}
        {required && <span className="text-cardio-500"> *</span>}
      </span>
      {children}
      {hint && !error && <span className="mt-1 block text-xs text-ink-faint">{hint}</span>}
      {error && <span className="mt-1 block text-xs font-medium text-cardio-500">{error}</span>}
    </label>
  );
}

// MODIFICATIONS de baseInputClass :
// 1. "text-base md:text-sm" -> Force 16px sur mobile (évite le zoom forcé du navigateur) et repasse à 14px sur PC.
// 2. "py-3 md:py-2.5" -> Hauteur de saisie légèrement plus grande sur mobile pour que le pouce ne rate jamais le champ.
const baseInputClass =
  "w-full rounded-lg border border-border bg-white px-3.5 py-3 md:py-2.5 text-base md:text-sm text-ink placeholder:text-ink-faint focus:border-pulse-400 focus:ring-2 focus:ring-pulse-100 transition-colors";

export function Input({ className = "", ...props }) {
  return <input className={`${baseInputClass} ${className}`} {...props} />;
}

export function Select({ className = "", children, ...props }) {
  return (
    <select className={`${baseInputClass} ${className}`} {...props}>
      {children}
    </select>
  );
}

export function Textarea({ className = "", ...props }) {
  return <textarea className={`${baseInputClass} resize-none ${className}`} {...props} />;
}