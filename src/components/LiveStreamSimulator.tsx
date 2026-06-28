import { useState, useEffect, useRef, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Send, Users, ShieldAlert, Award, Play, Activity, MessageSquare, ListCollapse, AlignJustify } from 'lucide-react';
import { Match, ChatMessage, CommentaryEvent } from '../types';
import AdProfessionalSlot from './AdProfessionalSlot';

interface LiveStreamSimulatorProps {
  match: Match;
  onClose: () => void;
  initialCameraId?: number;
}

const INITIAL_CHAT_MESSAGES: ChatMessage[] = [
  { id: 'c-1', user: 'FootballFan99', avatar: '🦁', message: '¡Qué partidazo! ¡La mejor revancha de un mundial!', time: '21:14' },
  { id: 'c-2', user: 'AllezBleus_7', avatar: '🐓', message: 'Mbappé está destrozando absolutamente a Romero por la banda hoy ⚡', time: '21:14' },
  { id: 'c-3', user: 'Leo_Messi_GOAT', avatar: '🐐', message: '¡Ese pase de Messi fue de otro planeta! 🪐', time: '21:15' },
  { id: 'c-4', user: 'TacticalNerd', avatar: '🧠', message: 'Francia cambió a un bloque medio para frenar a Enzo Fernández. Movida inteligente.', time: '21:15' },
  { id: 'c-5', user: 'DohaStadiumCam', avatar: '🏟️', message: '¡El ambiente en Lusail es increíble ahora mismo! ¡Puro ruido!', time: '21:16' },
];

const BOT_RESPONSES = [
  '¡¡¡NO PUEDE SER!!! ¡¿Vieron esa entrada?! 😱',
  'Argentina se ve un poco cansada. Necesitan cambios urgente.',
  '¡VAMOS LES BLEUS! ¡¿Se viene el hat-trick de Mbappé?! 🇫🇷🔥',
  '¿Penal? ¡Seguro que fue falta dentro del área!',
  'Messi simplemente está orquestando todo. Leyenda.',
  'Este partido está intensísimo, ¡mi corazón no aguanta más!',
  'El árbitro perdió el control del partido 😂',
  '¡Qué atajada de clase mundial del Dibu Martínez!',
];

const BOT_USER_NAMES = [
  'SoccerMom20', 'TacticalGaffer', 'RonaldoFansClub', 'KylianVibes', 'MacAllisterFanboy', 'DePaulEnforcer', 'FrenchRocket', 'BlueWhiteArmy'
];

const BOT_AVATARS = ['⚽', '🔥', '🏆', '⭐', '👕', '🎯', '👟', '👑'];

const STREAM_CAMERAS = [
  {
    id: 0,
    name: 'Cámara Principal HD',
    url: 'https://i.ibb.co/5gkgV4yQ/Chat-GPT-Image-27-jun-2026-23-52-41.png',
    icon: '📹',
    desc: 'Señal principal de televisión'
  },
  {
    id: 1,
    name: 'Cámara Táctica 3D',
    url: 'https://i.ibb.co/2Y81Cjns/Chat-GPT-Image-27-jun-2026-23-46-39.png',
    icon: '📊',
    desc: 'Esquema de calor táctico interactivo'
  },
  {
    id: 2,
    name: 'Vista del Entrenador',
    url: 'https://i.ibb.co/PZS5Q42x/Chat-GPT-Image-27-jun-2026-23-43-46.png',
    icon: '👔',
    desc: 'Banquillos de suplentes y área técnica'
  },
  {
    id: 3,
    name: 'Spidercam Aérea',
    url: 'https://i.ibb.co/WWwz0gc0/Chat-GPT-Image-27-jun-2026-23-42-32.png',
    icon: '🛸',
    desc: 'Ángulo cenital suspendido sobre el campo'
  }
];

export default function LiveStreamSimulator({ match, onClose, initialCameraId }: LiveStreamSimulatorProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'stats' | 'lineups' | 'commentary'>('chat');
  const [selectedCamera, setSelectedCamera] = useState(initialCameraId ?? 0);
  const [gameMinute, setGameMinute] = useState(74);
  const [homeScore, setHomeScore] = useState(2);
  const [awayScore, setAwayScore] = useState(2);
  const [showGoalBanner, setShowGoalBanner] = useState(false);
  const [goalScorer, setGoalScorer] = useState('');
  const [goalTeam, setGoalTeam] = useState('');
  
  // Interactive Chat State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_CHAT_MESSAGES);
  const [inputMessage, setInputMessage] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Stats State (updates slightly on events)
  const [stats, setStats] = useState({
    possessionHome: 52,
    possessionAway: 48,
    shotsHome: 14,
    shotsAway: 11,
    foulsHome: 8,
    foulsAway: 12,
    cornersHome: 5,
    cornersAway: 4,
    yellowHome: 1,
    yellowAway: 2,
  });

  // Commentary State
  const [commentary, setCommentary] = useState<CommentaryEvent[]>([
    { minute: 74, type: 'info', description: 'La presión alta de Francia está forzando errores estructurales en el mediocampo.' },
    { minute: 70, type: 'substitution', description: 'Kingsley Coman reemplaza a Ousmane Dembélé (Francia).', team: 'away' },
    { minute: 64, type: 'card', description: 'Tarjeta Amarilla: Cristian Romero (Argentina) por una barrida fuerte.', team: 'home' },
    { minute: 59, type: 'goal', description: '⚽ ¡GOL! ¡Kylian Mbappé anota de volea al ángulo inferior derecho! ¡Empata Francia!', team: 'away' },
    { minute: 48, type: 'shot', description: 'Alexis Mac Allister saca un potente disparo desde 22 metros. Pasa apenas desviado del poste.', team: 'home' },
    { minute: 45, type: 'info', description: 'Comienza el segundo tiempo. Sin cambios en el entretiempo para ningún equipo.' },
  ]);

  // Selected lineup team
  const [lineupTeam, setLineupTeam] = useState<'home' | 'away'>('home');

  // Auto scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  // Game flow simulation timer
  useEffect(() => {
    const gameTimer = setInterval(() => {
      setGameMinute((prev) => {
        if (prev >= 90) {
          clearInterval(gameTimer);
          return 90;
        }
        
        // Randomly trigger events on minutes
        const nextMin = prev + 1;
        triggerRandomEvent(nextMin);
        return nextMin;
      });
    }, 8000); // 8 seconds in real life is 1 minute in the simulation

    return () => clearInterval(gameTimer);
  }, []);

  // Bot response simulator
  useEffect(() => {
    const chatTimer = setInterval(() => {
      // Simulate other users typing in chat
      const randomMsg = BOT_RESPONSES[Math.floor(Math.random() * BOT_RESPONSES.length)];
      const randomUser = BOT_USER_NAMES[Math.floor(Math.random() * BOT_USER_NAMES.length)];
      const randomAvatar = BOT_AVATARS[Math.floor(Math.random() * BOT_AVATARS.length)];
      
      const newMsg: ChatMessage = {
        id: `c-bot-${Date.now()}`,
        user: randomUser,
        avatar: randomAvatar,
        message: randomMsg,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev.slice(-30), newMsg]);
    }, 4500);

    return () => clearInterval(chatTimer);
  }, []);

  // Event trigger logic
  const triggerRandomEvent = (minute: number) => {
    const roll = Math.random();

    if (roll < 0.15) {
      // Goal!
      const isHome = Math.random() > 0.45; // 55% chance Argentina, 45% France
      const scorer = isHome 
        ? (Math.random() > 0.5 ? 'Lionel Messi' : 'Julián Álvarez')
        : (Math.random() > 0.5 ? 'Kylian Mbappé' : 'Antoine Griezmann');
      
      if (isHome) {
        setHomeScore((prev) => prev + 1);
        setGoalTeam('Argentina');
      } else {
        setAwayScore((prev) => prev + 1);
        setGoalTeam('Francia');
      }

      setGoalScorer(scorer);
      setShowGoalBanner(true);
      setTimeout(() => setShowGoalBanner(false), 5000);

      // Add to commentary
      const newEvent: CommentaryEvent = {
        minute,
        type: 'goal',
        description: `⚽ ¡GOL! ¡Espectacular remate de ${scorer}! ¡El estadio estalló en júbilo!`,
        team: isHome ? 'home' : 'away',
      };
      setCommentary((prev) => [newEvent, ...prev]);

      // Add to chat
      const chatAlert: ChatMessage = {
        id: `goal-alert-${Date.now()}`,
        user: '🏆 ALERTA DE GOL',
        avatar: '⚽',
        message: `¡¡¡GOOOOL!!! ¡${scorer} anotó para ${isHome ? 'Argentina' : 'Francia'}! ¡Locura total en las gradas!`,
        time: 'VIVO',
      };
      setChatMessages((prev) => [...prev, chatAlert]);

      // Update stats
      setStats((prev) => ({
        ...prev,
        shotsHome: prev.shotsHome + (isHome ? 1 : 0),
        shotsAway: prev.shotsAway + (!isHome ? 1 : 0),
      }));

    } else if (roll < 0.35) {
      // Shot
      const isHome = Math.random() > 0.5;
      const desc = isHome 
        ? '¡Lionel Messi recorta hacia adentro y dispara! Magnífica atajada voladora de Mike Maignan.'
        : '¡Kylian Mbappé saca un misil! ¡Emi Martínez la desvía por encima del travesaño!';
      
      const newEvent: CommentaryEvent = {
        minute,
        type: 'shot',
        description: `🎯 Remate al Arco: ${desc}`,
        team: isHome ? 'home' : 'away',
      };
      setCommentary((prev) => [newEvent, ...prev]);

      setStats((prev) => ({
        ...prev,
        shotsHome: prev.shotsHome + (isHome ? 1 : 0),
        shotsAway: prev.shotsAway + (!isHome ? 1 : 0),
      }));

    } else if (roll < 0.5) {
      // Yellow card
      const isHome = Math.random() > 0.5;
      const player = isHome ? 'Enzo Fernández' : 'Aurélien Tchouaméni';
      
      const newEvent: CommentaryEvent = {
        minute,
        type: 'card',
        description: `🟨 Tarjeta Amarilla: ${player} es amonestado por cortar un contraataque rápido.`,
        team: isHome ? 'home' : 'away',
      };
      setCommentary((prev) => [newEvent, ...prev]);

      setStats((prev) => ({
        ...prev,
        yellowHome: prev.yellowHome + (isHome ? 1 : 0),
        yellowAway: prev.yellowAway + (!isHome ? 1 : 0),
      }));
    } else if (roll < 0.65) {
      // Possession shifts
      setStats((prev) => {
        const delta = Math.floor(Math.random() * 3) - 1; // -1, 0, 1
        return {
          ...prev,
          possessionHome: Math.max(40, Math.min(60, prev.possessionHome + delta)),
          possessionAway: Math.max(40, Math.min(60, prev.possessionAway - delta)),
        };
      });
    }
  };

  const handleSendMessage = (e: FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const newMsg: ChatMessage = {
      id: `c-user-${Date.now()}`,
      user: 'Tú (Campeón)',
      avatar: '🌟',
      message: inputMessage.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isUser: true,
    };

    setChatMessages((prev) => [...prev, newMsg]);
    setInputMessage('');

    // Simulate bot replying directly to the user
    setTimeout(() => {
      const botResponse = Math.random() > 0.5 
        ? '¡Bien dicho! Veamos si esa dinámica realmente da sus frutos.' 
        : '¡Totalmente de acuerdo, la presión en el mediocampo es clave ahora mismo!';
      
      const replyMsg: ChatMessage = {
        id: `c-reply-${Date.now()}`,
        user: BOT_USER_NAMES[Math.floor(Math.random() * BOT_USER_NAMES.length)],
        avatar: '🤝',
        message: `@Tú (Campeón) ${botResponse}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setChatMessages((prev) => [...prev, replyMsg]);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/95 backdrop-blur-2xl z-50 flex flex-col h-full overflow-hidden">
      
      {/* HUD Bar Top */}
      <div className="bg-slate-900/90 border-b border-slate-800/85 px-6 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="bg-yellow-400/10 text-yellow-400 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-yellow-400 animate-pulse" />
            TRANSMISIÓN EN VIVO MULTI-ÁNGULO
          </div>
          <h2 className="text-slate-200 font-display font-bold text-base hidden md:block">
            Centro del Gran Estadio del Mundial
          </h2>
        </div>

        {/* Global Score Tracker */}
        <div className="flex items-center gap-4 bg-slate-950/80 border border-slate-800 px-5 py-1.5 rounded-full shadow-inner text-sm">
          <div className="flex items-center gap-2 font-display font-semibold text-slate-100">
            <span>🇦🇷 {match.homeTeam.name}</span>
            <span className="font-mono text-yellow-400 font-bold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
              {homeScore}
            </span>
          </div>
          <span className="text-slate-600 font-bold">:</span>
          <div className="flex items-center gap-2 font-display font-semibold text-slate-100">
            <span className="font-mono text-yellow-400 font-bold bg-slate-900 px-2 py-0.5 rounded-md border border-slate-800">
              {awayScore}
            </span>
            <span>{match.awayTeam.name} 🇫🇷</span>
          </div>
          <div className="w-px h-4 bg-slate-800" />
          <span className="text-rose-500 font-mono font-bold animate-[pulse_1s_infinite]">
            {gameMinute}&apos;
          </span>
        </div>

        <button 
          onClick={onClose}
          className="p-2 bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-slate-200 rounded-xl border border-slate-700/60 transition cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Hub Body Grid */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden h-full">
        
        {/* Left Side: Broadcast Stream Simulation */}
        <div className="lg:col-span-8 flex flex-col p-6 space-y-4 overflow-y-auto">
          
          {/* Main Visual Screen Container */}
          <div className="relative aspect-video bg-slate-900 border border-slate-800/80 rounded-2xl overflow-hidden neon-border-yellow">
            
            {/* Live Streaming Video Visualizer / Mock Interface */}
            <div className="absolute inset-0 bg-slate-950/40">
              <img 
                src={STREAM_CAMERAS[selectedCamera].url} 
                alt={STREAM_CAMERAS[selectedCamera].name} 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-60 select-none"
              />
              
              {/* Overlay Graphical Lines (Simulating Broadcast HUD) */}
              <div className="absolute inset-x-0 bottom-12 top-12 border-x border-dashed border-yellow-500/10 pointer-events-none" />
              <div className="absolute inset-y-0 left-12 right-12 border-y border-dashed border-yellow-500/10 pointer-events-none" />

              {/* Dynamic Action Overlay Box */}
              <div className="absolute inset-0 flex flex-col justify-between p-6">
                
                {/* HUD Overlay Top Info */}
                <div className="flex justify-between items-start">
                  <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300">
                    <span className="text-yellow-400 font-semibold block uppercase">{STREAM_CAMERAS[selectedCamera].name}</span>
                    <span>1080p UltraHD • 60 FPS</span>
                  </div>
                  
                  <div className="bg-slate-950/80 border border-slate-800 px-4 py-2 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2">
                    <Users className="w-3.5 h-3.5 text-yellow-400" />
                    <span>Espectadores en vivo: 42.8M</span>
                  </div>
                </div>

                {/* Animated Football Match Simulator Panel */}
                <div className="flex-1 flex items-center justify-center relative">
                  
                  {/* Miniature Animated Soccer Pitch */}
                  <div className="w-full max-w-lg h-44 border border-yellow-500/20 rounded-2xl relative overflow-hidden bg-slate-950/30 backdrop-blur-sm shadow-2xl">
                    {/* Grass stripes design */}
                    <div className="absolute inset-0 grid grid-cols-12 opacity-10">
                      {[...Array(12)].map((_, i) => (
                        <div key={i} className={`h-full ${i % 2 === 0 ? 'bg-yellow-300' : 'bg-transparent'}`} />
                      ))}
                    </div>
                    
                    {/* Pitch markings */}
                    <div className="absolute inset-y-0 left-0 w-12 border-r border-yellow-500/20" />
                    <div className="absolute inset-y-0 right-0 w-12 border-l border-yellow-500/20" />
                    <div className="absolute top-1/2 left-0 w-4 h-8 border border-yellow-500/20 -translate-y-1/2" />
                    <div className="absolute top-1/2 right-0 w-4 h-8 border border-yellow-500/20 -translate-y-1/2" />
                    <div className="absolute left-1/2 top-0 bottom-0 w-px bg-yellow-500/20" />
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border border-yellow-500/20 rounded-full" />
                    
                    {/* Floating player icons (Simulating active play positioning) */}
                    <motion.div 
                      animate={{ 
                        x: [60, 180, 240, 140, 60],
                        y: [40, 60, 120, 80, 40]
                      }}
                      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                      className="absolute w-6 h-6 rounded-full bg-cyan-400 border-2 border-slate-950 flex items-center justify-center text-[9px] font-bold text-slate-950 shadow-lg shadow-cyan-400/30 font-mono"
                    >
                      LM10
                    </motion.div>

                    <motion.div 
                      animate={{ 
                        x: [340, 260, 210, 310, 340],
                        y: [100, 70, 40, 110, 100]
                      }}
                      transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                      className="absolute w-6 h-6 rounded-full bg-purple-500 border-2 border-slate-950 flex items-center justify-center text-[9px] font-bold text-white shadow-lg shadow-purple-500/30 font-mono"
                    >
                      KM7
                    </motion.div>

                    <motion.div 
                      animate={{ 
                        x: [200, 220, 180, 240, 200],
                        y: [70, 90, 60, 110, 70]
                      }}
                      transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                      className="absolute w-5 h-5 rounded-full bg-yellow-400 border-2 border-slate-950 flex items-center justify-center text-[9px] font-bold text-slate-950 shadow-lg font-mono"
                    >
                      AG7
                    </motion.div>

                    {/* Ball moving dynamically */}
                    <motion.div 
                      animate={{ 
                        x: [66, 186, 215, 146, 66],
                        y: [46, 66, 45, 86, 46]
                      }}
                      transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
                      className="absolute w-3.5 h-3.5 rounded-full bg-white border border-slate-950 flex items-center justify-center text-[6px] font-mono shadow-md"
                    >
                      ⚽
                    </motion.div>
                  </div>
                </div>

                {/* Subtitle / Real-time narration ticker */}
                <div className="bg-slate-950/80 border border-slate-800/80 px-4 py-3 rounded-xl flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <Activity className="w-4 h-4 text-yellow-400 animate-pulse" />
                    <p className="text-slate-300 text-xs font-mono">
                      <span className="text-yellow-400 font-semibold">[AUTO ANÁLISIS]</span> Argentina mantiene el control en los medios espacios. La defensa francesa reestructura su esquema.
                    </p>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 hidden sm:block">ESTADO DEL SISTEMA: EXCELENTE</span>
                </div>

              </div>
            </div>

            {/* Simulated Goal Banner (Animated) */}
            <AnimatePresence>
              {showGoalBanner && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.6 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.6 }}
                  className="absolute inset-0 bg-slate-950/95 z-40 flex flex-col items-center justify-center text-center p-6 border-2 border-yellow-400"
                >
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  >
                    <Award className="w-20 h-20 text-yellow-400 mx-auto" />
                  </motion.div>
                  <h1 className="text-4xl sm:text-6xl font-display font-extrabold text-yellow-400 tracking-widest uppercase neon-glow-yellow mt-4">
                    ¡GOL!
                  </h1>
                  <p className="text-yellow-400 text-lg font-bold mt-2 font-mono">
                    ¡ANOTA {goalTeam.toUpperCase()}!
                  </p>
                  <p className="text-slate-100 text-2xl font-display font-bold mt-1">
                    {goalScorer}
                  </p>
                  <p className="text-slate-400 text-xs font-mono mt-4">
                    Minuto de juego: {gameMinute}&apos;
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Multicamera Controller Grid */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-slate-200 font-display font-bold text-sm flex items-center gap-2">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400"></span>
              </span>
              Canales de Transmisión Multicámara (Ángulos Exclusivos HD)
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {STREAM_CAMERAS.map((cam) => (
                <button
                  key={cam.id}
                  onClick={() => setSelectedCamera(cam.id)}
                  className={`relative overflow-hidden rounded-xl p-3 border text-left transition group cursor-pointer ${
                    selectedCamera === cam.id
                      ? 'bg-gradient-to-br from-yellow-400/20 to-amber-500/10 border-yellow-400 shadow-md shadow-yellow-500/5'
                      : 'bg-slate-950/60 border-slate-800/80 hover:bg-slate-900/40 hover:border-slate-700/80'
                  }`}
                >
                  {/* Small preview thumbnail background */}
                  <div className="absolute inset-0 opacity-[0.03] bg-cover bg-center filter grayscale group-hover:opacity-[0.06] transition" style={{ backgroundImage: `url(${cam.url})` }} />
                  
                  <div className="relative z-10 flex flex-col justify-between h-full space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-lg">{cam.icon}</span>
                      {selectedCamera === cam.id ? (
                        <span className="text-[8px] bg-yellow-400 text-slate-950 px-1.5 py-0.5 rounded-full font-mono font-bold tracking-tight">VIVO</span>
                      ) : (
                        <span className="text-[8px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded-full font-mono font-bold tracking-tight">HD</span>
                      )}
                    </div>
                    <div>
                      <span className={`text-xs font-bold block transition ${selectedCamera === cam.id ? 'text-yellow-400' : 'text-slate-200'}`}>
                        {cam.name}
                      </span>
                      <span className="text-[9px] text-slate-500 block truncate leading-tight mt-0.5">
                        {cam.desc}
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tactical sliders to custompredict the game */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-slate-200 font-display font-bold text-sm flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-yellow-400" />
              Registro Dinámico de Eventos del Partido
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/40">
                <span className="text-[10px] font-mono text-slate-500 block">CONTEXTO DE GOLES</span>
                <span className="text-slate-200 text-sm font-semibold font-mono">ARG: 2.14xG vs FRA: 1.95xG</span>
              </div>
              <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/40">
                <span className="text-[10px] font-mono text-slate-500 block">ZONAS DE PELIGRO</span>
                <span className="text-slate-200 text-sm font-semibold font-mono">Banda izquierda 44% activa</span>
              </div>
              <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/40">
                <span className="text-[10px] font-mono text-slate-500 block">SISTEMA DE ALINEACIÓN</span>
                <span className="text-slate-200 text-sm font-semibold font-mono">Ambos juegan 4-3-3 Ofensivo</span>
              </div>
              <div className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/40">
                <span className="text-[10px] font-mono text-slate-500 block">PRESIÓN DEL ESTADIO</span>
                <span className="text-slate-200 text-sm font-semibold font-mono">Humedad 58% • Estable</span>
              </div>
            </div>
          </div>

          {/* External Streaming Servers / High-Speed Mirrors */}
          <div className="bg-slate-900/40 border border-slate-800/60 rounded-2xl p-5 space-y-4">
            <h3 className="text-slate-200 font-display font-bold text-sm flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
              </span>
              Señales Alternativas de Transmisión (HD & 4K Sin Cortes)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <a 
                href="https://www.effectivecpmnetwork.com/buhijyg7f?key=13068f034ef40ff700331e7aa5eb3d3e"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 hover:border-yellow-400/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs">⚡</span>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-yellow-400 transition block">Servidor Ultra HD</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Latencia 0.2s • 1080p</span>
                  </div>
                </div>
                <span className="text-[10px] bg-cyan-950 text-cyan-400 px-1.5 py-0.5 rounded font-mono font-bold">ACTIVO</span>
              </a>

              <a 
                href="https://www.effectivecpmnetwork.com/buhijyg7f?key=13068f034ef40ff700331e7aa5eb3d3e"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 hover:border-yellow-400/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs">🔥</span>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-yellow-400 transition block">Servidor VIP 4K</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Latencia 0.5s • UltraHD</span>
                  </div>
                </div>
                <span className="text-[10px] bg-purple-950 text-purple-400 px-1.5 py-0.5 rounded font-mono font-bold">ONLINE</span>
              </a>

              <a 
                href="https://www.effectivecpmnetwork.com/buhijyg7f?key=13068f034ef40ff700331e7aa5eb3d3e"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between bg-slate-950/60 p-3 rounded-xl border border-slate-800/60 hover:border-yellow-400/40 hover:bg-slate-900 transition group"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-xs">⚽</span>
                  <div className="text-left">
                    <span className="text-xs font-semibold text-slate-200 group-hover:text-yellow-400 transition block">Señal Premium ES</span>
                    <span className="text-[9px] font-mono text-slate-500 uppercase block">Latencia 0.1s • Multiaudio</span>
                  </div>
                </div>
                <span className="text-[10px] bg-yellow-950 text-yellow-400 px-1.5 py-0.5 rounded font-mono font-bold">LIVE HD</span>
              </a>
            </div>
          </div>

        </div>

        {/* Right Side: Tabbed Interactive Box */}
        <div className="lg:col-span-4 border-l border-slate-800/80 bg-slate-900/20 flex flex-col h-full overflow-hidden">
          
          {/* Tab Selection */}
          <div className="grid grid-cols-4 border-b border-slate-800/80 bg-slate-900/60 p-1">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`py-3 text-xs font-display font-bold transition flex flex-col items-center gap-1 rounded-lg cursor-pointer ${
                activeTab === 'chat' ? 'bg-slate-800 text-yellow-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Chat en vivo</span>
            </button>
            <button 
              onClick={() => setActiveTab('stats')}
              className={`py-3 text-xs font-display font-bold transition flex flex-col items-center gap-1 rounded-lg cursor-pointer ${
                activeTab === 'stats' ? 'bg-slate-800 text-yellow-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Estadísticas</span>
            </button>
            <button 
              onClick={() => setActiveTab('lineups')}
              className={`py-3 text-xs font-display font-bold transition flex flex-col items-center gap-1 rounded-lg cursor-pointer ${
                activeTab === 'lineups' ? 'bg-slate-800 text-yellow-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <ListCollapse className="w-4 h-4" />
              <span>Alineaciones</span>
            </button>
            <button 
              onClick={() => setActiveTab('commentary')}
              className={`py-3 text-xs font-display font-bold transition flex flex-col items-center gap-1 rounded-lg cursor-pointer ${
                activeTab === 'commentary' ? 'bg-slate-800 text-yellow-400 font-extrabold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <AlignJustify className="w-4 h-4" />
              <span>Eventos</span>
            </button>
          </div>

          {/* Scrollable Tab Content Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 min-h-0">
            
            {/* Live Chat Content */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-full justify-between">
                
                {/* Rolling Messages Box */}
                <div className="flex-1 space-y-3 pr-1 overflow-y-auto min-h-[300px] max-h-[500px]">
                  {chatMessages.map((msg) => (
                    <div 
                      key={msg.id} 
                      className={`flex items-start gap-2.5 text-xs p-2 rounded-xl transition ${
                        msg.isUser 
                          ? 'bg-yellow-950/20 border border-yellow-900/30' 
                          : msg.user.includes('ALERT') 
                          ? 'bg-yellow-950/20 border border-yellow-900/40 text-yellow-300 font-semibold' 
                          : 'bg-slate-900/50 hover:bg-slate-900/80'
                      }`}
                    >
                      <span className="text-base select-none">{msg.avatar}</span>
                      <div className="flex-1 space-y-0.5">
                        <div className="flex items-center justify-between">
                          <span className={`font-semibold ${msg.isUser ? 'text-yellow-400 font-bold' : 'text-slate-300'}`}>
                            {msg.user}
                          </span>
                          <span className="text-[10px] font-mono text-slate-500">{msg.time}</span>
                        </div>
                        <p className="text-slate-300 leading-normal">{msg.message}</p>
                      </div>
                    </div>
                  ))}
                  <div ref={chatEndRef} />
                </div>

                {/* Submit Field */}
                <form onSubmit={handleSendMessage} className="mt-4 flex items-center gap-2 border-t border-slate-800 pt-3">
                  <input 
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    placeholder="Escribe un mensaje para los hinchas..."
                    className="flex-1 bg-slate-950/80 text-slate-200 border border-slate-800/80 rounded-xl px-4 py-2.5 text-xs focus:outline-none focus:border-yellow-400/50 font-mono"
                  />
                  <button 
                    type="submit"
                    className="p-2.5 bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl transition shadow-md shadow-yellow-500/10 cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>
              </div>
            )}

            {/* Match Stats Content */}
            {activeTab === 'stats' && (
              <div className="space-y-5 py-2">
                
                {/* Possession Graphic */}
                <div className="space-y-1.5">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-cyan-400 font-semibold">🇦🇷 {stats.possessionHome}%</span>
                    <span className="text-slate-400 font-bold uppercase">POSESIÓN</span>
                    <span className="text-purple-400 font-semibold">{stats.possessionAway}% 🇫🇷</span>
                  </div>
                  <div className="h-2 bg-slate-800 rounded-full flex overflow-hidden">
                    <div className="bg-cyan-400 h-full transition-all duration-500" style={{ width: `${stats.possessionHome}%` }} />
                    <div className="bg-purple-500 h-full transition-all duration-500" style={{ width: `${stats.possessionAway}%` }} />
                  </div>
                </div>

                {/* Grid stats comparing numerical attributes */}
                {[
                  { label: 'REMATES AL ARCO', home: stats.shotsHome, away: stats.shotsAway },
                  { label: 'FALTAS COMETIDAS', home: stats.foulsHome, away: stats.foulsAway },
                  { label: 'TIROS DE ESQUINA', home: stats.cornersHome, away: stats.cornersAway },
                  { label: 'TARJETAS AMARILLAS', home: stats.yellowHome, away: stats.yellowAway },
                ].map((stat, idx) => {
                  const total = stat.home + stat.away;
                  const homePercent = total > 0 ? (stat.home / total) * 100 : 50;
                  
                  return (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex justify-between text-xs font-mono">
                        <span className="text-slate-200 font-bold">{stat.home}</span>
                        <span className="text-slate-500 text-[10px]">{stat.label}</span>
                        <span className="text-slate-200 font-bold">{stat.away}</span>
                      </div>
                      <div className="h-1.5 bg-slate-800/60 rounded-full flex overflow-hidden">
                        <div className="bg-yellow-400 h-full transition-all" style={{ width: `${homePercent}%` }} />
                        <div className="bg-slate-750 h-full transition-all" style={{ width: `${100 - homePercent}%` }} />
                      </div>
                    </div>
                  );
                })}

                {/* Prediction gauge based on sliders */}
                <div className="mt-6 bg-slate-950/40 p-4 rounded-xl border border-slate-800/40 text-center">
                  <span className="text-[10px] font-mono text-slate-500 block uppercase">PROBABILIDAD DE VICTORIA</span>
                  <div className="flex items-center justify-center gap-3 mt-2 text-sm font-display font-semibold">
                    <span className="text-cyan-400">ARG: 42%</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-slate-300">Empate: 31%</span>
                    <span className="text-slate-500">•</span>
                    <span className="text-purple-400">FRA: 27%</span>
                  </div>
                </div>
              </div>
            )}

            {/* Tactical Lineups Content */}
            {activeTab === 'lineups' && (
              <div className="space-y-4">
                {/* Team Selector toggle */}
                <div className="flex bg-slate-950/60 border border-slate-800 p-1 rounded-xl">
                  <button 
                    onClick={() => setLineupTeam('home')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition cursor-pointer ${
                      lineupTeam === 'home' ? 'bg-slate-800 text-cyan-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🇦🇷 Alineación {match.homeTeam.name}
                  </button>
                  <button 
                    onClick={() => setLineupTeam('away')}
                    className={`flex-1 py-1.5 rounded-lg text-xs font-display font-bold transition cursor-pointer ${
                      lineupTeam === 'away' ? 'bg-slate-800 text-purple-400' : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    🇫🇷 Alineación {match.awayTeam.name}
                  </button>
                </div>

                {/* Lineup display list */}
                {lineupTeam === 'home' ? (
                  <div className="space-y-2 bg-slate-950/20 p-3 rounded-xl border border-slate-800/40 text-xs">
                    <div className="flex justify-between border-b border-slate-800/50 pb-2">
                      <span className="text-slate-500 font-mono">FORMACIÓN</span>
                      <span className="text-yellow-400 font-bold font-mono">{match.homeTeam.lineup.formation}</span>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between"><span className="text-slate-400">POR</span><span className="text-slate-200 font-medium">{match.homeTeam.lineup.goalkeeper}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">DEF</span><span className="text-slate-200 font-medium">{match.homeTeam.lineup.defenders.join(', ')}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">MED</span><span className="text-slate-200 font-medium">{match.homeTeam.lineup.midfielders.join(', ')}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">DEL</span><span className="text-slate-200 font-medium font-bold text-yellow-400">{match.homeTeam.lineup.attackers.join(', ')}</span></div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 bg-slate-950/20 p-3 rounded-xl border border-slate-800/40 text-xs">
                    <div className="flex justify-between border-b border-slate-800/50 pb-2">
                      <span className="text-slate-500 font-mono">FORMACIÓN</span>
                      <span className="text-yellow-400 font-bold font-mono">{match.awayTeam.lineup.formation}</span>
                    </div>
                    <div className="space-y-1.5 pt-2">
                      <div className="flex justify-between"><span className="text-slate-400">POR</span><span className="text-slate-200 font-medium">{match.awayTeam.lineup.goalkeeper}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">DEF</span><span className="text-slate-200 font-medium">{match.awayTeam.lineup.defenders.join(', ')}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">MED</span><span className="text-slate-200 font-medium">{match.awayTeam.lineup.midfielders.join(', ')}</span></div>
                      <div className="flex justify-between"><span className="text-slate-400">DEL</span><span className="text-slate-200 font-medium font-bold text-purple-400">{match.awayTeam.lineup.attackers.join(', ')}</span></div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Commentary Tab Content */}
            {activeTab === 'commentary' && (
              <div className="space-y-3 pr-1">
                {commentary.map((evt, index) => (
                  <div key={index} className="bg-slate-950/30 p-3 rounded-xl border border-slate-800/40 text-xs flex gap-2.5 items-start">
                    <span className="text-yellow-400 font-mono font-bold">{evt.minute}&apos;</span>
                    <p className="text-slate-300 leading-normal">{evt.description}</p>
                  </div>
                ))}
              </div>
            )}

          </div>

          {/* Ad banner integration */}
          <div className="px-4">
            <AdProfessionalSlot type="banner" />
          </div>

          {/* Prompt info */}
          <div className="p-4 bg-slate-950/60 border-t border-slate-800/80 text-center text-[10px] font-mono text-slate-500">
            Transmitiendo a través de la señal oficial de la UEFA y la FIFA
          </div>

        </div>

      </div>
    </div>
  );
}
