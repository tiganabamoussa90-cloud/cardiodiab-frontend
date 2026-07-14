import { Link, Navigate } from "react-router-dom";
import {
  HeartPulse,
  Droplet,
  BarChart3,
  ShieldCheck,
  Stethoscope,
  ClipboardList,
  LineChart,
  ArrowRight,
  Navigation,
} from "lucide-react";
import { Button } from "../components/ui/Button";
import { Navbar } from "../components/layout/Navbar";
import { GradientMesh } from "../components/decor/GradientMesh";
import { BioRiskGauge } from "../components/charts/BioRiskGauge";
import { useAuth } from "../hooks/useAuth";
import { homePathForRole } from "../utils/roles";

const STEPS = [
  {
    number: "01",
    title: "Le médecin saisit l'examen",
    description:
      "Constantes morphologiques, tension, cholestérol, glycémie, etc... — la même consultation que d'habitude.",
    icon: ClipboardList,
  },
  {
    number: "02",
    title: "Les deux modèles calculent un score",
    description:
      "Régression logistique pour le risque cardiovasculaire, LGBMClassifier (basé sur arbres de décision) pour le risque diabétique — en moins d'une seconde.",
    icon: BarChart3,
  },
  {
    number: "03",
    title: "Le patient suit son évolution",
    description:
      "Timeline des scores, IMC, recommandations du médecin : un espace personnel pour comprendre, pas juste consulter.",
    icon: LineChart,
  },
];

const FEATURES = [
  {
    icon: HeartPulse,
    title: "Double prédiction",
    description: "Un score de risque cardiovasculaire et un score de risque diabétique, calculés à chaque consultation.",
    tone: "cardio",
  },
  {
    icon: BarChart3,
    title: "Explicabilité SHAP",
    description: "Chaque score est accompagné des variables cliniques qui l'ont fait monter ou descendre — pas une boîte noire.",
    tone: "neural",
  },
  {
    icon: Droplet,
    title: "Suivi patient continu",
    description: "Le patient retrouve l'évolution de ses scores, son IMC et les conseils de son médecin dans un espace dédié.",
    tone: "diabete",
  },
  {
    icon: ShieldCheck,
    title: "Accès par rôle",
    description: "Généraliste, cardiologue, diabétologue, patient, administrateur : chacun ne voit que ce qui le concerne.",
    tone: "pulse",
  },
];

const FEATURE_TONE_CLASS = {
  cardio: "bg-cardio-50 text-cardio-600",
  diabete: "bg-diabete-50 text-diabete-600",
  neural: "bg-neural-50 text-neural-ink",
  pulse: "bg-pulse-50 text-pulse-600",
};

export default function LandingPage() {
  const { isAuthenticated, role } = useAuth();
  if (isAuthenticated) return <Navigate to={homePathForRole(role)} replace />;

  return (
    <div className="relative overflow-x-hidden bg-clinical">
      <Navbar sections />
      <Hero />
      <HowItWorks />
      <Features />
      <CallToAction />
      <SiteFooter />
    </div>
  );
}

function Hero() {
  return (
    <section className="relative px-4 sm:px-10 pb-16 pt-10 sm:pt-16">
      <GradientMesh variant="hero" />
      <div className="relative mx-auto grid max-w-6xl items-center gap-10 lg:gap-14 lg:grid-cols-2">
        <div className="text-left">
          <span className="label-eyebrow text-pulse-600 text-xs sm:text-sm font-semibold tracking-wider uppercase">
            Aide à la décision clinique
          </span>
          <h1 className="mt-4 font-display text-3xl sm:text-5xl font-semibold leading-tight text-ink">
            Deux risques, lus
            <br />
            d'un seul regard.
          </h1>
          <p className="mt-5 max-w-md text-sm sm:text-base leading-relaxed text-ink-muted">
            CardioDiab Predict associe vos données cliniques à deux modèles prédictifs —
            risque cardiovasculaire et risque diabétique — et explique chaque score
            variable par variable, pour le médecin comme pour le patient.
          </p>
          
          {/* MODIFICATION : Boutons étirés sur mobile pour une cible tactile optimale */}
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/register-medecin" className="w-full sm:w-auto">
              <Button size="lg" className="w-full justify-center">
                Créer un compte praticien <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
            <Link to="/register-agent" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full justify-center">
                Créer un compte agent <Navigation className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* MODIFICATION : Marges et tailles ajustées pour éviter les débordements sur petit écran */}
        <div className="relative mx-auto w-full max-w-sm px-2 sm:px-0 mt-6 lg:mt-0">
          <div className="rounded-xl2 border border-white/60 bg-white/70 p-5 sm:p-6 shadow-card backdrop-blur-xl">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <p className="text-[10px] sm:text-xs text-ink-faint">Consultation du 12/06/2026</p>
                <p className="font-display text-xs sm:text-sm font-semibold text-ink">Dossier patient #0427</p>
              </div>
              <Stethoscope className="h-5 w-5 text-pulse-400" />
            </div>
            <div className="flex items-center justify-center py-2">
              <BioRiskGauge cardioScore={32} diabeteScore={14} size={190} />
            </div>
          </div>
          
          {/* MODIFICATION : Remplacement de -left-5 par left-2 sur mobile pour éviter le scroll horizontal */}
          <div className="absolute -bottom-5 left-2 sm:-left-5 rounded-xl border border-white/60 bg-white/80 px-4 py-2.5 shadow-card backdrop-blur-xl">
            <p className="text-[10px] sm:text-[11px] text-ink-faint">Variable la plus influente</p>
            <p className="text-xs sm:text-sm font-semibold text-pulse-600">Pression artérielle</p>
          </div>
        </div>
      </div>
    </section>
  );
}

function HowItWorks() {
  return (
    <section id="comment-ca-marche" className="border-y border-border bg-surface px-4 sm:px-10 py-16">
      <div className="mx-auto max-w-6xl"> 
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink">Comment ça marche</h2>
        <p className="mt-2 max-w-xl text-xs sm:text-sm text-ink-muted">
          Trois étapes, du même geste clinique qu'aujourd'hui à un suivi que le patient comprend.
        </p>
        <div className="mt-10 grid gap-8 grid-cols-1 sm:grid-cols-3">
          {STEPS.map((step) => (
            <div key={step.number} className="flex flex-col items-start">
              <div className="flex items-center gap-3">
                <span className="font-display text-xs sm:text-sm font-semibold text-neural-ink bg-neural-50 rounded-full px-2.5 py-1">
                  {step.number}
                </span>
                <step.icon className="h-4 w-4 text-pulse-500" />
              </div>
              <h3 className="mt-4 font-display text-sm sm:text-base font-semibold text-ink">{step.title}</h3>
              <p className="mt-2 text-xs sm:text-sm leading-relaxed text-ink-muted">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Features() {
  return (
    <section id="fonctionnalites" className="px-4 sm:px-10 py-16">
      <div className="mx-auto max-w-6xl"> 
        <h2 className="font-display text-xl sm:text-2xl font-semibold text-ink">Conçu pour la pratique clinique</h2>
        <div className="mt-10 grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
          {FEATURES.map((f) => (
            <div key={f.title} className="rounded-xl2 border border-border bg-white/70 p-5 shadow-card hover:shadow-md transition-shadow duration-250">
              <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${FEATURE_TONE_CLASS[f.tone]}`}>
                <f.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-display text-xs sm:text-sm font-semibold text-ink">{f.title}</h3>
              <p className="mt-1.5 text-xs sm:text-sm leading-relaxed text-ink-muted">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CallToAction() {
  return (
    <section className="px-4 sm:px-10 pb-20">
      <div className="relative mx-auto max-w-6xl overflow-hidden rounded-xl2 bg-pulse-900 px-6 sm:px-16 py-12 text-center">
        <GradientMesh variant="cta" />
        <div className="relative z-10">
          <h2 className="font-display text-xl sm:text-3xl font-semibold text-white">
            Prêt à intégrer la prédiction à votre pratique ?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-xs sm:text-sm text-white/70">
            L'inscription praticien est soumise à validation par un administrateur de votre établissement.
          </p>
          
          {/* MODIFICATION : Boutons empilés proprement sur mobile, alignés sur PC */}
          <div className="mt-7 flex flex-col sm:flex-row justify-center gap-3">
            <Link to="/register-medecin" className="w-full sm:w-auto">
              <Button variant="primary" size="lg" className="w-full justify-center">
                Inscription praticien
              </Button>
            </Link>
            <Link to="/login" className="w-full sm:w-auto">
              <Button size="lg" variant="ghost" className="text-white hover:bg-white/10 ">
                J'ai déjà un compte
              </Button>
            </Link> 
          </div>
        </div>
      </div>
    </section>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-border px-4 sm:px-10 py-8 text-center text-[10px] sm:text-xs text-ink-faint">
      CardioDiab Predict — outil d'aide à la décision clinique. Ne remplace pas un avis médical direct.
    </footer>
  );
}