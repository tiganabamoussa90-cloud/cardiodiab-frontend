import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { featureLabel } from "../../utils/formatters";

const UP_COLOR   = "#E6483D";
const DOWN_COLOR = "#0F6E5E";

export function ShapInfluenceChart({ shapValues, maxFeatures = 8 }) {
  if (!shapValues || Object.keys(shapValues).length === 0) {
    return (
      <p className="py-8 text-center text-sm text-ink-muted">
        Aucune donnée d'explicabilité disponible.
      </p>
    );
  }

  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const data = Object.entries(shapValues)
    .map(([key, value]) => ({
      key,
      // Sur mobile : label court pour gagner de la place
      label: isMobile ? featureLabel(key).split(" ")[0] : featureLabel(key),
      value: Number(value),
    }))
    .sort((a, b) => Math.abs(b.value) - Math.abs(a.value))
    .slice(0, maxFeatures)
    .sort((a, b) => a.value - b.value);

  const yAxisWidth  = isMobile ? 100 : 178;
  const barSize     = isMobile ? 10  : 14;
  const fontSizeY   = isMobile ? 10  : 12;
  const fontSizeX   = isMobile ? 9   : 11;
  const rowHeight   = isMobile ? 28  : 36;
  const minHeight   = isMobile ? 180 : 220;

  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height={Math.max(minHeight, data.length * rowHeight)}
      >
        <BarChart
          data={data}
          layout="vertical"
          margin={{
            left:   isMobile ? 4  : 8,
            right:  isMobile ? 12 : 24,
            top:    4,
            bottom: 4,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#E3E8E4" horizontal={false} />
          <XAxis
            type="number"
            tick={{ fontSize: fontSizeX, fill: "#5B6B66" }}
            axisLine={false}
            tickLine={false}
            // Moins de ticks sur mobile pour éviter le chevauchement
            tickCount={isMobile ? 4 : 6}
          />
          <YAxis
            type="category"
            dataKey="label"
            width={yAxisWidth}
            tick={{ fontSize: fontSizeY, fill: "#0B1F1C" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            formatter={(value) => [Number(value).toFixed(3), "Contribution SHAP"]}
            contentStyle={{
              borderRadius: 10,
              border: "1px solid #E3E8E4",
              fontSize: isMobile ? 11 : 12,
            }}
          />
          <Bar dataKey="value" radius={[4, 4, 4, 4]} barSize={barSize}>
            {data.map((entry) => (
              <Cell key={entry.key} fill={entry.value >= 0 ? UP_COLOR : DOWN_COLOR} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-2 flex justify-center gap-5 text-xs text-ink-muted">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: UP_COLOR }} />
          Augmente le risque
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: DOWN_COLOR }} />
          Diminue le risque
        </span>
      </div>
    </div>
  );
}