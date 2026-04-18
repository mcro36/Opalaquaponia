export default function MiniRoadmap({ currentPhase }: { currentPhase: string }) {
  const phases = [
    { id: 'pilot', name: 'Piloto', volume: '30m³', capex: 'R$ 35k' },
    { id: 'intermediaria', name: 'Intermediária', volume: '60m³', capex: 'R$ 70k' },
    { id: 'pre_industrial', name: 'Pré-Industrial', volume: '180m³', capex: 'R$ 150k' },
    { id: 'industrial', name: 'Industrial', volume: '360m³', capex: 'R$ 280k' }
  ];

  const currentIndex = phases.findIndex(p => p.id === currentPhase);

  return (
    <div className="w-full mt-4 pb-6">
      <div className="flex justify-between items-center relative">
        <div className="absolute left-10 right-10 top-1/3 w-[calc(100%-5rem)] h-1 bg-white/10 -translate-y-1/2"></div>
        <div 
          className="absolute left-10 top-1/3 h-1 bg-cyan-500 -translate-y-1/2 transition-all duration-500"
          style={{ width: `${(Math.max(currentIndex, 0) / (phases.length - 1)) * 100}%`, maxWidth: 'calc(100% - 5rem)' }}
        ></div>
        
        {phases.map((phase, index) => {
          const isPast = index <= currentIndex;
          const isCurrent = index === currentIndex;
          
          return (
            <div key={phase.id} className="relative z-10 flex flex-col items-center w-24">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all shadow-lg ${
                isCurrent ? 'bg-[#0a0f1c] border-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.5)] scale-110' : 
                isPast ? 'bg-cyan-500 border-cyan-500 text-black' : 'bg-[#151b2b] border-white/20'
              }`}>
                {isPast && !isCurrent ? <span className="text-black font-extrabold text-xs">✓</span> : <span className={`text-xs ${isCurrent ? 'text-cyan-400 font-bold' : 'text-gray-500'}`}>{index + 1}</span>}
              </div>
              <div className="mt-3 text-center">
                <p className={`text-xs font-semibold ${isCurrent ? 'text-cyan-400' : isPast ? 'text-gray-300' : 'text-gray-600'}`}>{phase.name}</p>
                <p className="text-[10px] text-gray-500 mt-1">Vol: {phase.volume}</p>
                <p className="text-[10px] text-gray-500 hidden md:block">Inv: {phase.capex}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
