"use client";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';

interface CapexChartProps {
  data: { name: string; value: number }[];
}

export default function CapexChart({ data }: CapexChartProps) {
  return (
    <div className="h-64 w-full mt-4">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
          <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} />
          <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(val) => `R$${val/1000}k`} />
          <Tooltip 
            cursor={{ fill: '#ffffff05' }}
            contentStyle={{ backgroundColor: '#0a0f1c', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff' }}
            itemStyle={{ color: '#22d3ee' }}
            formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Cost']}
          />
          <Bar dataKey="value" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#22d3ee' : '#0ea5e9'} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
