import React, { useState, useEffect } from 'react'
import { Clock, Calendar, MapPin, MessageCircle, Star } from 'lucide-react'

const App = () => {
  // Configuração das datas
  const partyDate = new Date('2026-01-17T09:00:00').getTime()
  const rsvpDeadline = new Date('2025-12-10T23:59:59').getTime()

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isRsvpOpen, setIsRsvpOpen] = useState(true)
  const [sparkles, setSparkles] = useState([])

  // Gera purpurina: cada estrela executa o `twinkle` uma vez; no fim do `animationend` teleportamos
  useEffect(() => {
    const newSparkles = []
    for (let i = 0; i < 160; i++) {
      const p = Math.random()
      let color = '#ffd700'
      if (p < 0.45) color = '#ffd700'
      else if (p < 0.75) color = '#ffffff'
      else if (p < 0.9) color = '#c0c0c0'
      else if (p < 0.96) color = '#ffd1e6'
      else color = '#dcd3ff'

      const size = Math.random() * 4 + 1
      const z = Math.random() < 0.6 ? 0 : (Math.random() < 0.5 ? 1 : 2)
      let opacity
      if (color === '#ffd700') opacity = Math.random() * 0.5 + 0.45
      else if (color === '#ffffff') opacity = Math.random() * 0.6 + 0.2
      else if (color === '#c0c0c0') opacity = Math.random() * 0.5 + 0.25
      else opacity = Math.random() * 0.5 + 0.2

      newSparkles.push({
        id: i,
        left: Math.random() * 94 + 3,
        top: Math.random() * 94 + 3,
        size,
        duration: Math.random() * 2.5 + 0.8,
        delay: Math.random() * 1.2,
        opacity,
        color,
        z,
        tick: 0
      })
    }

    setSparkles(newSparkles)

    return () => {
      // nothing to cleanup since we're not using timers here
    }
  }, [])

  const handleAnimationEnd = (id) => {
    setSparkles((prev) => prev.map((s) => {
      if (s.id !== id) return s

      // find a new position sufficiently far from previous
      const maxTries = 12
      let left, top, tries = 0
      const minDistance = 6
      do {
        left = Math.random() * 94 + 3
        top = Math.random() * 94 + 3
        const dx = Math.abs(left - s.left)
        const dy = Math.abs(top - s.top)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist >= minDistance) break
        tries++
      } while (tries < maxTries)

      let opacity
      if (s.color === '#ffd700') opacity = Math.random() * 0.5 + 0.45
      else if (s.color === '#ffffff') opacity = Math.random() * 0.6 + 0.2
      else if (s.color === '#c0c0c0') opacity = Math.random() * 0.5 + 0.25
      else opacity = Math.random() * 0.5 + 0.2

      return {
        ...s,
        left,
        top,
        opacity,
        duration: Math.random() * 2.5 + 0.8,
        delay: Math.random() * 0.6,
        tick: (s.tick || 0) + 1
      }
    }))
  }

  function calculateTimeLeft() {
    const now = new Date().getTime()
    const difference = partyDate - now

    let timeLeft = {}

    if (difference > 0) {
      timeLeft = {
        dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
        horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
        segundos: Math.floor((difference % (1000 * 60)) / 1000)
      }
    } else {
      timeLeft = { dias: 0, horas: 0, minutos: 0, segundos: 0 }
    }
    return timeLeft
  }

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft())
    }, 1000)

    const checkRsvpStatus = () => {
      const now = new Date().getTime()
      setIsRsvpOpen(now <= rsvpDeadline)
    }

    checkRsvpStatus()
    const rsvpTimer = setInterval(checkRsvpStatus, 60000)

    return () => {
      clearInterval(timer)
      clearInterval(rsvpTimer)
    }
  }, [])

  const handleWhatsAppClick = () => {
    const phoneNumber = '5521982286282'
    // Use Unicode escapes to avoid file encoding issues that can turn emojis into � characters
    const messageText = 'Ol\u00E1! Gostaria de confirmar minha presen\u00E7a nos 15 anos da Isabella! ' + '\u{1F389}' + '\u2728' + '\u{1F60A}'
    const message = encodeURIComponent(messageText)
    // Use api.whatsapp.com endpoint which works well on desktop and mobile
    window.open(`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`, '_blank')
  }

  return (
    // Fundo escuro mantido
    <div className="h-[100dvh] w-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a2620] via-[#1c1917] to-[#0f0e0d] text-[#f3e5ab] font-sans overflow-hidden relative flex flex-col items-center justify-center">
      
      {/* CAMADA DE PURPURINA */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute rounded-full"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              // center the sparkle at the left/top point
              transform: 'translate(-50%, -50%)',
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: sparkle.color,
              boxShadow: `0 0 ${Math.max(2, sparkle.size * 2)}px ${sparkle.color}`,
              animation: sparkle.hidden ? 'none' : `twinkle ${sparkle.duration}s ease-in-out infinite`,
              animationDelay: `${sparkle.delay}s`,
              opacity: sparkle.hidden ? 0 : sparkle.opacity,
              zIndex: sparkle.z,
              mixBlendMode: 'screen',
              filter: sparkle.z === 2 ? 'blur(0.3px)' : 'none',
              transition: `opacity 0.6s linear`
            }}
          />
        ))}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;800&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400,700&display=swap');
        
        .font-cinzel { font-family: 'Cinzel', serif; }
        .font-playfair { font-family: 'Playfair Display', serif; }
        .font-lato { font-family: 'Lato', sans-serif; }
        
        /* Texto Metálico Dourado Intenso (Apenas para Isabella) */
        .gold-metallic-text {
          background: linear-gradient(
            to bottom,
            #fff8db 0%,
            #ffd700 40%, 
            #e6c200 60%,
            #fff8db 100%
          );
          -webkit-background-clip: text;
          background-clip: text;
          color: transparent;
          filter: drop-shadow(0px 0px 15px rgba(255, 215, 0, 0.4));
        }

        .gold-shimmer-bg {
          background: linear-gradient(45deg, #FFD700, #FDB931, #f3e5ab, #9E7D36, #FFD700);
          background-size: 200% 200%;
          animation: shimmer 3s linear infinite;
        }

        @keyframes twinkle {
          /* keep translate so scaling occurs around the centered point */
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
          40% { opacity: 1; transform: translate(-50%, -50%) scale(1.15); }
          70% { opacity: 0.6; transform: translate(-50%, -50%) scale(0.8); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.3); }
        }

        @keyframes shimmer {
          0% { background-position: 0% 50%; }
          100% { background-position: 100% 50%; }
        }
        
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
          100% { transform: translateY(0px); }
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>

      {/* Conteúdo Principal */}
      <div className="relative z-10 w-full max-w-4xl h-full flex flex-col items-center justify-evenly py-4 px-4 overflow-y-auto">
        
        {/* Header */}
        <div className="text-center w-full flex-shrink-0">
           <div className="flex justify-center mb-1 md:mb-2">
             <Star className="text-[#ffd700] w-4 h-4 md:w-6 md:h-6 animate-pulse" fill="#ffd700" />
           </div>

          <p className="font-lato tracking-[0.3em] uppercase text-[10px] md:text-sm text-[#ffd700] font-bold mb-1 drop-shadow-md">
            Save The Date
          </p>
          
          <h1 className="font-playfair text-5xl sm:text-6xl md:text-7xl lg:text-8xl gold-metallic-text animate-float leading-tight drop-shadow-lg">
            Isabella
          </h1>
          
          <div className="mt-3 md:mt-5 mb-2 flex flex-col items-center">
            <div className="inline-flex items-center gap-4 bg-black/60 border border-[#ffd700]/30 px-4 md:px-6 py-2 rounded-full shadow-[0_6px_30px_rgba(0,0,0,0.6)]">
              <svg width="28" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
                <path d="M2 7l5 5 4-6 4 6 5-5v11H2V7z" fill="#FFD700" stroke="#E6BE00" strokeWidth="0.5" />
                <circle cx="6" cy="8" r="1" fill="#FFF8DB" />
                <circle cx="12" cy="6" r="1" fill="#FFF8DB" />
                <circle cx="18" cy="8" r="1" fill="#FFF8DB" />
              </svg>

              <div className="flex flex-col items-start">
                <span className="gold-metallic-text font-playfair text-2xl md:text-4xl lg:text-5xl font-bold leading-none">
                  15 Anos
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Card de Detalhes - Cores limpas e legíveis */}
        <div className="w-full max-w-[95%] bg-black/70 backdrop-blur-md border border-[#ffd700]/30 p-4 md:p-6 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex-shrink-0">
          <h2 className="font-cinzel text-lg md:text-2xl text-center text-[#ffd700] mb-4 border-b border-[#ffd700]/30 pb-3 tracking-wider">
            O Grande Dia da Isabella 
          </h2>
          
          <div className="flex flex-row justify-between items-start gap-2 md:gap-4">
            
            {/* Bloco 1: Data */}
            <div className="flex flex-col items-center text-center w-1/3">
              <Calendar className="w-6 h-6 md:w-8 md:h-8 text-[#ffd700] mb-2" />
              <p className="font-lato text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#b38728] mb-1">Sábado</p>
              <div className="font-playfair text-[#f3e5ab] font-bold leading-tight">
                <span className="text-xl md:text-3xl block text-[#ffd700]">17 Jan</span>
                <span className="text-sm md:text-xl block text-[#f3e5ab]/90">2026</span>
              </div>
            </div>
            
            {/* Bloco 2: Hora */}
            <div className="flex flex-col items-center text-center w-1/3 border-l border-r border-[#ffd700]/20 px-1">
              <Clock className="w-6 h-6 md:w-8 md:h-8 text-[#ffd700] mb-2" />
              <p className="font-lato text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#b38728] mb-1">Horário</p>
              <div className="font-playfair text-[#f3e5ab] font-bold leading-tight">
                <span className="text-xl md:text-3xl block text-[#ffd700]">09:00</span>
                <span className="text-sm md:text-xl block text-[#f3e5ab]/90">Horas</span>
              </div>
            </div>

            {/* Bloco 3: Local - Tamanho ajustado */}
            <div className="flex flex-col items-center text-center w-1/3">
              <MapPin className="w-6 h-6 md:w-8 md:h-8 text-[#ffd700] mb-2" />
              <p className="font-lato text-[10px] md:text-xs uppercase tracking-widest font-bold text-[#b38728] mb-1">Local</p>
              <div className="font-playfair text-[#f3e5ab] leading-tight flex items-center h-full pt-1 justify-center">
                {/* Aqui está o ajuste: text-sm md:text-xl igual ao bloco Horas */}
                <span className="text-sm md:text-xl block text-[#f3e5ab]/90">
                  Local e convites após a confirmação
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* Contagem e RSVP */}
        <div className="flex flex-col items-center gap-4 md:gap-6 w-full flex-shrink-0">
          
          {/* Contagem */}
          <div className="w-full">
            <p className="font-lato text-[10px] md:text-sm uppercase tracking-widest mb-2 md:mb-3 text-[#ffd700] text-center flex items-center justify-center gap-2 md:gap-3 font-bold drop-shadow-sm">
              <span className="w-4 md:w-8 h-[1px] bg-[#ffd700]"></span>
              Contagem Regressiva
              <span className="w-4 md:w-8 h-[1px] bg-[#ffd700]"></span>
            </p>
            <div className="flex justify-center gap-2 md:gap-4">
              <CountdownUnit value={timeLeft.dias} label="Dias" />
              <CountdownUnit value={timeLeft.horas} label="Hs" />
              <CountdownUnit value={timeLeft.minutos} label="Min" />
              <CountdownUnit value={timeLeft.segundos} label="Seg" />
            </div>
          </div>

          {/* Botão RSVP */}
          <div className="relative z-20">
            {isRsvpOpen ? (
              <div className="flex flex-col items-center">
                <div className="p-[2px] rounded-full gold-shimmer-bg shadow-[0_0_20px_rgba(255,215,0,0.5)] hover:shadow-[0_0_40px_rgba(255,215,0,0.7)] active:scale-95 transition-all duration-300">
                  <button 
                    onClick={handleWhatsAppClick}
                    className="bg-[#1a1614] hover:bg-[#2c241b] text-[#ffd700] font-cinzel font-bold py-3 px-6 md:py-4 md:px-12 rounded-full transition-all duration-300 flex items-center gap-2 md:gap-3 text-sm md:text-lg uppercase tracking-wider whitespace-nowrap border border-[#ffd700]/20"
                  >
                     <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> Clique aqui para confirmar <br/>presença no dia 17/01/2026
                  </button>
                </div>
                <div className="mt-3 flex flex-col items-center">
                  <span className="inline-block gold-shimmer-bg px-4 py-1 rounded-full text-xs md:text-sm font-playfair text-[#1a1208] font-semibold shadow-md">
                    Após confirmação, informações sobre convite e local serão enviadas.
                  </span>
                
                </div>
              </div>
            ) : (
              <div className="bg-black/60 p-4 rounded-lg border border-[#ffd700]/30 text-center">
                <p className="font-cinzel text-gray-300 text-xs md:text-sm">Confirmações encerradas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
          <footer className="text-[#ffd700]/70 font-cinzel text-[12px] md:text-[14px] z-10 font-bold tracking-widest text-center mt-2">
            Com carinho, Família da Isabella
          </footer>

      </div>
    </div>
  )
}

// Componente de Contagem - Limpo
const CountdownUnit = ({ value, label }) => (
  <div className="flex flex-col items-center">
    <div className="w-14 h-14 md:w-20 md:h-20 bg-black/60 border border-[#ffd700]/60 flex items-center justify-center rounded-lg shadow-[0_0_15px_rgba(255,215,0,0.2)] backdrop-blur-sm">
      <span className="font-playfair text-xl md:text-4xl text-[#ffd700] font-bold drop-shadow-md">
        {value < 10 ? `0${value}` : value}
      </span>
    </div>
    <span className="font-lato text-[9px] md:text-xs uppercase tracking-widest text-[#ffd700] mt-1 md:mt-2 font-bold">{label}</span>
  </div>
)

export default App
