import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Shield, Target, Flame, Lightbulb, TrendingUp, Info } from 'lucide-react';
import { Match } from '../types';

interface TacticalHypeEngineProps {
  matches: Match[];
}

export default function TacticalHypeEngine({ matches }: TacticalHypeEngineProps) {
  const [selectedMatch, setSelectedMatch] = useState<Match>(matches[0]);
  const [mentality, setMentality] = useState(50); // Counter (0) to Possession (100)
  const [pressing, setPressing] = useState(50); // Low block (0) to Gegenpress (100)
  const [risk, setRisk] = useState(50); // Safe (0) to All-out (100)

  // Prediction states
  const [homeScore, setHomeScore] = useState(2);
  const [awayScore, setAwayScore] = useState(1);
  const [expectedGoals, setExpectedGoals] = useState('2.34 - 1.84');
  const [tacticalSummary, setTacticalSummary] = useState('');

  // Re-calculate prediction when inputs change
  useEffect(() => {
    // Basic deterministic math to simulate a dynamic sports simulator
    const matchHash = selectedMatch.homeTeam.name.length + selectedMatch.awayTeam.name.length;
    
    // Calculate expected goals based on mentality, pressing, risk
    const baseHomeXG = 1.2 + (mentality / 100) * 0.8 + (risk / 100) * 0.9;
    const baseAwayXG = 1.0 + ((100 - mentality) / 100) * 0.7 + (pressing / 100) * 0.8;

    const finalHomeXG = (baseHomeXG + (matchHash % 5) / 10).toFixed(2);
    const finalAwayXG = (baseAwayXG + (matchHash % 3) / 10).toFixed(2);
    
    setExpectedGoals(`${finalHomeXG} - ${finalAwayXG}`);

    // Generate score
    const hScore = Math.floor(parseFloat(finalHomeXG) + (risk > 70 ? 1 : 0));
    const aScore = Math.floor(parseFloat(finalAwayXG) + (pressing > 80 ? 0 : 1));
    setHomeScore(hScore);
    setAwayScore(aScore);

    // Generate custom text commentary
    let summary = '';
    if (mentality > 70 && pressing > 70) {
      summary = `Presión alta y Gegenpressing asfixiante de ${selectedMatch.homeTeam.name} sobre ${selectedMatch.awayTeam.name}, vulnerable al contragolpe rápido de balón largo.`;
    } else if (mentality < 30 && risk < 40) {
      summary = `Bloque bajo defensivo. ${selectedMatch.homeTeam.name} absorberá la presión de ${selectedMatch.awayTeam.name}. Se prevé un marcador cerrado de pocos goles.`;
    } else if (risk > 85) {
      summary = `Ataque total ofensivo. Mayor probabilidad de errores defensivos y contras mortales. Se anticipa un partido dinámico de muchos goles.`;
    } else {
      summary = `Duelo estratégico equilibrado. El control del medio campo y las jugadas individuales decidirán el resultado definitivo.`;
    }

    setTacticalSummary(summary);

  }, [selectedMatch, mentality, pressing, risk]);

  return (
    <div id="tactical-hype-engine" className="bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-3xl p-6 lg:p-8 space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-32 h-32 bg-cyan-500/5 blur-[50px] pointer-events-none" />
      
      {/* Header Info */}
      <div className="flex items-center gap-3 relative z-10">
        <div className="p-2.5 bg-yellow-400/10 text-yellow-400 rounded-xl border border-yellow-500/20">
          <TrendingUp className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-100">
            Simulador de Predicción Táctica
          </h2>
          <p className="text-xs text-yellow-400 font-mono mt-0.5 uppercase tracking-wider font-bold">
            Configura estilos tácticos para pronosticar goles esperados y resultados en vivo
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        
        {/* Left column: Controls Sliders */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Match selector */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-wider block">
              SELECCIONA EL EVENTO A SIMULAR
            </label>
            <div className="flex flex-wrap gap-2">
              {matches.slice(0, 4).map((m) => (
                <button
                  key={m.id}
                  onClick={() => setSelectedMatch(m)}
                  className={`px-3 py-2 rounded-xl text-xs font-display font-bold transition border cursor-pointer ${
                    selectedMatch.id === m.id
                      ? 'bg-yellow-400 text-slate-950 border-yellow-300 shadow-md shadow-yellow-500/15 font-extrabold'
                      : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200'
                  }`}
                >
                  {m.homeTeam.shortName} vs {m.awayTeam.shortName}
                </button>
              ))}
            </div>
          </div>

          {/* Slider Mentality */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-display font-bold flex items-center gap-1.5">
                <Target className="w-3.5 h-3.5 text-yellow-400" />
                Estilo de Mentalidad
              </span>
              <span className="font-mono text-yellow-400 font-bold">
                {mentality < 35 ? 'Contraataque por Banda' : mentality > 65 ? 'Tiki-Taka Espacial' : 'Construcción Equilibrada'}
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={mentality}
              onChange={(e) => setMentality(Number(e.target.value))}
              className="w-full accent-yellow-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>CONTRAATAQUE</span>
              <span>BASE DE POSESIÓN</span>
            </div>
          </div>

          {/* Slider Pressing */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-display font-bold flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-cyan-400" />
                Intensidad de Presión
              </span>
              <span className="font-mono text-cyan-400 font-bold">
                {pressing < 35 ? 'Bloque Bajo (Catenaccio)' : pressing > 65 ? 'Gegenpress Alto' : 'Bloque Medio'}
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={pressing}
              onChange={(e) => setPressing(Number(e.target.value))}
              className="w-full accent-cyan-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>BLOQUE BAJO PROFUNDO</span>
              <span>GEGENPRESSING TOTAL</span>
            </div>
          </div>

          {/* Slider Risk */}
          <div className="space-y-2 bg-slate-950/40 p-4 rounded-xl border border-slate-800/80">
            <div className="flex justify-between text-xs">
              <span className="text-slate-300 font-display font-bold flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-purple-400" />
                Riesgo del Entrenador / Ritmo
              </span>
              <span className="font-mono text-purple-400 font-bold">
                {risk < 35 ? 'Control Sostenido' : risk > 65 ? 'Ofensiva Total' : 'Ritmo Normal'}
              </span>
            </div>
            <input 
              type="range"
              min="0"
              max="100"
              value={risk}
              onChange={(e) => setRisk(Number(e.target.value))}
              className="w-full accent-purple-500 h-1 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[10px] font-mono text-slate-500">
              <span>CONSERVADOR</span>
              <span>ATAQUE TOTAL</span>
            </div>
          </div>

        </div>

        {/* Right column: Prediction Result Display */}
        <div className="lg:col-span-6 flex flex-col justify-between bg-slate-950/60 border border-slate-800 p-6 rounded-2xl relative overflow-hidden">
          
          <div className="space-y-4 z-10">
            <span className="text-[10px] font-mono text-yellow-400 font-bold bg-yellow-950/40 border border-yellow-500/30 px-2.5 py-1 rounded-md">
              RESULTADOS DE SIMULACIÓN TÁCTICA
            </span>

            {/* Scoreboard outcome */}
            <div className="flex items-center justify-center gap-6 py-4">
              <div className="text-center">
                <span className="text-4xl block">{selectedMatch.homeTeam.flag}</span>
                <span className="text-xs font-mono text-slate-400 block mt-1">{selectedMatch.homeTeam.shortName}</span>
              </div>
              
              <div className="flex items-center gap-4 text-3xl font-display font-black">
                <span className="text-slate-100">{homeScore}</span>
                <span className="text-yellow-400 neon-glow-yellow">:</span>
                <span className="text-slate-100">{awayScore}</span>
              </div>

              <div className="text-center">
                <span className="text-4xl block">{selectedMatch.awayTeam.flag}</span>
                <span className="text-xs font-mono text-slate-400 block mt-1">{selectedMatch.awayTeam.shortName}</span>
              </div>
            </div>

            {/* Expected goals */}
            <div className="border-t border-slate-800/80 pt-4 flex justify-between items-center">
              <span className="text-xs font-mono text-slate-500 uppercase">GOLES ESPERADOS (XG)</span>
              <span className="text-yellow-400 font-mono font-bold text-sm bg-slate-950 px-3 py-0.5 rounded-md border border-slate-800">
                {expectedGoals}
              </span>
            </div>

            {/* Simulated hype description */}
            <div className="bg-slate-950/80 p-4 rounded-xl border border-slate-800/80 text-xs text-slate-300 leading-relaxed flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
              <p>{tacticalSummary}</p>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-2 text-[10px] font-mono text-slate-500 relative z-10">
            <Info className="w-3.5 h-3.5 text-slate-600" />
            <span>Resultados modelados según la sinergia histórica de los planteles y esquemas tácticos.</span>
          </div>

          {/* Background field outline accent */}
          <div className="absolute right-[-40px] bottom-[-40px] w-48 h-48 border border-yellow-500/5 rounded-full pointer-events-none" />

        </div>

      </div>

    </div>
  );
}
