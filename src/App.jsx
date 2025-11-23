import React, { useState, useEffect } from 'react'
import { Clock, Calendar, MapPin, MessageCircle, Star } from 'lucide-react'

const App = () => {
  // Configuração das datas
  const partyDate = new Date('2026-01-17T09:00:00').getTime()
  const rsvpDeadline = new Date('2025-12-10T23:59:59').getTime()

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isRsvpOpen, setIsRsvpOpen] = useState(true)
  const [sparkles, setSparkles] = useState([])
  // Paleta de cores ampliada (tons que combinam com o site)
  const colorPalette = [
    '#ffd700', // gold
    '#ffdf80', // light gold
    '#f3e5ab', // cream
    '#fff8e6', // soft ivory
    '#ffd1e6', // soft peach/pink
    '#ffb6c1', // light pink
    '#ffb199', // warm coral
    '#ffc9a8', // peach
    '#ffd9b3', // champagne
    '#d9926a', // bronze/amber
    '#dcd3ff', // lavender
    '#e6d6ff', // soft lilac
    '#f7e6ff', // very pale lilac
    '#c8f7e5', // mint
    '#bfeee0', // soft aqua
    '#fbe4ea', // blush
    '#c0c0c0', // silver
    '#ffffff'  // white
  ]

  // helpers to slightly vary hex colors
  const hexToRgb = (hex) => {
    const h = hex.replace('#', '')
    const bigint = parseInt(h, 16)
    return { r: (bigint >> 16) & 255, g: (bigint >> 8) & 255, b: bigint & 255 }
  }
  const rgbToHex = (r, g, b) => '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('')
  const blendHex = (hex1, hex2, t) => {
    const a = hexToRgb(hex1)
    const b = hexToRgb(hex2)
    const r = Math.round(a.r + (b.r - a.r) * t)
    const g = Math.round(a.g + (b.g - a.g) * t)
    const bl = Math.round(a.b + (b.b - a.b) * t)
    return rgbToHex(r, g, bl)
  }

  const pickColor = () => {
    const base = colorPalette[Math.floor(Math.random() * colorPalette.length)]
    // 40% chance to slightly vary the base color towards white (lighten) or a tiny shade
    if (Math.random() < 0.4) {
      const t = Math.random() * 0.28 + 0.06 // 0.06..0.34
      // randomly choose to blend with white or a warm gold for variety
      const blendTarget = Math.random() < 0.5 ? '#ffffff' : '#fff5d1'
      return blendHex(base, blendTarget, t)
    }
    return base
  }

  const getOpacityForColor = (color) => {
    // Slightly stronger opacity for gold/cream, softer for whites and pastels
    if (!color) return Math.random() * 0.6 + 0.2
    if (color === '#ffd700' || color === '#ffdf80' || color === '#f3e5ab') return Math.random() * 0.45 + 0.5
    if (color === '#fff8e6' || color === '#ffffff') return Math.random() * 0.5 + 0.2
    if (color === '#c0c0c0') return Math.random() * 0.45 + 0.25
    // pastel tones
    return Math.random() * 0.5 + 0.25
  }

  // Gera purpurina: cada estrela executa o `twinkle` uma vez; no fim do `animationend` teleportamos
  useEffect(() => {
    const newSparkles = []
    for (let i = 0; i < 160; i++) {
      const color = pickColor()
      const size = Math.random() * 4 + 1
      const z = Math.random() < 0.6 ? 0 : (Math.random() < 0.5 ? 1 : 2)
      const opacity = getOpacityForColor(color)

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
      const maxTries = 50
      let left, top, tries = 0
      const minDistance = 12
      do {
        left = Math.random() * 94 + 3
        top = Math.random() * 94 + 3
        const dx = Math.abs(left - s.left)
        const dy = Math.abs(top - s.top)
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist >= minDistance) break
        tries++
      } while (tries < maxTries)

      const opacity = getOpacityForColor(s.color)

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
            key={`${sparkle.id}-${sparkle.tick ?? 0}`}
            className="absolute rounded-full"
            onAnimationEnd={() => handleAnimationEnd(sparkle.id)}
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              // center the sparkle at the left/top point
              // start scaled down so it "grows" during animation
              transform: 'translate(-50%, -50%) scale(0.2)',
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              background: sparkle.color,
              // stronger glow: multiple layered blurs
              boxShadow: `0 0 ${Math.max(6, sparkle.size * 4)}px ${sparkle.color}, 0 0 ${Math.max(12, sparkle.size * 8)}px ${sparkle.color}`,
              // expose per-sparkle peak opacity to CSS keyframes (slightly boosted)
              ['--sparkle-opacity']: Math.min(1, sparkle.opacity * 1.3),
              animation: `twinkle ${sparkle.duration}s ease-in-out ${sparkle.delay}s 1 forwards`,
              // keep element invisible before animation starts; animation will fade it in
              opacity: 0,
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
          /* keep translate so scaling occurs around the centered point
             use CSS var --sparkle-opacity to let each sparkle control its peak opacity */
          0% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
          /* boost peak scale and brightness so sparkles grow noticeably */
          40% { opacity: calc(var(--sparkle-opacity, 1) * 1.25); transform: translate(-50%, -50%) scale(1.6); }
          70% { opacity: calc(var(--sparkle-opacity, 1) * 0.6); transform: translate(-50%, -50%) scale(0.9); }
          100% { opacity: 0; transform: translate(-50%, -50%) scale(0.2); }
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
                  Santa Candida - Itaguaí
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
                     <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> Clique aqui para confirmar <br/>presença até o dia 17/12/2025
                  </button>
                </div>
                <div className="mt-3 flex flex-col items-center">
                  <span className="inline-block gold-shimmer-bg px-4 py-1 rounded-full text-xs md:text-sm font-playfair text-[#1a1208] font-semibold shadow-md">
                    Os convites serão enviados após a confirmação
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
