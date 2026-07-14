import { useState } from "react";
import { ScrollText } from "lucide-react";
import { Topbar } from "../../components/layout/Topbar";
import { Card, CardBody } from "../../components/ui/Card";
import { Table, THead, Th, Tr, Td } from "../../components/ui/Table";
import { Spinner, ErrorState, EmptyState } from "../../components/ui/States";
import { Select } from "../../components/ui/Field";
import { useApi } from "../../hooks/useApi";
import { adminService } from "../../services/adminService";
import { formatDate } from "../../utils/formatters";

export default function AuditLogsPage() {
  const [limit, setLimit] = useState(50);

  // ✅ Correction : On passe directement la référence du service. 
  // Le hook useApi appellera en interne la fonction en lui injectant les dépendances [limit].
  const { data: logs, error, isLoading } = useApi(adminService.logsAudit, [limit]);

  return (
    <div>
      <Topbar
        title="Journal d'audit"
        subtitle="Connexions, modifications et calculs d'IA réalisés sur la plateforme"
        actions={
          <Select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="w-40">
            <option value={25}>25 dernières</option>
            <option value={50}>50 dernières</option>
            <option value={100}>100 dernières</option>
          </Select>
        }
      />

      <div className="p-8">
        <Card>
          <CardBody className="pt-5">
            {isLoading ? (
              <Spinner />
            ) : error ? (
              <ErrorState message={error} />
            ) : !logs || logs.length === 0 ? (
              <EmptyState 
                icon={ScrollText} 
                title="Aucune entrée" 
                description="Le journal d'audit est vide pour l'instant." 
              />
            ) : (
              <Table>
                <THead>
                  <Th>Date</Th>
                  <Th>Utilisateur</Th>
                  <Th>Action</Th>
                  <Th>Détails</Th>
                  <Th>Adresse IP</Th>
                </THead>
                <tbody>
                  {logs.map((log) => (
                    <Tr key={log.id_log}>
                      {/* Date formatée */}
                      <Td className="whitespace-nowrap font-mono text-xs">
                        {formatDate(log.date_action)}
                      </Td>
                      
                      {/* ID Utilisateur */}
                      <Td>
                        <span className="inline-flex items-center rounded bg-slate-100 px-2 py-0.5 text-xs font-semibold text-slate-800">
                          ID: #{log.id_user}
                        </span>
                      </Td>
                      
                      {/* Action */}
                      <Td className="font-medium text-ink">{log.action}</Td>
                      
                      {/* Détails avec survol (tooltip) pour afficher le texte complet s'il est tronqué */}
                      <Td 
                        className="max-w-xs sm:max-w-sm truncate text-ink-muted text-xs" 
                        title={log.details}
                      >
                        {log.details}
                      </Td>
                      
                      <Td className="font-mono text-xs text-ink-faint">
                        {log.ip_adress || log.ip_adress || "—"}
                      </Td>
                    </Tr>
                  ))}
                </tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </div>
    </div>
  );
}