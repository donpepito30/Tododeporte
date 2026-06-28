import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, Volume2, VolumeX, Maximize, Tv, Trophy, ShieldAlert, Zap, Compass, Users } from 'lucide-react';
import { Match } from '../types';
import AdProfessionalSlot from './AdProfessionalSlot';

interface FeaturedMatchProps {
  match: Match;
  onWatchLive: () => void;
}

export default function FeaturedMatch({ match, onWatchLive }: FeaturedMatchProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [videoState, setVideoState] = useState<'poster' | 'intro' | 'highlight' | 'live'>('poster');

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          if (prev >= 100) {
            setIsPlaying(false);
            setVideoState('poster');
            return 0;
          }
          return prev + 1;
        });
      }, 300);
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  const handlePlayClick = () => {
    if (!isPlaying) {
      if (videoState === 'poster') {
        setVideoState('intro');
      }
      setIsPlaying(true);
    } else {
      setIsPlaying(false);
    }
  };

  return (
    <div id="featured-match-section" className="bg-slate-900/40 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 lg:p-8 neon-border-yellow overflow-hidden relative">
      {/* Dynamic background lights */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-yellow-500/5 blur-[80px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/5 blur-[80px] rounded-full pointer-events-none" />

      {/* Live Badge */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6 relative z-10">
        <div className="flex items-center gap-2">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
          </span>
          <span className="text-yellow-400 text-xs font-mono font-bold tracking-widest uppercase neon-glow-yellow">TRANSMISIÓN EN VIVO ACTIVA</span>
        </div>
        <div className="flex items-center gap-3 bg-slate-950/80 px-4 py-1.5 rounded-full border border-purple-500/30 text-xs text-slate-300">
          <Trophy className="w-3.5 h-3.5 text-yellow-400" />
          <span className="font-semibold text-slate-200">{match.stage}</span>
        </div>
      </div>

      {/* Teams Scoreboard & Hype Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        
        {/* Teams Matchup column */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center justify-between bg-slate-950/60 p-6 rounded-2xl border border-slate-800">
            {/* Home Team */}
            <div className="flex flex-col items-center text-center space-y-2 flex-1">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl shadow-inner">
                {match.homeTeam.flag}
              </div>
              <span className="font-display font-extrabold text-xl text-slate-100">{match.homeTeam.name}</span>
              <span className="text-[10px] font-mono text-purple-400 bg-purple-950/40 border border-purple-900/30 px-2.5 py-0.5 rounded-md uppercase font-bold">{match.homeTeam.shortName}</span>
            </div>

            {/* VS Divider */}
            <div className="flex flex-col items-center justify-center px-4">
              <span className="font-display font-black text-2xl text-yellow-400 neon-glow-yellow">VS</span>
              <div className="w-px h-8 bg-gradient-to-b from-transparent via-purple-500/50 to-transparent mt-2" />
            </div>

            {/* Away Team */}
            <div className="flex flex-col items-center text-center space-y-2 flex-1">
              <div className="w-16 h-16 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-4xl shadow-inner">
                {match.awayTeam.flag}
              </div>
              <span className="font-display font-extrabold text-xl text-slate-100">{match.awayTeam.name}</span>
              <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950/40 border border-cyan-900/30 px-2.5 py-0.5 rounded-md uppercase font-bold">{match.awayTeam.shortName}</span>
            </div>
          </div>

          {/* Tactical Hype Description */}
          <div className="space-y-4">
            <h3 className="text-slate-100 font-display font-bold text-lg flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-yellow-400" />
              Análisis Táctico del Partido
            </h3>
            <p className="text-slate-300 text-sm leading-relaxed">
              {match.hypeText}
            </p>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 text-xs">
                <span className="text-slate-500 block uppercase font-mono tracking-wider text-[9px]">ESTADIO SEDE</span>
                <span className="text-slate-300 font-semibold">{match.stadium}</span>
              </div>
              <div className="bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 text-xs">
                <span className="text-slate-500 block uppercase font-mono tracking-wider text-[9px]">HORA DE TRANSMISIÓN</span>
                <span className="text-yellow-400 font-bold">{match.time} ({match.date})</span>
              </div>
            </div>
          </div>

          {/* Call to action buttons - SUPER HIGH CONVERSION OPTIMIZED */}
          <div className="pt-2">
            <button 
              id="watch-live-btn"
              onClick={onWatchLive}
              className="w-full flex items-center justify-center gap-2.5 bg-red-650 hover:bg-red-600 text-white font-display font-black text-base px-6 py-4 rounded-xl transition-all duration-300 shadow-lg shadow-red-600/40 group cursor-pointer animate-pulse"
            >
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
              </span>
              <Tv className="w-5.5 h-5.5 group-hover:scale-110 transition-transform stroke-[2.5]" />
              <span className="uppercase tracking-wider font-extrabold">VER EL PARTIDO • EVENTO EN VIVO</span>
              <span className="text-xs bg-slate-950 text-red-400 px-2.5 py-0.5 rounded font-mono font-bold tracking-tight border border-red-500/20">LIVE</span>
            </button>
            
            {/* Alternative Premium Servers with Ad Links */}
            <div className="grid grid-cols-2 gap-2.5 mt-2.5">
              <a 
                href="https://www.effectivecpmnetwork.com/buhijyg7f?key=13068f034ef40ff700331e7aa5eb3d3e"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-slate-950/80 border border-slate-800 hover:border-yellow-400/50 hover:bg-slate-900 px-3 py-2.5 rounded-xl text-xs font-mono text-slate-300 hover:text-yellow-400 transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                <span>Servidor Premium [HD]</span>
              </a>
              <a 
                href="https://www.effectivecpmnetwork.com/buhijyg7f?key=13068f034ef40ff700331e7aa5eb3d3e"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 bg-slate-950/80 border border-slate-800 hover:border-yellow-400/50 hover:bg-slate-900 px-3 py-2.5 rounded-xl text-xs font-mono text-slate-300 hover:text-yellow-400 transition"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-purple-400 animate-pulse" />
                <span>Servidor VIP 4K [Español]</span>
              </a>
            </div>

            <div className="text-center mt-2.5">
              <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">
                👉 HAZ CLIC ARRIBA PARA INICIAR EL CANAL DE TRANSMISIÓN INTERACTIVO (8 ÁNGULOS)
              </span>
            </div>
          </div>
        </div>

        {/* Media Placeholder & Interactive Video Simulator column */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Video/Image Simulator container */}
            <div className="md:col-span-8 relative aspect-video md:aspect-auto md:min-h-[300px] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden group">
              {/* Visual simulation content depends on state */}
              {videoState === 'poster' && (
                <div className="absolute inset-0">
                  <img 
                    src="https://i.ibb.co/5gkgV4yQ/Chat-GPT-Image-27-jun-2026-23-52-41.png" 
                    alt="Transmisión Oficial Satelital" 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-75 group-hover:scale-105 transition-transform duration-700" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Overlay Text */}
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div className="space-y-1">
                      <span className="inline-block bg-yellow-400 text-slate-950 px-2.5 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider">
                        Señal Satelital HD
                      </span>
                      <h4 className="text-slate-100 font-display font-extrabold text-base">Copa Mundial - Transmisión en Tiempo Real</h4>
                    </div>
                    <span className="text-slate-400 text-xs font-mono bg-slate-950/80 px-2 py-0.5 rounded border border-slate-800">MULTICAM ACTIVE</span>
                  </div>
                </div>
              )}

              {videoState === 'intro' && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 p-6 text-center">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="space-y-4"
                  >
                    <Trophy className="w-12 h-12 text-yellow-400 mx-auto animate-bounce" />
                    <h4 className="text-slate-100 font-display font-black text-xl">Vista Previa de Video Táctico</h4>
                    <p className="text-slate-300 text-xs max-w-sm mx-auto">Analizando alineaciones, sistemas de presión alta clave y predicciones de goles esperados para {match.homeTeam.name} vs {match.awayTeam.name}.</p>
                    <div className="flex items-center justify-center gap-1.5 text-[11px] font-mono text-yellow-400 bg-slate-900/80 px-3 py-1 rounded-full border border-yellow-500/30 w-fit mx-auto">
                      <Zap className="w-3 h-3 text-yellow-400 fill-yellow-400" />
                      SIMULANDO AUDIO EN VIVO
                    </div>
                  </motion.div>
                </div>
              )}

              {/* Glowing match simulation loop when playing */}
              {isPlaying && videoState !== 'intro' && (
                <div className="absolute inset-0 bg-slate-950 flex flex-col justify-between p-6 overflow-hidden">
                  {/* Interactive HUD Header */}
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-yellow-400 font-bold bg-slate-900/80 px-2.5 py-1 rounded border border-yellow-500/30">
                      REPETICIÓN DETALLADA
                    </span>
                    <div className="flex items-center gap-2 text-slate-300 bg-slate-900/80 px-3 py-1 rounded-md border border-slate-800">
                      <span>{match.homeTeam.shortName}</span>
                      <span className="text-yellow-400 font-bold font-mono">2 - 2</span>
                      <span>{match.awayTeam.shortName}</span>
                    </div>
                  </div>

                  {/* Simulated Radar / Pitch Visualization */}
                  <div className="flex-1 flex items-center justify-center relative">
                    {/* Tactical field animation */}
                    <div className="w-full max-w-sm h-32 border border-slate-800/80 rounded-xl relative overflow-hidden bg-slate-900/40">
                      <div className="absolute left-1/2 top-0 bottom-0 w-px bg-slate-800" />
                      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 border border-slate-800 rounded-full" />
                      
                      {/* Home player node */}
                      <motion.div 
                        animate={{ 
                          x: [20, 120, 80, 160, 20],
                          y: [10, 30, 80, 40, 10]
                        }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                        className="absolute w-4 h-4 rounded-full bg-cyan-400 border border-white flex items-center justify-center text-[8px] font-bold text-slate-950 font-mono"
                      >
                        10
                      </motion.div>

                      {/* Away player node */}
                      <motion.div 
                        animate={{ 
                          x: [300, 200, 260, 180, 300],
                          y: [90, 40, 15, 60, 90]
                        }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                        className="absolute w-4 h-4 rounded-full bg-purple-500 border border-white flex items-center justify-center text-[8px] font-bold text-white font-mono"
                      >
                        7
                      </motion.div>

                      {/* Soccer ball node */}
                      <motion.div 
                        animate={{ 
                          x: [24, 124, 264, 184, 24],
                          y: [14, 34, 19, 64, 14]
                        }}
                        transition={{ repeat: Infinity, duration: 8, ease: "easeInOut" }}
                        className="absolute w-2.5 h-2.5 rounded-full bg-white border border-slate-950"
                      />

                      {/* Sound Waves Visualizer if unmuted */}
                      {!isMuted && (
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-end gap-0.5 h-4">
                          <span className="w-1 bg-yellow-400 animate-[pulse_0.8s_infinite] h-2"></span>
                          <span className="w-1 bg-yellow-400 animate-[pulse_1.2s_infinite] h-4"></span>
                          <span className="w-1 bg-yellow-400 animate-[pulse_0.5s_infinite] h-1"></span>
                          <span className="w-1 bg-yellow-400 animate-[pulse_0.9s_infinite] h-3"></span>
                        </div>
                      )}
                    </div>

                    {/* Comment Ticker */}
                    <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-mono text-slate-400">
                      {progress < 25 && "🔄 Iniciando análisis..."}
                      {progress >= 25 && progress < 50 && "⚡ Defensa de línea alta implementada."}
                      {progress >= 50 && progress < 75 && "🎯 Buscando desmarques en los medios espacios."}
                      {progress >= 75 && "🔥 Contraataques rápidos en vivo por transmisión."}
                    </div>
                  </div>

                  {/* Progress Bar indicator */}
                  <div className="h-1 bg-slate-800 rounded-full w-full overflow-hidden">
                    <div 
                      className="h-full bg-yellow-400 transition-all duration-300" 
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              )}

              {/* Big Centered Play Button when paused */}
              <AnimatePresence>
                {!isPlaying && (
                  <motion.button
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    onClick={handlePlayClick}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-yellow-400 hover:bg-yellow-300 text-slate-950 flex items-center justify-center shadow-lg shadow-yellow-500/30 hover:scale-110 transition cursor-pointer z-20"
                  >
                    <Play className="w-8 h-8 fill-slate-950 ml-1" />
                  </motion.button>
                )}
              </AnimatePresence>

              {/* Custom Overlay Controls HUD */}
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-slate-950/90 via-slate-950/40 to-transparent p-4 flex items-center justify-between gap-4 select-none opacity-0 group-hover:opacity-100 transition duration-300 z-30">
                <div className="flex items-center gap-3">
                  <button 
                    onClick={handlePlayClick}
                    className="text-slate-300 hover:text-yellow-400 transition cursor-pointer"
                  >
                    {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
                  </button>
                  <button 
                    onClick={() => setIsMuted(!isMuted)}
                    className="text-slate-300 hover:text-yellow-400 transition cursor-pointer"
                  >
                    {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                  <div className="h-1.5 w-16 bg-slate-800 rounded-full overflow-hidden hidden sm:block">
                    <div className={`h-full bg-slate-300 ${isMuted ? 'w-0' : 'w-2/3'}`} />
                  </div>
                </div>

                {/* Status text */}
                <div className="text-[11px] font-mono text-slate-400">
                  {isPlaying ? "SIMULADOR EN VIVO ACTIVO" : "CENTRO DE PROMO DEL ESTADIO"}
                </div>

                <div className="flex items-center gap-3">
                  <button 
                    onClick={onWatchLive}
                    className="text-xs bg-yellow-400/20 text-yellow-400 border border-yellow-500/30 px-2 py-1 rounded hover:bg-yellow-400 hover:text-slate-950 transition font-bold font-mono cursor-pointer"
                  >
                    TRANSMISIÓN COMPLETA
                  </button>
                  <Maximize className="w-4 h-4 text-slate-300 hover:text-yellow-400 cursor-pointer" />
                </div>
              </div>
            </div>

            {/* Side-by-side Sponsor Ad Block */}
            <div 
              onClick={() => {
                window.open('https://www.effectivecpmnetwork.com/adfm7su20v?key=608c60036c0fc858d149cec4725243ef', '_blank', 'noopener,noreferrer');
              }}
              className="md:col-span-4 flex flex-col justify-between bg-slate-950/60 hover:bg-slate-900/60 border border-slate-800 hover:border-yellow-450 rounded-2xl p-4 relative overflow-hidden group/ad cursor-pointer select-none transition-all duration-300 min-h-[220px]"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-500/[0.02] to-transparent pointer-events-none" />
              <div className="absolute -top-12 -right-12 w-24 h-24 bg-yellow-500/10 blur-xl rounded-full pointer-events-none group-hover/ad:bg-yellow-500/20 transition-all duration-500" />
              
              <div className="space-y-2 relative z-10 my-auto flex flex-col items-center text-center">
                <div className="flex items-center justify-center gap-1.5">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-400"></span>
                  </span>
                  <span className="text-yellow-400 font-mono text-[9px] font-bold uppercase tracking-widest">
                    PATROCINIO EXCLUSIVO
                  </span>
                </div>
                
                <h4 className="text-slate-100 font-display font-extrabold text-xs sm:text-sm group-hover/ad:text-yellow-400 transition duration-300 leading-snug">
                  Canal Satelital VIP #1
                </h4>
                
                <p className="text-slate-400 text-[10px] leading-relaxed max-w-[200px]">
                  Accede de inmediato sin anuncios ni cortes cortesía de nuestro auspiciador oficial.
                </p>
              </div>

              <div className="relative z-10 space-y-2 mt-2 w-full text-center">
                <div className="w-full flex items-center justify-center gap-1 bg-yellow-400 text-slate-950 font-display font-black text-[10px] py-2 px-3 rounded-lg transition duration-300 shadow-lg shadow-yellow-500/10 uppercase">
                  <span>CONECTAR SEÑAL VIP</span>
                </div>
                <div className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">
                  Patrocinador • Click para Abrir
                </div>
              </div>
            </div>
          </div>

          {/* Dynamic Banner Ad Slot below the simulation area */}
          <div className="w-full">
            <AdProfessionalSlot type="banner" />
          </div>

          {/* Quick analysis insights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3">
              <div className="p-2 rounded-lg bg-yellow-500/10 text-yellow-400">
                <Users className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">GOLES ESPERADOS (XG)</span>
                <p className="text-slate-200 text-xs font-bold">{match.homeTeam.shortName}: 1.85 vs {match.awayTeam.shortName}: 1.74</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3">
              <div className="p-2 rounded-lg bg-purple-500/10 text-purple-400">
                <Zap className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">CIUDAD SEDE</span>
                <p className="text-slate-200 text-xs font-bold">{match.city}</p>
              </div>
            </div>

            <div className="bg-slate-950/60 border border-slate-800/80 p-4 rounded-xl flex items-start gap-3">
              <div className="p-2 rounded-lg bg-cyan-500/10 text-cyan-400">
                <Compass className="w-4 h-4" />
              </div>
              <div className="space-y-0.5">
                <span className="text-[10px] font-mono text-slate-500 uppercase">ESTADIO DEL PARTIDO</span>
                <p className="text-slate-200 text-xs font-bold">{match.stadium}</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
