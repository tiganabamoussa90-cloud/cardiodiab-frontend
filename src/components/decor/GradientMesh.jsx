const VARIANTS = {
  hero: [
    "absolute -top-16 -right-8 h-[220px] w-[220px] sm:-top-32 sm:-right-16 sm:h-[420px] sm:w-[420px] rounded-full bg-pulse-400/[0.14] blur-[80px] sm:blur-[110px]",
    "absolute top-16 -left-12 h-[180px] w-[180px] sm:top-32 sm:-left-28 sm:h-[340px] sm:w-[340px] rounded-full bg-neural/[0.16] blur-[70px] sm:blur-[100px]",
  ],
  cta: [
    "absolute -top-8 left-1/4 h-[160px] w-[160px] sm:-top-16 sm:h-[280px] sm:w-[280px] rounded-full bg-neural/[0.22] blur-[70px] sm:blur-[100px]",
    "absolute -bottom-8 right-1/4 h-[140px] w-[140px] sm:-bottom-16 sm:h-[240px] sm:w-[240px] rounded-full bg-pulse-400/[0.18] blur-[60px] sm:blur-[100px]",
  ],
  subtle: [
    "absolute top-0 right-0 h-[180px] w-[180px] sm:h-[320px] sm:w-[320px] rounded-full bg-pulse-400/[0.05] blur-[80px] sm:blur-[120px]",
    "absolute bottom-0 left-0 h-[140px] w-[140px] sm:h-[260px] sm:w-[260px] rounded-full bg-neural/[0.04] blur-[70px] sm:blur-[120px]",
  ],
};

export function GradientMesh({ variant = "hero", fixed = false, animated = true, className = "" }) {
  const blobs = VARIANTS[variant] || VARIANTS.hero;
  const positionClass = fixed ? "fixed inset-0" : "absolute inset-0";

  return (
    <div className={`pointer-events-none ${positionClass} overflow-hidden ${className}`} aria-hidden="true">
      {blobs.map((blobClass, i) => (
        <div
          key={i}
          className={`${blobClass} ${animated ? "mesh-blob" : ""}`}
          style={{ animationDelay: `${i * -7}s` }}
        />
      ))}
    </div>
  );
}