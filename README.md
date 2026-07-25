# CardioDiab Predict — Frontend

Application React (Vite + JavaScript) pour la plateforme prédictive CardioDiab.
Identité visuelle inspirée du template Framer **Remoplus** (typographie Outfit/Inter,
cartes arrondies, structure SaaS) entièrement re-thématisée pour un usage clinique :
palette **Pulse Teal** (confiance médicale) + accent **Neural Lime** réservé aux
signaux générés par l'IA, et un élément signature — le **BioRiskGauge**, un double
anneau de risque (cardio + diabète) lu d'un coup d'œil.

## Démarrage (développement local)

```bash
npm install
cp .env.example .env
npm run dev
```

Le backend FastAPI doit autoriser `http://localhost:5173` en CORS (déjà fait dans
`main.py`).

## Démarrage (via l'API déployée)

En production, l'URL du backend n'est plus `localhost` mais celle du déploiement
Vercel du backend. Le client Axios lit cette valeur depuis une variable
d'environnement Vite :

```
# .env.production
VITE_API_URL=https://cardiodiab-backend-xxxx.vercel.app
```

Le même mécanisme est utilisé en local dans `.env` (pointant vers
`http://127.0.0.1:8000`) pour ne jamais coder l'URL en dur dans le code source.

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
   l'IPP et le mot de passe temporaire du patient sont **générés côté serveur**
   et affichés une seule fois à l'écran pour être transmis au patient.
3. **Médecin** : `Patients` → lier un dossier via l'IPP du patient → `Consultations`
   d'un patient → `Nouvelle consultation` (formulaire clinique complet) → la
   prédiction renvoyée affiche immédiatement le `BioRiskGauge`, puis vous
   accédez au détail SHAP (`ConsultationDetailPage`) pour l'explicabilité et
   la rédaction des recommandations.
4. **Patient** : tableau de bord avec deux onglets (Cardiologie / Diabétologie),
   chacun affichant sa propre timeline de scores, sa propre évolution
   (actuel/précédent), l'IMC et les habitudes de vie restant communs aux deux
   onglets.
5. **Admin** : validation/rejet des inscriptions de médecins et d'agents,
   suspension par identifiant, et journal d'audit filtrable.

Le rôle retourné par `/auth/login` pour un médecin est en réalité sa
**spécialité** (`CARDIOLOGUE` ou `DIABETOLOGUE` — seules valeurs valides de
l'ENUM `medecin.specialite`, il n'existe pas de rôle `GENERALISTE`). Cette même
valeur est désormais utilisée telle quelle pour `type_consultation` en base
(harmonisé pour éviter la confusion avec l'ancien ENUM `CARDIOLOGIE`/`DIABETOLOGIE`),
et détermine le `flux_prediction` envoyé lors d'une consultation.

## Déploiement

| Composant | Hébergement | Notes |
|---|---|---|
| Frontend (ce dépôt) | **Vercel** | Déploiement automatique à chaque `push` sur `main` |
| Backend (FastAPI) | **Vercel** (fonction Python, Large Functions activées via `VERCEL_SUPPORT_LARGE_FUNCTIONS=1` pour dépasser la limite standard de 500 Mo à cause de `scikit-learn`/`lightgbm`/`shap`/`pandas`) | Variables d'environnement : `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `DB_PORT`, `SECRET_KEY` |
| Base de données MySQL | **Clever Cloud** (plan DEV gratuit) | Schéma + données importés depuis le dump local via `mysqldump` |

⚠️ Backend en fonction serverless : chaque connexion MySQL est rouverte par
requête (pas de pool persistant), et les modèles `.pkl` sont rechargés au
"cold start". Un ping périodique (ex. via cron-job.org) peut être mis en place
pour limiter la fréquence des démarrages à froid.

## Points backend encore en suspens (hors périmètre de ce dépôt frontend)

- `enregistrer_audit()` utilise la colonne `ip_adress` (faute de frappe) alors
  que le schéma SQL déclare `ip_address` — à harmoniser.
- `PatientCreateRequest` déclare `mot_de_passe` et `ipp` comme champs requis
  côté Pydantic, alors qu'ils sont en réalité générés côté serveur et ignorés
  du formulaire agent — le schéma doit être aligné (champs optionnels ou
  supprimés).
- `GET /admin/medecins/en-attente` contient une virgule manquante dans le
  `SELECT` (`m.code_inpe u.email`) — erreur de syntaxe SQL à corriger.
- `GET /admin/agents/en-attente` sélectionne des colonnes qui n'existent pas
  sur `agent_admission` (`nom`/`prenom` au lieu de `nom_agent`/`prenom_agent`,
  pas de colonne `specialite` sur les agents).
- Deux fonctions Python homonymes `valider_compte_medecin` (une pour les
  médecins, une pour les agents) — à renommer pour éviter toute ambiguïté.
- `ScoreTrendCard` (dans `ImcTrendCard.jsx`) doit être adapté pour recevoir un
  objet `{score_actuel, score_prec, evolution}` (nouveau format de
  `/patient/dashboard/Indicateurs`, scores cardio/diabète désormais séparés)
  plutôt qu'un simple nombre.

## Design

- **Polices** : Outfit (titres, chiffres clés) / Inter (texte courant) / IBM
  Plex Mono (codes, identifiants, journal d'audit).
- **Couleurs** : voir `tailwind.config.js` — `pulse` (marque), `neural`
  (signal IA), `cardio` / `diabete` (risque), neutres `clinical`/`ink`/`border`.
- Impression : les pages de rapport (`ConsultationRapportPage`,
  `PatientReportPage`) masquent la navigation via la classe `.no-print` et
  s'impriment proprement avec `window.print()`.

<img width="1002" height="1342" alt="image" src="https://github.com/user-attachments/assets/63995460-f9d1-46b6-bf2c-807b3b8ac28c" />

<img width="1205" height="596" alt="image" src="https://github.com/user-attachments/assets/3ff890dc-6105-468c-a0c6-6fd5af9eb75e" />

