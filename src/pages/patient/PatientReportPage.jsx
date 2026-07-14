import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Printer } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Spinner, ErrorState } from "../../components/ui/States";
import { useApi } from "../../hooks/useApi";
import { patientService } from "../../services/patientService";
import { ReportDocument } from "../../components/ReportDocument";

export default function PatientReportPage() {
  const { idConsultation } = useParams();
  const navigate = useNavigate(); 
  const { data, error, isLoading } = useApi(
    () => patientService.rapportConsultation(idConsultation),
    [idConsultation]
  );

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    // MODIFICATION : "print:bg-white" et "print:min-h-0" pour éviter de forcer une hauteur minimale sur le papier
    <div className="min-h-screen bg-clinical print:bg-white print:min-h-0">
      
      {/* 
        BANDEAU D'ACTIONS 
        MODIFICATION : On ajoute explicitement "print:hidden" pour s'assurer que Tailwind 
        masque ce bandeau à l'impression, même si la classe personnalisée "no-print" n'est pas définie dans ton CSS.
      */}
      <div className="no-print print:hidden flex items-center justify-between border-b border-border bg-white px-4 sm:px-8 py-4 shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> <span>Retour</span>
        </Button>
        <Button size="sm" onClick={() => window.print()} className="gap-2">
          <Printer className="h-4 w-4" /> <span>Imprimer / PDF</span>
        </Button>
      </div>

      {/* 
        ZONE DU DOCUMENT 
        MODIFICATION : Ajout d'un padding d'espacement à l'écran qui s'annule complètement à l'impression 
        ("print:p-0 print:shadow-none") pour laisser le document occuper 100% de la feuille A4.
      */}
      <div className="p-4 sm:p-8 print:p-0 flex justify-center">
        <div className="w-full max-w-4xl bg-white rounded-xl border border-border sm:shadow-sm print:border-none print:shadow-none">
          <ReportDocument report={data} audience="patient" />
        </div>
      </div>
    </div>
  );
}