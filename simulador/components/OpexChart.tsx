"use client";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface OpexChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#22d3ee', '#818cf8', '#f472b6', '#34d399', '#fbbf24', '#a78bfa'];

export default function OpexChart({ data }: OpexChartProps) {
  return (
    <div className="h-full w-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={90}
            paddingAngle={8}
            dataKey="value"
            stroke="none"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                className="hover:opacity-80 transition-opacity cursor-pointer outline-none"
              />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}`, 'Total']}
            contentStyle={{ 
              backgroundColor: '#0a0f1c', 
              borderColor: '#ffffff10', 
              borderRadius: '12px', 
              color: '#fff',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            height={36} 
            iconType="circle"
            wrapperStyle={{ 
              fontSize: '10px', 
              color: '#9ca3af', 
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              fontWeight: 'bold',
              paddingTop: '20px'
            }} 
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
