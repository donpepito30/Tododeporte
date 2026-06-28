import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Calendar, Bell, BellOff, Link2, MapPin, Search } from 'lucide-react';
import { Match } from '../types';

interface UpcomingScheduleProps {
  matches: Match[];
  onSelectMatch: (match: Match) => void;
}

export default function UpcomingSchedule({ matches, onSelectMatch }: UpcomingScheduleProps) {
  const [remindedMatches, setRemindedMatches] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // Dynamic user-customizable images mapping persisting to localStorage
  const [customImages, setCustomImages] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('worldcup_custom_images');
    return saved ? JSON.parse(saved) : {};
  });

  const [editingMatchId, setEditingMatchId] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const handleSaveImage = (matchId: string) => {
    const updated = { ...customImages, [matchId]: imageUrlInput };
    setCustomImages(updated);
    localStorage.setItem('worldcup_custom_images', JSON.stringify(updated));
    setEditingMatchId(null);
    setImageUrlInput('');
    triggerAlert(`¡Arte personalizada mapeada con éxito al contenedor del partido!`);
  };

  const handleResetImages = () => {
    setCustomImages({});
    localStorage.removeItem('worldcup_custom_images');
    triggerAlert(`¡Banners revertidos a los valores oficiales del calendario!`);
  };

  const toggleReminder = (matchId: string, teamNames: string) => {
    if (remindedMatches.includes(matchId)) {
      setRemindedMatches(remindedMatches.filter((id) => id !== matchId));
      triggerAlert(`Alerta cancelada para ${teamNames}`);
    } else {
      setRemindedMatches([...remindedMatches, matchId]);
      triggerAlert(`🔔 ¡Alerta configurada! Te notificaremos 15 minutos antes del saque inicial de ${teamNames}`);
    }
  };

  const triggerAlert = (message: string) => {
    setAlertMessage(message);
    setTimeout(() => {
      setAlertMessage(null);
    }, 4000);
  };

  const filteredMatches = matches.filter(
    (m) =>
      m.homeTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.awayTeam.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.stadium.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.city?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Elite sports background visual presets mapped to World Cup 2026 match venues
  const promoPhotos: Record<string, string> = {
    "match-73-u": "https://i.ibb.co/5gkgV4yQ/Chat-GPT-Image-27-jun-2026-23-52-41.png",
    "match-74": "https://i.ibb.co/2Y81Cjns/Chat-GPT-Image-27-jun-2026-23-46-39.png",
    "match-75": "https://i.ibb.co/PZS5Q42x/Chat-GPT-Image-27-jun-2026-23-43-46.png",
    "match-76": "https://i.ibb.co/WWwz0gc0/Chat-GPT-Image-27-jun-2026-23-42-32.png",
    "match-77": "https://images.unsplash.com/photo-1579546929518-9e396f3cc809?auto=format&fit=crop&q=80&w=800",
    "match-78": "https://images.unsplash.com/photo-1517649763962-0c623066013B?auto=format&fit=crop&q=80&w=800",
    "match-79": "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&q=80&w=800",
    "match-80": "https://images.unsplash.com/photo-1431324155629-1a6edd1d226a?auto=format&fit=crop&q=80&w=800",
    "match-81": "https://images.unsplash.com/photo-1509048191080-d2984bad6ae5?auto=format&fit=crop&q=80&w=800",
    "match-82": "https://images.unsplash.com/photo-1459865264687-595d652de67e?auto=format&fit=crop&q=80&w=800",
    "match-83": "https://images.unsplash.com/photo-1516567727145-ab3c1a391b71?auto=format&fit=crop&q=80&w=800",
    "match-84": "https://images.unsplash.com/photo-1510566339476-fefc9d7d42cf?auto=format&fit=crop&q=80&w=800",
    "match-85": "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800",
    "match-86": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&q=80&w=800",
    "match-87-u": "https://images.unsplash.com/photo-1518063319789-7217e6706b04?auto=format&fit=crop&q=80&w=800",
    "match-88-u": "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800",
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert popup */}
      <AnimatePresence>
        {alertMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-6 right-6 z-50 bg-slate-950 border border-yellow-500/30 text-yellow-400 px-5 py-3.5 rounded-2xl shadow-xl shadow-yellow-500/10 flex items-center gap-3 text-xs font-mono font-semibold"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
            </span>
            <span>{alertMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header with Search and Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-100 tracking-tight">
            Calendario Oficial Confirmado (Dieciseisavos de Final)
          </h2>
          <p className="text-xs text-yellow-400 mt-1 uppercase font-mono tracking-wider font-bold">
            ⚡ HAZ CLIC EN "VER TRANSMISIÓN" PARA ACCEDER A CANALES EN VIVO • PASA EL MOUSE SOBRE BANNERS PARA MAPEAR TUS IMÁGENES (🖼️)
          </p>
        </div>

        {/* Search input field & reset custom assets option */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {Object.keys(customImages).length > 0 && (
            <button
              onClick={handleResetImages}
              className="text-[10px] font-mono text-red-400 hover:text-red-300 border border-red-500/20 hover:border-red-500/40 bg-red-950/20 px-3 py-2 rounded-xl transition cursor-pointer"
            >
              Restablecer imágenes
            </button>
          )}
          <div className="relative max-w-xs w-full">
            <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input 
              type="text"
              placeholder="Buscar equipos, sedes, ciudades..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900/60 border border-slate-800 rounded-xl pl-10 pr-4 py-2 text-xs text-slate-300 focus:outline-none focus:border-yellow-400/40 font-mono"
            />
          </div>
        </div>
      </div>

      {/* Matches Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMatches.length > 0 ? (
          filteredMatches.map((match) => {
            const isReminded = remindedMatches.includes(match.id);
            const teamNames = `${match.homeTeam.name} vs ${match.awayTeam.name}`;
            const promoUrl = promoPhotos[match.id] || "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=800";
            const currentBannerImage = customImages[match.id] || promoUrl;

            return (
              <div 
                key={match.id}
                className="bg-slate-900/30 hover:bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5 flex flex-col justify-between gap-4 transition duration-300 group relative overflow-hidden"
              >
                {/* Dynamic promotional photo banner for sports background visual */}
                <div className="h-32 rounded-xl overflow-hidden relative border border-slate-800 bg-slate-950">
                  {editingMatchId === match.id ? (
                    <div className="absolute inset-0 bg-slate-950/95 flex flex-col justify-center p-4 z-30 space-y-2">
                      <span className="text-[10px] font-mono text-yellow-400 uppercase font-bold">MAPEAR ARTE DE PARTIDO PERSONALIZADA:</span>
                      <div className="flex gap-1.5">
                        <input 
                          type="text"
                          placeholder="Ingresa la URL de la imagen o ruta local..."
                          value={imageUrlInput}
                          onChange={(e) => setImageUrlInput(e.target.value)}
                          className="flex-1 bg-slate-900 border border-slate-800 rounded-lg px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-400 font-mono"
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') handleSaveImage(match.id);
                            if (e.key === 'Escape') setEditingMatchId(null);
                          }}
                        />
                        <button 
                          onClick={() => handleSaveImage(match.id)}
                          className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 text-xs font-display font-black px-4 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Guardar
                        </button>
                        <button 
                          onClick={() => setEditingMatchId(null)}
                          className="bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-display font-bold px-3 py-1.5 rounded-lg transition cursor-pointer"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <img 
                        src={currentBannerImage} 
                        alt={teamNames} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover opacity-40 group-hover:scale-105 transition-transform duration-500" 
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                      
                      {/* Image mapping trigger button */}
                      <button 
                        onClick={() => {
                          setEditingMatchId(match.id);
                          setImageUrlInput(customImages[match.id] || '');
                        }}
                        className="absolute top-3 right-3 bg-slate-950/90 hover:bg-yellow-400 hover:text-slate-950 text-slate-300 p-2 rounded-xl border border-slate-800/80 transition duration-200 opacity-0 group-hover:opacity-100 z-20 cursor-pointer flex items-center gap-1.5 text-[9px] font-mono font-bold"
                        title="Map custom match graphic"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>MAPEAR ARTE</span>
                      </button>

                      {/* Flag representation on promo banner */}
                      <div className="absolute inset-x-4 bottom-3 flex items-center justify-between">
                        <div className="flex items-center gap-1 bg-slate-950/80 border border-slate-800/80 px-2 py-1 rounded text-xs font-bold text-slate-100">
                          <span>{match.homeTeam.flag}</span>
                          <span className="mx-1 font-mono text-slate-400">vs</span>
                          <span>{match.awayTeam.flag}</span>
                        </div>
                        {customImages[match.id] ? (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-purple-600 text-white px-2 py-0.5 rounded shadow">
                            ARTE CONFIGURADA
                          </span>
                        ) : (
                          <span className="text-[9px] font-mono font-bold uppercase tracking-widest bg-yellow-400 text-slate-950 px-2 py-0.5 rounded">
                            PARTIDO {match.matchNumber ? `M${match.matchNumber}` : 'PROMO'}
                          </span>
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Header Stage & Date */}
                <div className="flex items-center justify-between text-[11px] font-mono">
                  <span className="text-cyan-400 font-bold bg-cyan-950/30 px-2 py-0.5 rounded border border-cyan-900/30">
                    {match.stage}
                  </span>
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Calendar className="w-3.5 h-3.5 text-yellow-400" />
                    <span className="font-semibold">{match.date} • {match.time}</span>
                  </div>
                </div>

                {/* Scoreboard block */}
                <div className="flex items-center justify-between py-1 bg-slate-950/30 p-3.5 rounded-xl border border-slate-800/50">
                  {/* Home Team */}
                  <div className="flex items-center gap-3">
                    <span className="text-2xl select-none bg-slate-950/80 p-1 rounded-lg border border-slate-800">
                      {match.homeTeam.flag}
                    </span>
                    <div className="space-y-0.5">
                      <span className="font-display font-bold text-slate-100 block text-xs">
                        {match.homeTeam.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        ({match.homeTeam.shortName})
                      </span>
                    </div>
                  </div>

                  {/* VS divider */}
                  <div className="px-2">
                    <span className="font-display font-black text-[10px] text-slate-500 group-hover:text-yellow-400 transition-colors">
                      VS
                    </span>
                  </div>

                  {/* Away Team */}
                  <div className="flex items-center gap-3 flex-row-reverse text-right">
                    <span className="text-2xl select-none bg-slate-950/80 p-1 rounded-lg border border-slate-800">
                      {match.awayTeam.flag}
                    </span>
                    <div className="space-y-0.5">
                      <span className="font-display font-bold text-slate-100 block text-xs">
                        {match.awayTeam.name}
                      </span>
                      <span className="text-[9px] font-mono text-slate-500">
                        ({match.awayTeam.shortName})
                      </span>
                    </div>
                  </div>
                </div>

                {/* Stadium & City details */}
                <div className="flex items-center gap-2 text-slate-400 text-xs px-1">
                  <MapPin className="w-3.5 h-3.5 text-purple-400" />
                  <span className="truncate">{match.stadium} {match.city ? `(${match.city})` : ''}</span>
                </div>

                {/* Tactical Analysis Brief */}
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans px-1 border-l border-yellow-400/20 py-0.5">
                  {match.hypeText}
                </p>

                {/* Buttons controls - HIGHLY CONVERSION OPTIMIZED FOR CLICKS */}
                <div className="flex items-center gap-3 pt-2 border-t border-slate-800/60">
                  <button 
                    onClick={() => toggleReminder(match.id, teamNames)}
                    className={`flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-display font-bold transition duration-300 border cursor-pointer ${
                      isReminded 
                        ? 'bg-yellow-400/10 text-yellow-400 border-yellow-500/30' 
                        : 'bg-slate-950/60 text-slate-400 border-slate-800/80 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {isReminded ? <BellOff className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                    <span>{isReminded ? 'Alerta Activada' : 'Notificarme'}</span>
                  </button>

                  <button 
                    onClick={() => onSelectMatch(match)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white px-3 py-2.5 rounded-xl text-xs font-display font-black tracking-wide transition duration-300 shadow-md shadow-red-650/30 cursor-pointer animate-pulse"
                  >
                    <Link2 className="w-3.5 h-3.5 stroke-[2.5]" />
                    <span>VER EL PARTIDO</span>
                  </button>
                </div>

              </div>
            );
          })
        ) : (
          <div className="col-span-2 text-center py-12 border border-dashed border-slate-800 rounded-2xl">
            <p className="text-slate-500 text-xs font-mono">No se encontraron partidos próximos coincidentes.</p>
          </div>
        )}
      </div>

    </div>
  );
}
