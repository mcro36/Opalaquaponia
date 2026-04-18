"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface OpexChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#22d3ee', '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#a78bfa'];

export default function OpexChart({ data }: OpexChartProps) {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={5}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Total']}
            contentStyle={{ backgroundColor: '#0a0f1c', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
          />
          <Legend wrapperStyle={{ fontSize: '12px', color: '#9ca3af' }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
