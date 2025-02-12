import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";
import { InternetStatistics } from "../types";

interface Props {
  stats: InternetStatistics[];
}

export default function CountryPieChart({ stats }: Props) {
  const top10Countries = stats.slice(0, 10);
  const pieData = top10Countries.map((d) => ({
    name: d.countryCode,
    value: d.rate_wb ?? 0,
  }));

  const COLORS = ["#FF6384", "#36A2EB", "#FFCE56", "#4CAF50", "#9966FF", "#FF9F40", "#E91E63", "#3F51B5", "#00BCD4", "#8BC34A"];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
            {pieData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
