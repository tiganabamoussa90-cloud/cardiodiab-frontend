import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ToastProvider } from "./contexts/ToastContext";
import { ProtectedRoute } from "./routes/ProtectedRoute";
import { AppShell } from "./components/layout/AppShell";
import { ROLES } from "./utils/roles";

//routes publics
import LoginPage from "./pages/auth/LoginPage";
import RegisterMedecinPage from "./pages/auth/RegisterMedecinPage";
import RegisterAgentPage from "./pages/auth/RegisterAgentPage";
import LandingPage from "./pages/LandingPage";

//routes du médecin
import MedecinOverviewPage from "./pages/medecin/MedecinOverviewPage";
import PatientsListPage from "./pages/medecin/PatientsListPage";
import PatientConsultationsPage from "./pages/medecin/PatientConsultationsPage";
import NewConsultationPage from "./pages/medecin/NewConsultationPage";
import ConsultationDetailPage from "./pages/medecin/ConsultationDetailPage";
import ConsultationRapportPage from "./pages/medecin/ConsultationRapportPage";

//routes du patient
import PatientDashboardPage from "./pages/patient/PatientDashboardPage";
import PatientReportPage from "./pages/patient/PatientReportPage";

//routes administratifs
import AdminOverviewPage from "./pages/admin/AdminOverviewPage";
import AuditLogsPage from "./pages/admin/AuditLogsPage";

//routes agents
import AgentOverviewPage from "./pages/agent/AgentOverviewPage";

//routes pour error notfound
import NotFoundPage from "./pages/NotFoundPage";

const MEDECIN_ROLES = [ROLES.CARDIOLOGUE, ROLES.DIABETOLOGUE];

export default function App(){
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register-medecin" element={<RegisterMedecinPage />} />
            <Route path="/register-agent" element={<RegisterAgentPage />} />

            {/* Espace médecin ( cardiologue, diabétologue) */}
            <Route
              path="/medecin"
              element={
                <ProtectedRoute allowedRoles={MEDECIN_ROLES}>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<MedecinOverviewPage />} />
              <Route path="patients" element={<PatientsListPage />} />
              <Route path="patients/:idPatient" element={<PatientConsultationsPage />} />
              <Route path="patients/:idPatient/nouvelle-consultation" element={<NewConsultationPage />} />
              <Route path="consultations/:idConsultation" element={<ConsultationDetailPage />} />
              <Route path="consultations/:idConsultation/rapport" element={<ConsultationRapportPage />} />
            </Route>

            {/* Espace patient */}
            <Route
              path="/patient"
              element={
                <ProtectedRoute allowedRoles={[ROLES.PATIENT]}>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<PatientDashboardPage />} />
              <Route path="consultations/:idConsultation/rapport" element={<PatientReportPage />} />
            </Route>

            {/* Espace administrateur */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute allowedRoles={[ROLES.ADMIN]}>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<AdminOverviewPage />} />
              <Route path="logs" element={<AuditLogsPage />} />
            </Route>
            
            {/* Espace agent*/}
            <Route
              path="/agent"
              element={
                <ProtectedRoute allowedRoles={[ROLES.AGENT]}>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<AgentOverviewPage />} />
            </Route>

            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
