import { useNavigate, useParams } from "react-router-dom";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "../../components/ui/Button";
import { Spinner, ErrorState } from "../../components/ui/States";
import { useApi } from "../../hooks/useApi";
import { medecinService } from "../../services/medecinService";
import { ReportDocument } from "../../components/ReportDocument";

export default function ConsultationRapportPage() {
  const { idConsultation } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useApi(
    () => medecinService.rapportConsultation(idConsultation),
    [idConsultation]
  );

  if (isLoading) return <Spinner />;
  if (error) return <ErrorState message={error} />;

  return (
    <div className="min-h-screen bg-clinical flex flex-col">
      {/* Barre d'outils - masquée à l'impression */}
      <div className="no-print sticky top-0 z-10 flex items-center justify-between border-b border-border bg-surface px-8 py-4 shadow-sm">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> Retour
        </Button>
        <Button size="sm" onClick={() => window.print()}>
          <Printer className="h-4 w-4" /> Imprimer / Enregistrer en PDF
        </Button>
      </div>

      {/* 
        Zone d'affichage du rapport :
        - Centré avec padding à l'écran
        - Retrait des marges, ombres et paddings spécifiques lors de l'impression réelle (print:...)
      */}
      <div className="flex-1 p-6 sm:p-10 print:p-0 flex justify-center">
        <div className="w-full max-w-[21cm] bg-surface p-8 sm:p-12 shadow-card border border-border rounded-xl print:shadow-none print:border-none print:p-0 print:max-w-none">
          <ReportDocument report={data} audience="medecin" />
        </div>
      </div>
    </div>
  );
}