# CardioDiab Predict — Frontend

Application React (Vite + JavaScript) pour la plateforme prédictive CardioDiab.
Identité visuelle inspirée du template Framer **Remoplus** (typographie Outfit/Inter,
cartes arrondies, structure SaaS) entièrement re-thématisée pour un usage clinique :
palette **Pulse Teal** (confiance médicale) + accent **Neural Lime** réservé aux
signaux générés par l'IA, et un élément signature — le **BioRiskGauge**, un double
anneau de risque (cardio + diabète) lu d'un coup d'œil.

## Démarrage

```bash
npm install
cp .env.example .env  
npm run dev
```

Le backend FastAPI doit autoriser `http://localhost:5173` en CORS (déjà fait dans
mon `main.py`).
Le backend FastAPI doit autoriser http://localhost:5173 en CORS (déjà fait dans

Démarrage (via l'API déployée)

En production, l'URL du backend n'est plus localhost mais celle du déploiement
Railway du backend. Le client Axios lit cette valeur depuis une variable
d'environnement Vite :

# .env.production
VITE_API_URL=https://cardiodiab-backend-xxxx.vercel.app

Le même mécanisme est utilisé en local dans .env (pointant vers
http://127.0.0.1:8000) pour ne jamais coder l'URL en dur dans le code source.

## Arborescence

```
src/
  components/
    ui/         Button, Card, Badge, Field (Input/Select/Textarea), Modal, Table, States, StatTile
    layout/     AppShell, Sidebar (nav par rôle), Topbar
    charts/     BioRiskGauge, ShapInfluenceChart, ScoreTimelineChart, ImcTrendCard (ImcTrendCard + ScoreTrendCard)
    ReportDocument.jsx   document imprimable partagé (médecin, patient), branché sur
                         report.specialite / report.type_consultation renvoyés par l'API
  contexts/     AuthContext (JWT + rôle), ToastContext
  hooks/        useAuth, useToast, useApi (fetch déclaratif), useAction (mutations)
  routes/       ProtectedRoute (garde l'auth + restreint par rôle)
  services/     axiosClient (baseURL = VITE_API_URL, intercepteur JWT + erreurs),
                authService, medecinService, patientService, adminService, agentService
  pages/
    auth/       LoginPage, RegisterMedecinPage, RegisterAgentPage
    medecin/    MedecinOverviewPage, PatientsListPage, PatientConsultationsPage,
                NewConsultationPage, ConsultationDetailPage, ConsultationRapportPage
    patient/    PatientDashboardPage (onglets Cardiologie/Diabétologie), PatientReportPage
    agent/      AgentOverviewPage (création de dossier patient)
    admin/      AdminOverviewPage, AuditLogsPage
  utils/        roles.js (mapping rôle → navigation/flux IA), formatters.js
```

## Flux applicatif

1. **Connexion** (`/login`) → `POST /auth/login` → badge JWT stocké, redirection
   automatique vers `/medecin`, `/patient`, `/agent` ou `/admin` selon le rôle renvoyé.
2. **Agent d'admission** : crée un dossier patient (`POST /agent/creer-patient`) —
    l'IPP et le mot de passe temporaire du patient sont générés côté serveur
    et affichés une seule fois à l'écran pour être transmis au patient.  
3. **Médecin** : `Patients` → créer ou lier un dossier → `Consultations` d'un
   patient → `Nouvelle consultation` (formulaire clinique complet) → la
   prédiction renvoyée affiche immédiatement le `BioRiskGauge`, puis vous
   accédez au détail SHAP (`ConsultationDetailPage`) pour l'explicabilité et
   la rédaction des recommandations.
4. **Patient** : tableau de bord unique avec timeline des scores, évolution de
   l'IMC, habitudes de vie et dernières recommandations du médecin.
5. **Admin** : validation/rejet des inscriptions de médecins, suspension par
   identifiant, et journal d'audit filtrable.

Le rôle retourné par `/auth/login` pour un médecin est en réalité sa
**spécialité** ( `CARDIOLOGUE` / `DIABETOLOGUE`). C'est cette
valeur qui détermine automatiquement le `flux_prediction` envoyé lors d'une
consultation, et quelles sections du formulaire sont mises en avant.


## Points backend à vérifier avant mise en production

Pendant l'intégration, plusieurs incohérences sont apparues entre le code
fourni et les modèles Pydantic — à corriger côté backend (non modifiées ici,
hors périmètre de cette tâche) :

- `GET /admin/medecins/en-attente` joint `u.id_utilisateur` et lit `u.nom`/`u.prenom`
  alors que ces colonnes vivent dans la table `medecin`, et filtre sur
  `m.statut_approbation` alors que la colonne s'appelle `statut` ailleurs dans
  le code. La requête plantera probablement en l'état.
- `GET /patient/dashboard/timeline` ne renvoie pas `id_consultation`, ce qui
  empêche le patient de lier une ligne de la timeline à son rapport
  imprimable (`PatientReportPage` existe et fonctionne dès que l'ID est
  disponible — il suffit d'ajouter `id_consultation` au `SELECT`).
- `ValidationMedecinRequest` (champ `nouveau_statut`) est défini dans les
  schémas mais l'endpoint `/admin/medecins/valider` utilise en réalité
  `ApprobationRequest` (`id_medecin` + `action`) — c'est ce second contrat
  que le frontend utilise.

## Design

- **Polices** : Outfit (titres, chiffres clés) / Inter (texte courant) / IBM
  Plex Mono (codes, identifiants, journal d'audit).
- **Couleurs** : voir `tailwind.config.js` — `pulse` (marque), `neural`
  (signal IA), `cardio` / `diabete` (risque), neutres `clinical`/`ink`/`border`.
- Impression : les pages de rapport (`ConsultationRapportPage`,
  `PatientReportPage`) masquent la navigation via la classe `.no-print` et
  s'impriment proprement avec `window.print()`.
