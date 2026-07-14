// The backend returns a single `role` string from /auth/login. For médecins this
// is actually their specialité ( CARDIOLOGUE / DIABETOLOGUE), which is
// what determines what they can see and predict.

export const ROLES = {
  ADMIN: "ADMIN",
  PATIENT: "PATIENT",
  AGENT: "AGENT",
  CARDIOLOGUE: "CARDIOLOGUE",
  DIABETOLOGUE: "DIABETOLOGUE",
};

export const MEDECIN_ROLES = [ ROLES.CARDIOLOGUE, ROLES.DIABETOLOGUE];

export function isMedecin(role) {
  return MEDECIN_ROLES.includes(role);
}

export function homePathForRole(role) {
  if (role === ROLES.ADMIN) return "/admin";
  if (role === ROLES.PATIENT) return "/patient";
  if (role === ROLES.AGENT) return "/agent";
  if (isMedecin(role)) return "/medecin";
  return "/login";
}

export const ROLE_LABELS = {
  AGENT: "Agent d'Admission",
  CARDIOLOGUE: "Cardiologue",
  DIABETOLOGUE: "Diabétologue",
  PATIENT: "Patient",
  ADMIN: "Administrateur",
};

// Which prediction model(s) a médecin role activates server-side.
export function fluxCouvre(role) {
  if (role === ROLES.CARDIOLOGUE) return { cardio: true, diabete: false };
  return { cardio: false, diabete: true };
}
