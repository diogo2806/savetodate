import React, { useState, useEffect } from 'react'
import { Clock, Calendar, MapPin, MessageCircle, Star } from 'lucide-react'

const App = () => {
  // Configuração das datas
  const partyDate = new Date('2026-01-17T09:00:00').getTime()
  const rsvpDeadline = new Date('2025-12-10T23:59:59').getTime()

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft())
  const [isRsvpOpen, setIsRsvpOpen] = useState(true)
  const [sparkles, setSparkles] = useState([])

  // Gera purpurina
  useEffect(() => {
    const generateSparkles = () => {
      const newSparkles = []
      for (let i = 0; i < 80; i++) {
        newSparkles.push({
          id: i,
          left: Math.random() * 100,
          top: Math.random() * 100,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 5,
          duration: Math.random() * 2 + 1,
          opacity: Math.random()
        })
      }
      setSparkles(newSparkles)
    }
    generateSparkles()
  }, [])

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
    const message = encodeURIComponent('Olá! Gostaria de confirmar minha presença nos 15 anos da Isabella! 🎉✨😊')
    window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank')
  }

  return (
    // Fundo escuro mantido
    <div className="h-[100dvh] w-screen bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-[#2a2620] via-[#1c1917] to-[#0f0e0d] text-[#f3e5ab] font-sans overflow-hidden relative flex flex-col items-center justify-center">
      
      {/* CAMADA DE PURPURINA */}
      <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
        {sparkles.map((sparkle) => (
          <div
            key={sparkle.id}
            className="absolute rounded-full bg-[#ffd700]"
            style={{
              left: `${sparkle.left}%`,
              top: `${sparkle.top}%`,
              width: `${sparkle.size}px`,
              height: `${sparkle.size}px`,
              boxShadow: `0 0 ${sparkle.size * 2}px #ffd700`,
              animation: `twinkle ${sparkle.duration}s ease-in-out infinite`,
              animationDelay: `${sparkle.delay}s`,
              opacity: sparkle.opacity
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
          0% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 1; transform: scale(1.4); }
          100% { opacity: 0.3; transform: scale(0.8); }
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
          
          <div className="mt-2 md:mt-4 mb-1 bg-black/50 backdrop-blur-sm px-4 py-1.5 md:px-6 md:py-2 rounded-full border border-[#ffd700]/40 inline-block shadow-lg">
            <span className="font-playfair text-sm sm:text-base md:text-2xl italic text-[#f3e5ab]">
              15 Anos em 26 de Dezembro de 2025
            </span>
          </div>
        </div>

        {/* Card de Detalhes - Cores limpas e legíveis */}
        <div className="w-full max-w-[95%] bg-black/70 backdrop-blur-md border border-[#ffd700]/30 p-4 md:p-6 rounded-xl shadow-[0_0_30px_rgba(0,0,0,0.8)] flex-shrink-0">
          <h2 className="font-cinzel text-lg md:text-2xl text-center text-[#ffd700] mb-4 border-b border-[#ffd700]/30 pb-3 tracking-wider">
            A Grande Celebração
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
                     <MessageCircle className="w-5 h-5 md:w-6 md:h-6" /> Confirmar Presença
                  </button>
                </div>
                <p className="mt-2 font-lato text-[10px] md:text-xs text-[#ffd700]/80 italic text-center w-full max-w-xs">
                  * Confirmar presença até <strong className="text-[#ffd700] underline">10/12/2025</strong>.
                </p>
              </div>
            ) : (
              <div className="bg-black/60 p-4 rounded-lg border border-[#ffd700]/30 text-center">
                <p className="font-cinzel text-gray-300 text-xs md:text-sm">Confirmações encerradas.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <footer className="text-[#ffd700]/70 font-cinzel text-[9px] md:text-[10px] z-10 font-bold tracking-widest text-center mt-2">
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
