"use client";
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, ReferenceLine } from 'recharts';

interface CapexChartProps {
  data: { name: string; value: number }[];
}

export default function CapexChart({ data }: CapexChartProps) {
  // Encontrar o valor mínimo para ajustar o gráfico (especialmente para fluxo de caixa negativo)
  const minValue = Math.min(...data.map(d => d.value));
  const hasNegative = minValue < 0;

  return (
    <div className="h-full w-full min-h-[250px]">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <defs>
            <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#22d3ee" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorNegative" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f87171" stopOpacity={0.1}/>
              <stop offset="95%" stopColor="#f87171" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#ffffff05" vertical={false} />
          <XAxis 
            dataKey="name" 
            stroke="#4b5563" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tick={{ fill: '#6b7280' }}
            dy={10}
          />
          <YAxis 
            stroke="#4b5563" 
            fontSize={10} 
            tickLine={false} 
            axisLine={false} 
            tickFormatter={(val) => `R$${val}k`}
            tick={{ fill: '#6b7280' }}
          />
          <Tooltip 
            cursor={{ stroke: '#22d3ee50', strokeWidth: 1 }}
            contentStyle={{ 
              backgroundColor: '#0a0f1c', 
              borderColor: '#ffffff10', 
              borderRadius: '12px', 
              color: '#fff',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
              border: '1px solid rgba(255,255,255,0.1)'
            }}
            itemStyle={{ color: '#22d3ee', fontWeight: 'bold' }}
            formatter={(value: any) => [`R$ ${Number(value).toLocaleString('pt-BR')}k`, 'Saldo']}
          />
          
          {hasNegative && <ReferenceLine y={0} stroke="#ffffff15" strokeWidth={1} />}
          
          <Area 
            type="monotone" 
            dataKey="value" 
            stroke="#22d3ee" 
            strokeWidth={3}
            fillOpacity={1} 
            fill="url(#colorValue)" 
            animationDuration={1500}
            baseLine={0}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
