import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { formatDate } from "../../utils/formatters";

export function ScoreTimelineChart({ data, dateKey = "date_examen" }) {
  if (!data || data.length === 0) {
    return <p className="py-8 text-center text-sm text-ink-muted">Pas encore d'historique à afficher.</p>;
  }

  const stroke   = data[0].type_consultation === "CARDIOLOGUE" ? "#E6483D" : "#F2A60D";
  const name     = data[0].type_consultation === "CARDIOLOGUE" ? "Risque cardio" : "Risque diabète";
  const datakey1 = data[0].type_consultation === "CARDIOLOGUE" ? "score_cardio" : "score_diabete";

  const chartData = data.map((d) => ({
    ...d,
    label: formatDate(d[dateKey]).split(" ")[0],
  }));

  // Hauteur réduite sur mobile via JS (même logique que BioRiskGauge)
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const chartHeight = isMobile ? 180 : 260;

  return (
    <ResponsiveContainer width="100%" height={chartHeight}>
      <LineChart
        data={chartData}
        margin={{
          left: -16,
          right: 8,
          top: 8,
          bottom: isMobile ? 20 : 0, // espace pour les labels inclinés
        }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#E3E8E4" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fontSize: isMobile ? 9 : 11, fill: "#5B6B66" }}
          axisLine={false}
          tickLine={false}
          // Sur mobile : incline les labels pour éviter le chevauchement
          angle={isMobile ? -35 : 0}
          textAnchor={isMobile ? "end" : "middle"}
          interval={isMobile ? "preserveStartEnd" : 0}
        />
        <YAxis
          domain={[0, 100]}
          tick={{ fontSize: isMobile ? 9 : 11, fill: "#5B6B66" }}
          axisLine={false}
          tickLine={false}
          width={isMobile ? 28 : 42}
        />
        <Tooltip
          formatter={(value, name) => [`${Number(value).toFixed(1)}%`, name]}
          contentStyle={{ borderRadius: 10, border: "1px solid #E3E8E4", fontSize: 12 }}
        />
        <Legend wrapperStyle={{ fontSize: isMobile ? 10 : 12 }} />
        <Line
          type="monotone"
          dataKey={datakey1}
          name={name}
          stroke={stroke}
          strokeWidth={isMobile ? 2 : 2.5}
          dot={{ r: isMobile ? 2 : 3 }}
          connectNulls
        />
      </LineChart>
    </ResponsiveContainer>
  );
}