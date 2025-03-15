import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface LineChartProps {
  data: Array<Record<string, any>>;
  xKey: string;
  yKeys: string[];
  colors?: string[];
  title?: string;
}

export function LineChart({
  data,
  xKey,
  yKeys,
  colors,
  title,
}: LineChartProps) {
  const defaultColors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088fe"];

  return (
    <div className="bg-canvas-100 p-4 rounded-xl border border-gray-800">
      {title && (
        <h3 className="text-lg font-medium text-gray-200 mb-4">{title}</h3>
      )}
      <ResponsiveContainer width="100%" height={300}>
        <RechartsLineChart
          data={data}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#444" />
          <XAxis dataKey={xKey} stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip
            contentStyle={{ backgroundColor: "#333", border: "1px solid #555" }}
            labelStyle={{ color: "#fff" }}
          />
          <Legend />
          {yKeys.map((key, index) => (
            <Line
              key={key}
              type="monotone"
              dataKey={key}
              stroke={
                colors?.[index] || defaultColors[index % defaultColors.length]
              }
              activeDot={{ r: 8 }}
            />
          ))}
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
