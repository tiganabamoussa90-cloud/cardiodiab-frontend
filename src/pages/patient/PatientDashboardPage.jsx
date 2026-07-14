import { Link } from "react-router-dom";
import { HeartPulse, Droplet, Cigarette, Wine, Activity, FileText, Heart, ShieldAlert } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardHeader, CardBody } from "../../components/ui/Card";
import { Badge } from "../../components/ui/Badge";
import { Button } from "../../components/ui/Button";
import { Spinner, ErrorState, EmptyState } from "../../components/ui/States";
import { ScoreTimelineChart } from "../../components/charts/ScoreTimelineChart";
import { ImcTrendCard, ScoreTrendCard } from "../../components/charts/ImcTrendCard";
import { useApi } from "../../hooks/useApi";
import { patientService } from "../../services/patientService";
import { formatDate } from "../../utils/formatters";
import { useState, useMemo } from "react";
import ChangePasswordModal from "./ChangePasswordModal"; // 👈 Import de la modale

export default function PatientDashboardPage() {
  const timeline = useApi(patientService.timeline, []);
  const indicateurs = useApi(patientService.indicateurs, []);
  const recommandations = useApi(patientService.recommandations, []);

  // Gestion de la spécialité active
  const [activeTab, setActiveTab] = useState("CARDIOLOGUE");
  
  // 🔐 État d'ouverture pour le changement de mot de passe
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);

  // Mémoïsation des filtrages pour éviter des recalculs inutiles sur mobile
  const { filteredConsultations, lastConsultation, reportableConsultations } = useMemo(() => {
    const rawData = timeline.data || [];
    
    // Filtrage des consultations par spécialité
    const filtered = rawData.filter(
      (c) => c.type_consultation?.toUpperCase() === activeTab.toUpperCase()
    );

    // Récupération de la dernière consultation correspondante
    const last = filtered[filtered.length - 1] || null;

    // Inversion de la liste pour afficher les rapports du plus récent au plus ancien
    const reportable = filtered
      .filter((c) => c.id_consultation)
      .slice()
      .reverse();

    return {
      filteredConsultations: filtered,
      lastConsultation: last,
      reportableConsultations: reportable
    };
  }, [timeline.data, activeTab]);

  // Sélection du score en fonction de l'onglet actif
  const score = activeTab === "CARDIOLOGUE" 
    ? indicateurs.data?.score_cardio 
    : indicateurs.data?.score_diabete;

  // Filtrage des recommandations du médecin par spécialité
  const activeRecommandation = useMemo(() => {
    if (!recommandations.data) return null;
    
    if (Array.isArray(recommandations.data)) {
      return recommandations.data.find(
        (r) => r.specialite?.toUpperCase() === activeTab.toUpperCase()
      );
    }
    
    return recommandations.data.specialite?.toUpperCase() === activeTab.toUpperCase() 
      ? recommandations.data 
      : null;
  }, [recommandations.data, activeTab]);

  return (
    <div>
      {/* 🛡️ Intégration du bouton "Sécurité" dans les actions de la Topbar */}
      <Topbar 
        title="Mon suivi de santé" 
        subtitle="Évolution de vos indicateurs cardiovasculaires et métaboliques" 
        actions={
          <Button variant="secondary" size="sm" onClick={() => setPasswordModalOpen(true)}>
            <ShieldAlert className="h-4 w-4 text-slate-500" /> Sécurité
          </Button>
        }
      />

      {/* 📊 BARRE D'ONGLETS (TABS) */}
      <div className="w-full max-w-md mx-auto mt-6 px-4 sm:px-8">
        <div className="flex p-1 bg-slate-100 rounded-xl border border-slate-200 shadow-sm">
          <button
            onClick={() => setActiveTab("CARDIOLOGUE")}
            className={`flex items-center justify-center gap-2 flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "CARDIOLOGUE"
                ? "bg-white text-cardio-500 shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Heart className="w-4 h-4" />
            Suivi Cardiologie
          </button>
          
          <button
            onClick={() => setActiveTab("DIABETOLOGUE")}
            className={`flex items-center justify-center gap-2 flex-1 py-2 text-sm font-semibold rounded-lg transition-all ${
              activeTab === "DIABETOLOGUE"
                ? "bg-white text-diabete-500 shadow-sm"
                : "text-ink-muted hover:text-ink"
            }`}
          >
            <Activity className="w-4 h-4" />
            Suivi Diabétologie
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 p-4 sm:p-8 lg:grid-cols-3">
        {/* Graphique d'évolution */}
        <Card className="lg:col-span-2">
          <CardHeader 
            title={`Évolution de mon score (${activeTab === "CARDIOLOGUE" ? "Cardio" : "Diabète"})`} 
            subtitle="Historique personnalisé par type de consultation" 
          />
          <CardBody>
            {timeline.isLoading ? (
              <Spinner />
            ) : timeline.error ? (
              <ErrorState message={timeline.error} onRetry={timeline.reload} />
            ) : filteredConsultations.length === 0 ? (
              <p className="py-8 text-center text-sm text-ink-muted">
                Aucun historique en {activeTab.toLowerCase()} pour le moment.
              </p>
            ) : (
              <ScoreTimelineChart data={filteredConsultations} />
            )}
          </CardBody>
        </Card>

        {/* Dernier Examen */}
        <Card>
          <CardHeader title={`Dernier examen - ${activeTab === "CARDIOLOGUE" ? "Cardio" : "Diabète"}`} />
          <CardBody>
            {!lastConsultation ? (
              <p className="text-sm text-ink-muted">Aucun examen enregistré dans ce domaine.</p>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-ink-faint">{formatDate(lastConsultation.date_examen)}</p>
                {activeTab === "CARDIOLOGUE" ? (
                  <div className="flex items-center gap-2">
                    <HeartPulse className="h-4 w-4 text-cardio-500" />
                    <Badge tone="cardio">{lastConsultation.score_cardio ?? "—"}% risque cardio</Badge>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Droplet className="h-4 w-4 text-diabete-500" />
                    <Badge tone="diabete">{lastConsultation.score_diabete ?? "—"}% risque diabète</Badge>
                  </div>
                )}
                <div className="pt-2">
                  {lastConsultation.id_consultation && (
                    <Link to={`/patient/consultations/${lastConsultation.id_consultation}/rapport`}>
                      <Button variant="secondary" size="sm" className="w-full gap-2 justify-center">
                        <FileText className="h-4 w-4" /> Voir le rapport
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Tendances de score */}
        <Card>
          <CardHeader title="Comprendre les tendances" />
          <CardBody>
            {indicateurs.isLoading ? (
              <Spinner />
            ) : indicateurs.error ? (
              <p className="text-sm text-ink-muted">{indicateurs.error}</p>
            ) : (
              <ScoreTrendCard score={score} />
            )}
          </CardBody>
        </Card>

        {/* Corpulence */}
        <Card>
          <CardHeader title="Corpulence" />
          <CardBody>
            {indicateurs.isLoading ? (
              <Spinner />
            ) : indicateurs.error ? (
              <p className="text-sm text-ink-muted">{indicateurs.error}</p>
            ) : (
              <ImcTrendCard corpulence={indicateurs.data?.corpulence} />
            )}
          </CardBody>
        </Card>

        {/* Habitudes de vie */}
        <Card className="lg:col-span-2">
          <CardHeader title="Mes habitudes de vie" />
          <CardBody className="flex flex-wrap gap-2.5">
            {indicateurs.data?.badges_hygiene_vie && (
              <>
                <HabitBadge
                  icon={Activity}
                  active={indicateurs.data.badges_hygiene_vie.activite_physique === "ACTIVE"}
                  activeLabel="Activité physique régulière"
                  inactiveLabel="Mode de vie sédentaire"
                  type="positive"
                />
                <HabitBadge
                  icon={Cigarette}
                  active={indicateurs.data.badges_hygiene_vie.tabagisme === "NON_FUMEUR"}
                  activeLabel="Non-fumeur"
                  inactiveLabel="Fumeur"
                  type="warning"
                />
                <HabitBadge
                  icon={Wine}
                  active={indicateurs.data.badges_hygiene_vie.alcool === "NON_CONSOMMATEUR"}
                  activeLabel="Pas de consommation d'alcool"
                  inactiveLabel="Consommation d'alcool"
                  type="warning"
                />
              </>
            )}
          </CardBody>
        </Card>

        {/* Recommandations médicales (Filtrées) */}
        <Card className="lg:col-span-full">
          <CardHeader
            title="Recommandations de mon médecin"
            subtitle={
              activeRecommandation?.medecin_nom
                ? `Dr ${activeRecommandation.medecin_prenom} ${activeRecommandation.medecin_nom} · ${formatDate(activeRecommandation.date_conseil)}`
                : undefined
            }
          />
          <CardBody>
            {recommandations.isLoading ? (
              <Spinner />
            ) : activeRecommandation ? (
              <p className="whitespace-pre-wrap text-sm text-ink">
                {activeRecommandation.commentaire_medecin || activeRecommandation.message}
              </p>
            ) : (
              <p className="text-sm text-ink-muted italic">
                Aucune recommandation spécifique pour ce volet de consultation actuellement.
              </p>
            )}
          </CardBody>
        </Card>

        {/* Rapports médicaux */}
        <Card className="lg:col-span-3">
          <CardHeader title="Mes rapports" subtitle="Téléchargez le compte-rendu de chacune de vos consultations" />
          <CardBody>
            {timeline.isLoading ? (
              <Spinner />
            ) : reportableConsultations.length === 0 ? (
              <EmptyState
                icon={FileText}
                title="Aucun rapport disponible"
                description={`Vos rapports en ${activeTab.toLowerCase()} apparaîtront ici après validation.`}
              />
            ) : (
              <ul className="divide-y divide-border">
                {reportableConsultations.map((c) => (
                  <li key={c.id_consultation} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-ink">{formatDate(c.date_examen)}</p>
                      <p className="text-xs text-ink-faint capitalize">{c.type_consultation.toLowerCase()}</p>
                    </div>
                    <Link
                      to={`/patient/consultations/${c.id_consultation}/rapport`}
                      className="text-sm font-semibold text-pulse-500 hover:underline"
                    >
                      Voir le rapport →
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </CardBody>
        </Card>
      </div>

      {/* 🔐 Pop-up / Modale de sécurité (Changement de mot de passe) */}
      <ChangePasswordModal 
        open={passwordModalOpen} 
        onClose={() => setPasswordModalOpen(false)} 
      />
    </div>
  );
}

// Composant HabitBadge conservé à l'identique...
function HabitBadge({ icon: Icon, active, activeLabel, inactiveLabel, type }) {
  const styles = active
    ? "bg-emerald-50 text-emerald-700 border border-emerald-100"
    : type === "warning"
    ? "bg-amber-50 text-amber-700 border border-amber-100"
    : "bg-slate-100 text-slate-600 border border-slate-200";

  return (
    <span className={`flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-semibold ${styles}`}>
      <Icon className="h-4 w-4" />
      {active ? activeLabel : inactiveLabel}
    </span>
  );
}