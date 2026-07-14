import { Loader2 } from "lucide-react";

const VARIANTS = {
  primary: "bg-pulse-500 text-white hover:bg-pulse-600 shadow-sm",
  secondary: "bg-white text-pulse-600 border border-pulse-200 hover:bg-pulse-50",
  ghost: "bg-transparent text-ink-muted hover:bg-surface-sunken",
  danger: "bg-cardio-500 text-white hover:bg-cardio-600",
};

const SIZES = {
  sm: "px-3 py-1.5 text-sm",
  // Augmentation très légère du padding vertical sur md et lg pour une meilleure ergonomie tactile sur mobile
  md: "px-4 py-3 md:py-2.5 text-sm", 
  lg: "px-5 py-4 md:py-3 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  fullWidth = false, // Nouvelle prop magique pour le responsive !
  className = "",
  children,
  disabled,
  ...props
}) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-xl font-display font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed 
        ${VARIANTS[variant]} 
        ${SIZES[size]} 
        ${fullWidth ? "w-full md:w-auto" : ""} 
        ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}