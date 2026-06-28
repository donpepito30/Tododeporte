import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Tv, Radio, Search, Bell, Mail, ArrowRight, ShieldCheck, Heart, Users, Star, Flame, Sparkles, Play } from 'lucide-react';

import { featuredMatch, upcomingMatches } from './data/matches';
import { Match } from './types';

// Components
import FeaturedMatch from './components/FeaturedMatch';
import UpcomingSchedule from './components/UpcomingSchedule';
import TacticalHypeEngine from './components/TacticalHypeEngine';
import LiveStreamSimulator from './components/LiveStreamSimulator';

export default function App() {
  const [activeLiveMatch, setActiveLiveMatch] = useState<Match | null>(null);
  const [selectedLiveCamera, setSelectedLiveCamera] = useState<number | undefined>(undefined);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  const handleWatchLive = (match: Match, cameraId?: number) => {
    setActiveLiveMatch(match);
    setSelectedLiveCamera(cameraId);
  };
  
  // Real-time Countdown Timer to the next match (Brazil vs Germany tomorrow)
  const [timeLeft, setTimeLeft] = useState({
    days: 1,
    hours: 14,
    minutes: 35,
    seconds: 42,
  });

  useEffect(() => {
    // Set simulated countdown countdown target
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 1);
    targetDate.setHours(18, 0, 0, 0);

    const timer = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate.getTime() - now;

      if (difference <= 0) {
        clearInterval(timer);
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const d = Math.floor(difference / (1000 * 60 * 60 * 24));
        const h = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((difference % (1000 * 60)) / 1000);
        
        setTimeLeft({ days: d, hours: h, minutes: m, seconds: s });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleNewsletterSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;
    setNewsletterSuccess(true);
    setNewsletterEmail('');
    setTimeout(() => setNewsletterSuccess(false), 5000);
  };

  const handleScrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-yellow-400 selection:text-slate-950 pb-12 relative overflow-x-hidden">
      
      {/* Background radial glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-yellow-400/5 blur-[120px] rounded-full pointer-events-none -z-10" />
      <div className="absolute top-[1200px] right-0 w-[500px] h-[500px] bg-purple-500/5 blur-[120px] rounded-full pointer-events-none -z-10" />

      {/* Top Banner: Global Announcement & Countdown */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border-b border-slate-800/60 py-2.5 px-4 text-center text-xs text-slate-400 font-mono flex flex-wrap justify-center items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-1.5">
          <Flame className="w-3.5 h-3.5 text-yellow-400 animate-bounce animate-pulse" />
          <span>La próxima semifinal comienza en:</span>
        </div>
        
        {/* Live Countdown Clock */}
        <div className="flex items-center gap-2 text-yellow-400 font-bold neon-glow-yellow">
          <span>{timeLeft.days}d</span>
          <span>:</span>
          <span>{timeLeft.hours.toString().padStart(2, '0')}h</span>
          <span>:</span>
          <span>{timeLeft.minutes.toString().padStart(2, '0')}m</span>
          <span>:</span>
          <span>{timeLeft.seconds.toString().padStart(2, '0')}s</span>
        </div>
        
        <div className="hidden lg:flex items-center gap-1.5 text-slate-500">
          <span>•</span>
          <Trophy className="w-3 h-3 text-yellow-400" />
          <span>Transmisión Premium de Lusail Grand Stage Activada</span>
        </div>
      </div>

      {/* Primary Navigation Header */}
      <header className="sticky top-0 bg-slate-950/80 backdrop-blur-md border-b border-slate-900 z-40 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-yellow-400 via-fuchsia-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-yellow-500/20">
              <Trophy className="w-5.5 h-5.5 text-slate-950 stroke-[2.5]" />
            </div>
            <div>
              <h1 className="text-md font-display font-extrabold tracking-tight text-white uppercase">
                Centro de Partidos del Mundial
              </h1>
              <span className="text-[9px] font-mono text-yellow-400 tracking-wider font-bold block">
                CENTRO DE ANÁLISIS TÁCTICO Y TRANSMISIONES
              </span>
            </div>
          </div>

          {/* Nav links */}
          <nav className="hidden md:flex items-center gap-6 text-xs font-display font-bold text-slate-400">
            <button 
              onClick={() => handleScrollToSection('featured-match-section')}
              className="hover:text-yellow-400 transition cursor-pointer"
            >
              PARTIDO DESTACADO
            </button>
            <button 
              onClick={() => handleScrollToSection('upcoming-schedule-section')}
              className="hover:text-yellow-400 transition cursor-pointer"
            >
              CALENDARIO DE PARTIDOS
            </button>
            <button 
              onClick={() => handleScrollToSection('tactical-hype-engine')}
              className="hover:text-yellow-400 transition cursor-pointer"
            >
              PREDICTOR TÁCTICO
            </button>
          </nav>

          {/* Action Button */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => handleWatchLive(featuredMatch)}
              className="flex items-center gap-2 bg-red-650 hover:bg-red-600 text-white border border-red-500/40 hover:border-red-400 px-4 py-2 rounded-xl text-xs font-display font-black transition shadow-lg shadow-red-650/45 cursor-pointer animate-pulse shrink-0"
            >
              <span className="w-2 h-2 rounded-full bg-white animate-ping" />
              <span>EVENTO EN VIVO</span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Page Layout */}
      <main className="max-w-7xl mx-auto px-6 space-y-20">
        
        {/* SECCIÓN ESPECIAL: EVENTOS DE HOY - TRANSMISIONES SATELITALES COHERENTES */}
        <section className="mt-8 space-y-10 scroll-mt-24" id="hoy-en-vivo-section">
          <div className="border-b border-slate-900/80 pb-6">
            <div className="flex items-center gap-2.5">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              <span className="text-xs font-mono text-red-400 font-bold uppercase tracking-wider">EVENTOS DE HOY • SEÑALES EXCLUSIVAS ACTIVAS</span>
            </div>
            <h2 className="text-2xl sm:text-4xl font-display font-extrabold text-slate-100 mt-2">
              Centro de Monitoreo Satelital de la FIFA
            </h2>
            <p className="text-sm text-slate-400 mt-2 max-w-3xl leading-relaxed">
              Sintoniza transmisiones exclusivas en alta definición. Haz clic en cualquier ángulo para conectar al servidor interactivo en vivo.
            </p>
          </div>

          <div className="space-y-16">
            {[
              {
                id: 0,
                title: "Canal Satelital 1: Señal Principal de Transmisión HD",
                subtitle: "Vista Panorámica del Estadio Arena Lusail",
                url: "https://i.ibb.co/5gkgV4yQ/Chat-GPT-Image-27-jun-2026-23-52-41.png",
                icon: "📹",
                badge: "EN VIVO • SEÑAL TV",
                badgeColor: "bg-red-500/15 text-red-400 border-red-500/30",
                copy: "Plano general oficial desde la tribuna alta del Estadio Lusail. Captura todo el campo para seguir la trayectoria del balón, transiciones y gradas con alta nitidez original en tiempo real.",
                specs: [
                  "Transmisión: UltraHD 4K • 60 FPS",
                  "Audio: Dolby Atmos 5.1 Envolvente",
                  "Lente: Gran Angular de Emisión Profesional",
                  "Estado: Sincronizado con Satélite Eutelsat"
                ]
              },
              {
                id: 1,
                title: "Canal Satelital 2: Cámara Táctica 3D y Telemetría IA",
                subtitle: "Pizarra Interactiva de Análisis de Espacios y Formaciones",
                url: "https://i.ibb.co/2Y81Cjns/Chat-GPT-Image-27-jun-2026-23-46-39.png",
                icon: "📊",
                badge: "DATOS • TIEMPO REAL",
                badgeColor: "bg-cyan-500/15 text-cyan-400 border-cyan-500/30",
                copy: "Señal procesada con inteligencia artificial para proyectar vectores posicionales, mapas de calor y líneas de pase en vivo. Analiza el bloque defensivo de ambos equipos y el xG dinámico al instante.",
                specs: [
                  "Tecnología: Red Neuronal de Tracking Óptico",
                  "Frecuencia: Actualización de datos a 120Hz",
                  "Superposición: Gráficos de Vectores de Posesión",
                  "Cálculo: xG dinámico por jugador"
                ]
              },
              {
                id: 2,
                title: "Canal Satelital 3: Área Técnica y Foco del Entrenador",
                subtitle: "Reacciones y Ajustes Tácticos desde el Banquillo de Suplentes",
                url: "https://i.ibb.co/PZS5Q42x/Chat-GPT-Image-27-jun-2026-23-43-46.png",
                icon: "👔",
                badge: "EXCLUSIVO • BANQUILLOS",
                badgeColor: "bg-purple-500/15 text-purple-400 border-purple-500/30",
                copy: "Ángulo exclusivo enfocado en directores técnicos, asistentes y banquillos. Sigue indicaciones, pizarras de tácticas rápidas y el movimiento pre-competitivo con máxima cercanía y nitidez.",
                specs: [
                  "Lente: Cine-Zoom Premium de 200mm",
                  "Cobertura: 100% de la Banda Lateral",
                  "Latencia: Conexión Óptica Directa (<0.1s)",
                  "Micrófono: Direccional de Zona de Cal"
                ]
              },
              {
                id: 3,
                title: "Canal Satelital 4: Spidercam Cenital Inteligente",
                subtitle: "Perspectiva Aérea Tridimensional sobre el Círculo Central",
                url: "https://i.ibb.co/WWwz0gc0/Chat-GPT-Image-27-jun-2026-23-42-32.png",
                icon: "🛸",
                badge: "AÉREO • VISTA GLOBAL",
                badgeColor: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
                copy: "Perspectiva cenital suspendida por cables giroscópicos. Ideal para visualizar la simetría espacial de alineaciones, tiros de esquina y táctica colectiva con nitidez de borde a borde.",
                specs: [
                  "Estructura: Suspensión de Fibra de Carbono de 4 Hilos",
                  "Estabilización: Giroscopio Activo de Tres Ejes",
                  "Resolución: Lente Gran Angular 4K HDR nativo",
                  "Rango: Desplazamiento dinámico omnidireccional"
                ]
              }
            ].map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div 
                  key={item.id} 
                  className={`flex flex-col lg:flex-row gap-8 items-center bg-slate-900/20 hover:bg-slate-900/30 border border-slate-900/80 hover:border-slate-800 p-6 rounded-3xl transition duration-500 group relative overflow-hidden`}
                >
                  {/* Subtle background ambient light */}
                  <div className={`absolute top-1/2 -translate-y-1/2 w-48 h-48 rounded-full blur-[80px] opacity-[0.03] pointer-events-none -z-10 ${isEven ? 'left-10 bg-yellow-400' : 'right-10 bg-cyan-400'}`} />

                  {/* Image Container with precise aspect-ratio and object-contain (NO cuts, absolute clarity) */}
                  <div 
                    onClick={() => handleWatchLive(featuredMatch, item.id)}
                    className={`w-full lg:w-[52%] aspect-[16/10] bg-slate-950/80 rounded-2xl border border-slate-800/80 p-1.5 flex items-center justify-center relative overflow-hidden shadow-2xl transition duration-500 group-hover:border-slate-700/60 cursor-pointer ${!isEven ? 'lg:order-2' : ''}`}
                  >
                    <img 
                      src={item.url} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-contain object-center rounded-xl bg-slate-950 select-none transition duration-700 group-hover:scale-[1.01]"
                    />

                    {/* Play Button Overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-950/20 group-hover:bg-slate-950/35 transition-all duration-300">
                      <div className="w-14 h-14 rounded-full bg-red-650 text-white flex items-center justify-center shadow-lg shadow-red-650/40 border-2 border-white scale-100 group-hover:scale-110 transition duration-300">
                        <Play className="w-6 h-6 fill-white ml-0.5" />
                      </div>
                    </div>
                    
                    {/* Camera indicator overlay */}
                    <div className="absolute top-4 left-4 bg-slate-950/90 border border-slate-800/80 px-2.5 py-1 rounded-md text-[9px] font-mono font-bold tracking-wider text-slate-300 flex items-center gap-1.5 backdrop-blur-md">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                      <span>{item.icon} CH-{item.id + 1}</span>
                    </div>

                    <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800/80 px-2.5 py-1 rounded-md text-[9px] font-mono text-slate-400 backdrop-blur-md">
                      100% NITIDEZ ORIGINAL
                    </div>
                  </div>

                  {/* Copywriting & Specs side */}
                  <div className="w-full lg:w-[48%] space-y-4">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border ${item.badgeColor}`}>
                        {item.badge}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">CANAL OFICIAL FIFA</span>
                    </div>

                    <div className="space-y-1">
                      <h3 className="font-display font-extrabold text-lg text-slate-100 group-hover:text-yellow-400 transition leading-snug">
                        {item.title}
                      </h3>
                      <p className="font-sans font-medium text-xs text-yellow-400/80">
                        {item.subtitle}
                      </p>
                    </div>

                    <p className="text-xs text-slate-400 leading-relaxed font-sans text-justify">
                      {item.copy}
                    </p>

                    {/* Detailed Spec List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-slate-900/60">
                      {item.specs.map((spec, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500">
                          <span className="w-1 h-1 rounded-full bg-yellow-400/70" />
                          <span>{spec}</span>
                        </div>
                      ))}
                    </div>

                    {/* Action button */}
                    <div className="pt-2">
                      <button 
                        onClick={() => handleWatchLive(featuredMatch, item.id)}
                        className="flex items-center gap-2 bg-red-650 hover:bg-red-600 text-white border border-red-500/50 hover:border-red-400 px-5 py-2.5 rounded-xl text-xs font-display font-extrabold transition duration-300 shadow-md shadow-red-600/20 group/btn cursor-pointer animate-pulse"
                      >
                        <Tv className="w-4 h-4 group-hover/btn:scale-110 transition-transform" />
                        <span>VER EL PARTIDO • EVENTO EN VIVO</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* 1. Hero Section */}
        <section className="relative rounded-3xl overflow-hidden border border-slate-900 mt-6 min-h-[480px] flex items-center">
          
          {/* Background stadium image with radial dark vignette */}
          <div className="absolute inset-0 -z-10">
            <img 
              src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&q=80&w=1400" 
              alt="World Cup stadium crowd" 
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover opacity-35 filter brightness-50" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
          </div>

          {/* Hero Content */}
          <div className="p-8 md:p-12 lg:p-16 max-w-2xl space-y-6">
            
            <div className="inline-flex items-center gap-2 bg-yellow-400/10 border border-yellow-450/20 px-3.5 py-1.5 rounded-full text-[11px] font-mono font-bold text-yellow-400 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              La Cumbre del Deporte Mundial
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold text-white leading-none tracking-tight">
              SÉ TESTIGO DEL <span className="bg-gradient-to-r from-yellow-400 via-fuchsia-500 to-cyan-400 bg-clip-text text-transparent">MUNDIAL</span> RENACIDO
            </h1>

            <p className="text-slate-400 text-sm md:text-base leading-relaxed">
              Vive los partidos con simuladores tácticos, análisis interactivos de alineaciones y transmisiones multi-ángulo en tiempo real.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-2">
              <button 
                onClick={() => handleWatchLive(featuredMatch)}
                className="flex items-center gap-2.5 bg-red-650 hover:bg-red-600 text-white border border-red-500/40 font-display font-black text-sm px-7 py-3.5 rounded-xl transition duration-300 shadow-lg shadow-red-650/50 group cursor-pointer animate-pulse"
              >
                <Tv className="w-4.5 h-4.5 group-hover:scale-110 transition-transform" />
                <span>VER EL PARTIDO • EVENTO EN VIVO</span>
              </button>
              
              <button 
                onClick={() => handleScrollToSection('tactical-hype-engine')}
                className="flex items-center gap-2 bg-slate-900/80 border border-slate-800 hover:border-slate-700 hover:text-white text-slate-300 font-display font-bold text-sm px-7 py-3.5 rounded-xl transition duration-300 cursor-pointer hover:bg-slate-850"
              >
                <span>Predictor Estratégico</span>
              </button>
            </div>

            {/* Key stats banner */}
            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-slate-900/80 max-w-md">
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] font-mono uppercase block">USUARIOS ACTIVOS</span>
                <span className="text-white text-lg font-bold font-display">2.4M en Vivo</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] font-mono uppercase block">PROMEDIO DE GOLES</span>
                <span className="text-white text-lg font-bold font-display">3.12 / Partido</span>
              </div>
              <div className="space-y-0.5">
                <span className="text-slate-500 text-[10px] font-mono uppercase block">CANALES DE TRANSMISIÓN</span>
                <span className="text-white text-lg font-bold font-display">8 Ángulos</span>
              </div>
            </div>

          </div>

        </section>

        {/* 2. Featured Match Breakdown (The Core) */}
        <section id="featured-match-section" className="space-y-6 scroll-mt-24">
          <div>
            <h2 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-100 tracking-tight">
              Evento Principal de Esta Noche
            </h2>
            <p className="text-xs text-slate-500 mt-1 uppercase font-mono tracking-wider">
              Análisis de texto exclusivo, alineaciones y vista previa interactiva de video promocional
            </p>
          </div>
          
          <FeaturedMatch 
            match={featuredMatch} 
            onWatchLive={() => handleWatchLive(featuredMatch)} 
          />
        </section>

        {/* 3. Upcoming Schedule Grid */}
        <section id="upcoming-schedule-section" className="scroll-mt-24">
          <UpcomingSchedule 
            matches={upcomingMatches} 
            onSelectMatch={(match) => handleWatchLive(match)}
          />
        </section>

        {/* 4. Tactical Hype Engine */}
        <section id="tactical-hype-engine" className="scroll-mt-24">
          <TacticalHypeEngine matches={[featuredMatch, ...upcomingMatches]} />
        </section>

        {/* 4.5 Copa Mundial Media Gallery */}
        <section id="media-center-section" className="scroll-mt-24 space-y-6">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-slate-100 flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
              </span>
              Canales Satelitales Secundarios
            </h2>
            <p className="text-xs text-slate-400 max-w-xl">
              Cámaras de alta definición. Conéctate con el servidor interactivo al instante.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                id: 0,
                name: 'Señal Principal HD (Arena Lusail)',
                url: 'https://i.ibb.co/5gkgV4yQ/Chat-GPT-Image-27-jun-2026-23-52-41.png',
                icon: '📹',
                badge: 'VIVO • HD BROADCAST',
                badgeColor: 'bg-red-500/20 text-red-400 border-red-500/30',
                desc: 'Ángulo principal desde la tribuna central. Ideal para seguir el balón, la velocidad de transiciones y la atmósfera.',
                spec: 'Bitrate: 15 Mbps • Audio Dolby Atmos 5.1'
              },
              {
                id: 1,
                name: 'Cámara Táctica 3D & Telemetría',
                url: 'https://i.ibb.co/2Y81Cjns/Chat-GPT-Image-27-jun-2026-23-46-39.png',
                icon: '📊',
                badge: 'DATOS • INTELIGENTE',
                badgeColor: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
                desc: 'Mapeo tridimensional de movimientos con IA y rastreo óptico. Analiza pases, espacios y mapas de calor.',
                spec: 'Frecuencia: 60 FPS • Tracking Óptico Directo'
              },
              {
                id: 2,
                name: 'Área Técnica & Banquillo de Estrategas',
                url: 'https://i.ibb.co/PZS5Q42x/Chat-GPT-Image-27-jun-2026-23-43-46.png',
                icon: '👔',
                badge: 'EXCLUSIVO • DIRECTORES',
                badgeColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
                desc: 'Seguimiento enfocado en directores técnicos y suplentes. Monitorea gestos, indicaciones y reacciones tácticas.',
                spec: 'Lente: Cine-Zoom 200mm • Latencia Cero'
              },
              {
                id: 3,
                name: 'Spidercam Cenital Inteligente',
                url: 'https://i.ibb.co/WWwz0gc0/Chat-GPT-Image-27-jun-2026-23-42-32.png',
                icon: '🛸',
                badge: 'AÉREO • VISTA DE PÁJARO',
                badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
                desc: 'Perspectiva aérea suspendida sobre el césped. Ofrece cobertura cenital para analizar formaciones y balón parado.',
                spec: 'Giroscópico • 4K UHD Ultra Wide'
              }
            ].map((feed) => (
              <div 
                key={feed.id}
                onClick={() => {
                  handleWatchLive(featuredMatch);
                }}
                className="group relative h-auto min-h-[420px] rounded-2xl overflow-hidden border border-slate-800/80 bg-slate-900/40 backdrop-blur-sm cursor-pointer hover:border-red-500/40 hover:shadow-xl hover:shadow-red-500/5 transition-all duration-300 flex flex-col justify-between p-5"
              >
                {/* Background Image / Render Preview */}
                <div className="absolute inset-0 z-0 h-44 overflow-hidden border-b border-slate-800/60 relative">
                  <img 
                    src={feed.url} 
                    alt={feed.name} 
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
                  
                  {/* Play Button Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-950/10 group-hover:bg-slate-950/20 transition duration-300">
                    <div className="w-11 h-11 rounded-full bg-red-650 text-white flex items-center justify-center shadow-lg shadow-red-650/40 border-2 border-white scale-100 group-hover:scale-110 transition duration-300">
                      <Play className="w-4 h-4 fill-white ml-0.5" />
                    </div>
                  </div>
                </div>

                {/* Empty Spacer to push content below the upper background image */}
                <div className="h-40 pointer-events-none" />

                {/* Content Details */}
                <div className="relative z-10 space-y-3 flex flex-col flex-grow justify-between pt-2">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{feed.icon}</span>
                      <span className={`text-[8px] font-mono font-bold px-2 py-0.5 rounded border ${feed.badgeColor}`}>
                        {feed.badge}
                      </span>
                    </div>

                    <h3 className="font-display font-extrabold text-sm text-slate-100 group-hover:text-red-400 transition leading-snug">
                      {feed.name}
                    </h3>
                    
                    <p className="text-[10px] text-slate-400 leading-relaxed font-sans">
                      {feed.desc}
                    </p>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-slate-800/50">
                    <span className="text-[8px] font-mono text-slate-500 block uppercase tracking-wide">
                      {feed.spec}
                    </span>
                    <div className="flex items-center gap-1.5 text-[9px] font-mono text-red-500 uppercase tracking-wider font-extrabold">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-pulse" />
                      <span>VER EL PARTIDO • EN VIVO</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Newsletter Sign Up */}
        <section className="bg-gradient-to-b from-slate-900/40 to-slate-950/20 border border-slate-900 rounded-3xl p-8 md:p-12 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-2 lg:max-w-md">
            <span className="text-[10px] font-mono text-yellow-400 font-bold uppercase tracking-widest block">
              CANAL VIP DEL MUNDIAL
            </span>
            <h3 className="text-xl sm:text-2xl font-display font-bold text-slate-100">
              Recibe Notificaciones de Inicio al Instante
            </h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Suscríbete para recibir recordatorios al instante, análisis tácticos y acceso exclusivo a las señales en vivo antes de cada partido.
            </p>
          </div>

          {/* Form with success states */}
          <div className="w-full lg:max-w-md">
            {newsletterSuccess ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-yellow-400/10 border border-yellow-450/30 p-5 rounded-2xl text-center text-xs text-yellow-400 font-mono"
              >
                🎉 ¡SUSCRIPCIÓN EXITOSA! Te hemos añadido al sistema de notificaciones de transmisiones premium. ¡Mantente atento!
              </motion.div>
            ) : (
              <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email"
                  required
                  placeholder="Ingresa tu dirección de correo..."
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-3.5 text-xs text-slate-200 focus:outline-none focus:border-yellow-400/50 font-mono"
                />
                <button 
                  type="submit"
                  className="bg-yellow-400 hover:bg-yellow-300 text-slate-950 font-display font-bold text-xs px-6 py-3.5 rounded-xl transition flex items-center justify-center gap-2 cursor-pointer btn-cta-pulse"
                >
                  <span>Suscribirse VIP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
            <p className="text-[10px] text-slate-600 font-mono mt-3 text-center lg:text-left">
              * Garantía de cero spam. Cancela tu suscripción de forma segura con un solo clic.
            </p>
          </div>
        </section>

      </main>

      {/* Footer Section */}
      <footer className="mt-20 border-t border-slate-900 pt-8 max-w-7xl mx-auto px-6 text-slate-500 text-xs">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-8 border-b border-slate-900/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center">
              <Trophy className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="font-display font-bold text-slate-400 text-sm">Centro de Partidos del Mundial</span>
          </div>

          <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-slate-600 font-mono text-[10px]">
            <a href="#" className="hover:text-slate-400 transition">Términos de Transmisión</a>
            <a href="#" className="hover:text-slate-400 transition">Protocolos de Privacidad</a>
            <a href="#" className="hover:text-slate-400 transition">Licencias UEFA y FIFA</a>
            <a href="#" className="hover:text-slate-400 transition">Centro de Soporte</a>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[10px] text-slate-600">
          <p>© 2026 Centro de Partidos del Mundial. Todos los derechos reservados. Simulador de transmisión totalmente autorizado.</p>
          <div className="flex items-center gap-1">
            <span>Creado con</span>
            <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            <span>para entusiastas del fútbol de todo el mundo.</span>
          </div>
        </div>
      </footer>

      {/* 6. Live Stream Center Overlay Modal */}
      <AnimatePresence>
        {activeLiveMatch && (
          <LiveStreamSimulator 
            match={activeLiveMatch} 
            onClose={() => {
              setActiveLiveMatch(null);
              setSelectedLiveCamera(undefined);
            }} 
            initialCameraId={selectedLiveCamera}
          />
        )}
      </AnimatePresence>

    </div>
  );
}
