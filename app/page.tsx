'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Calendar, Clock, MapPin, Shirt } from 'lucide-react';

// --- FIXED GLOBAL FALLING FLOWERS ---
const FlowerShower = () => {
  const [petals, setPetals] = useState<any[]>([]);

  useEffect(() => {
    const containerWidth = Math.min(window.innerWidth, 400); 
    const generatedPetals = Array.from({ length: 20 }).map(() => ({
      x: Math.random() * containerWidth,
      delay: Math.random() * 5,
      duration: Math.random() * 5 + 7, 
      icon: ['🌸', '🌹', '✨', '💮'][Math.floor(Math.random() * 4)],
      targetY: window.innerHeight + 100
    }));
    setPetals(generatedPetals);
  }, []);

  if (petals.length === 0) return null;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-[100]">
      {petals.map((petal, i) => (
        <motion.div
          key={i}
          className="absolute text-xl md:text-2xl drop-shadow-md opacity-90"
          initial={{ y: -50, x: petal.x, opacity: 0, rotate: 0 }}
          animate={{ y: petal.targetY, opacity: [0, 1, 1, 0], rotate: 360 }}
          transition={{ duration: petal.duration, repeat: Infinity, delay: petal.delay, ease: "linear" }}
        >
          {petal.icon}
        </motion.div>
      ))}
    </div>
  );
};

// --- MULTI-COLOR SCRATCH MODAL CANVAS ---
const ScratchModalCanvas = ({ 
  onScratched, 
  scratchText, 
  scratchColor 
}: { 
  onScratched: () => void, 
  scratchText: string,
  scratchColor: string 
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    ctx.fillStyle = scratchColor; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    ctx.font = 'bold 20px "Playfair Display", serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.letterSpacing = '1px';
    ctx.fillText(scratchText, canvas.width / 2, canvas.height - 40);
  }, [scratchText, scratchColor]);

  const scratch = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, 45, 0, Math.PI * 2); 
    ctx.fill();

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let transparent = 0;
    for (let i = 3; i < imageData.data.length; i += 4) {
      if (imageData.data[i] === 0) transparent++;
    }
    const total = imageData.data.length / 4;
    if (transparent / total > 0.40) { 
      onScratched(); 
    }
  };

  const handleDraw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    let clientX, clientY;
    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = (e as React.MouseEvent).clientX;
      clientY = (e as React.MouseEvent).clientY;
    }
    scratch(clientX, clientY);
  };

  return (
    <canvas
      ref={canvasRef}
      style={{ touchAction: 'none' }}
      className="absolute inset-0 w-full h-full cursor-pointer rounded-2xl shadow-inner"
      onMouseDown={() => setIsDrawing(true)}
      onMouseUp={() => setIsDrawing(false)}
      onMouseLeave={() => setIsDrawing(false)}
      onMouseMove={handleDraw}
      onTouchStart={(e) => { setIsDrawing(true); handleDraw(e); }}
      onTouchEnd={() => { setIsDrawing(false); }}
      onTouchMove={handleDraw}
    />
  );
};

// --- ISOLATED COUNTDOWN TIMER ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2026-12-05T12:25:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;
      if (distance > 0) {
        setTimeLeft({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex justify-center gap-3 md:gap-5 w-full max-w-sm mx-auto">
      {Object.entries(timeLeft).map(([unit, value]) => (
        <div key={unit} className="flex flex-col items-center">
          <div className="bg-white rounded-lg p-3 w-14 h-14 md:w-16 md:h-16 flex items-center justify-center text-2xl font-bold font-serif shadow-md border border-amber-100 text-[#881337]">
            {value}
          </div>
          <span className="font-sans text-[8px] uppercase tracking-widest mt-2 text-slate-500">{unit}</span>
        </div>
      ))}
    </div>
  );
};

export default function InteractiveInvite() {
  const [isOpen, setIsOpen] = useState(false);
  const [activeEvent, setActiveEvent] = useState<any | null>(null);
  const [isFullyScratched, setIsFullyScratched] = useState(false);

  const openModal = (event: any) => {
    setActiveEvent(event);
    setIsFullyScratched(false);
  };

  const closeModal = () => {
    setActiveEvent(null);
    setIsFullyScratched(false);
  };

  const eventsList = [
    {
      id: "mehndi",
      title: "Mehndi Ceremony",
      date: "Wednesday, 2nd December 2026",
      time: "11:00 AM onwards",
      dress: "Pastel and Floral",
      venue: "At Home", 
      topQuote: "Where henna meets hearts, our journey begins...",
      bottomQuote: "The deeper the mehndi, the deeper the love",
      image: "/avatars/mehndi.jpeg",
      textColor: "text-[#be123c]", 
      scratchColor: "#10B981", 
      scratchText: "✨ RUB TO REVEAL ✨",
      alignment: "items-center text-center px-4"
    },
    {
      id: "haldi",
      title: "Haldi Ceremony",
      date: "Wednesday, 2nd December 2026",
      time: "5:00 PM onwards",
      dress: "Shades of Yellow and White",
      venue: "At Home",
      topQuote: "Join us to celebrate our...",
      bottomQuote: "A vibrant splash of yellow to mark our golden beginning.",
      image: "/avatars/haldi.jpeg",
      textColor: "text-[#b45309]", 
      scratchColor: "#F59E0B", 
      scratchText: "✨ RUB OFF THE TURMERIC ✨",
      alignment: "items-center text-center px-4"
    },
    {
      id: "sangeet",
      title: "Sangeet Night",
      date: "Thursday, 3rd December 2026",
      time: "7:00 PM onwards",
      dress: "Indo-Western / Glamorous",
      venue: "Mouli Celebration Hall",
      topQuote: "An evening of rhythm, beats, and dancing...",
      bottomQuote: "Music, dance and the whole family on its feet.",
      image: "/avatars/sangeet.jpeg",
      textColor: "text-[#4c1d95]", 
      scratchColor: "#8B5CF6", 
      scratchText: "✨ TAP THE DHOL ✨",
      alignment: "items-center text-center px-4"
    },
    {
      id: "wedding",
      title: "The Muhurtham",
      date: "Saturday, 5th December 2026",
      time: "12:25 PM onwards",
      dress: "Traditional Ethnic Wear",
      venue: "Chilikuri Garden, Adilabad",
      topQuote: "With the blessings of our elders...",
      bottomQuote: "The sacred vows — with your blessings.",
      image: "/avatars/wedding.jpeg",
      textColor: "text-[#be123c]", 
      scratchColor: "#E11D48", 
      scratchText: "✨ RUB TO REVEAL ✨",
      alignment: "items-center text-center px-4"
    },
    {
      id: "reception",
      title: "Reception Evening",
      date: "Sunday, 6th December 2026",
      time: "7:00 PM onwards",
      dress: "Formal Evening Wear / Suits & Gowns",
      venue: "Rahul Garden, Pandharkawada",
      topQuote: "A grand toast to love and laughter...",
      bottomQuote: "Celebrating our happily ever after.",
      image: "/avatars/reception.jpeg",
      textColor: "text-[#0f766e]", 
      scratchColor: "#0D9488", 
      scratchText: "✨ RUB TO REVEAL ✨",
      alignment: "items-end text-right pl-16 pr-4" 
    }
  ];

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center font-sans text-slate-800">
      
      {/* PERFECTED COMPILER-SAFE FONT INJECTION */}
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: `
        .font-cursive { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
      `}} />

      <div className="relative w-full max-w-[400px] min-h-[100dvh] bg-[#FFFDF7] shadow-2xl overflow-x-hidden font-serif">
        
        {/* --- SPLASH SCREEN --- */}
        <AnimatePresence>
          {!isOpen && (
            <motion.div 
              className="fixed inset-0 max-w-[400px] mx-auto z-[500] flex cursor-pointer overflow-hidden" 
              onClick={() => setIsOpen(true)}
              exit={{ opacity: 0, transition: { duration: 1.5 } }}
            >
              <motion.div 
                className="absolute inset-y-0 left-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')] bg-amber-500 border-r-2 border-amber-300/50 shadow-[5px_0_15px_rgba(0,0,0,0.3)] z-40"
                exit={{ x: '-100%', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
              />
              <motion.div 
                className="absolute inset-y-0 right-0 w-1/2 bg-[url('https://www.transparenttextures.com/patterns/gold-scale.png')] bg-amber-500 border-l-2 border-amber-300/50 shadow-[-5px_0_15px_rgba(0,0,0,0.3)] z-40"
                exit={{ x: '100%', transition: { duration: 1.2, ease: [0.22, 1, 0.36, 1] } }}
              />
              
              <motion.div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 text-center bg-white p-8 rounded-full shadow-2xl border-[6px] border-amber-300 flex flex-col items-center justify-center w-56 h-56"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
                exit={{ scale: 0, opacity: 0, transition: { duration: 0.5 } }}
              >
                <div className="flex flex-row items-center justify-center gap-2 mb-2 whitespace-nowrap">
                  <span className="text-5xl font-serif text-[#881337]">K</span>
                  <span className="text-4xl font-serif text-amber-500">&amp;</span>
                  <span className="text-5xl font-serif text-[#881337]">S</span>
                </div>
                <p className="text-[10px] font-sans tracking-[0.2em] text-amber-700 uppercase font-extrabold flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Tap to Open
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {isOpen && <FlowerShower />}
        
        <div className={`transition-opacity duration-1000 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
          
          {/* PAGE 1: WELCOME PAGE */}
          <section className="relative w-full h-[100dvh] flex flex-col items-center justify-start overflow-hidden">
            <div className="absolute inset-0 w-full h-full z-0">
              <img src="/avatars/welcome.jpeg" alt="Welcome" className="w-full h-full object-cover object-bottom" />
            </div>
            
            <div className="absolute inset-y-0 right-0 top-10 z-10 w-[75%] text-right pr-4 flex flex-col items-end">
              
              <p className="text-[8px] font-sans tracking-[0.2em] text-[#9a3412] uppercase font-bold drop-shadow-md">
                Together with their families
              </p>
              <p className="text-[9px] text-[#9a3412] italic mt-1 mb-4 font-medium drop-shadow-md">
                Request the honour of your presence
              </p>

              <div className="space-y-1 flex flex-col items-end">
                <div className="text-right flex flex-col items-end">
                  <h1 className="text-4xl whitespace-nowrap font-cursive text-[#881337] drop-shadow-lg leading-none mb-1">Dr. Krishnanshu</h1>
                  <p className="text-[5px] text-slate-800 font-sans uppercase tracking-[0.1em] font-extrabold">Son of Mrs. Kavita &amp; Mr. Rajanna Bhandarwar</p>
                </div>
                
                <div className="text-xl text-[#d97706] italic font-light drop-shadow pr-6">&amp;</div>
                
                <div className="text-right flex flex-col items-end">
                  <h1 className="text-4xl whitespace-nowrap font-cursive text-[#881337] drop-shadow-lg leading-none mb-1">Dr. Shriya</h1>
                  <p className="text-[5px] text-slate-800 font-sans uppercase tracking-[0.1em] font-extrabold">Daughter of Mrs. Sujata &amp; Mr. Dnyaneshwar Parlawar</p>
                </div>
              </div>

              <div className="mt-4 pt-2 inline-block border-t border-[#d97706]/60">
                <p className="font-serif text-[15px] text-[#4c0519] font-bold drop-shadow-md">Saturday, 5th Dec 2026</p>
                <p className="text-[8px] font-sans text-[#4c0519] font-bold tracking-widest drop-shadow-sm">12:25 PM | Chilikuri Garden</p>
              </div>
            </div>
          </section>

          {/* PAGE 2: YOU ARE WARMLY INVITED */}
          <section className="relative w-full py-16 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#FFFDF7] to-amber-50">
            <p className="text-amber-700 font-sans text-[11px] font-bold tracking-[0.3em] uppercase mb-10">
              You Are Warmly Invited
            </p>
            
            <div className="mb-12 text-[#881337]">
              <h2 className="text-5xl font-cursive mb-1">Dr. Krishnanshu</h2>
              <p className="text-[8px] text-slate-600 uppercase tracking-[0.2em] font-sans font-bold">
                S/o Mrs. Kavita &amp; Mr. Rajanna Bhandarwar
              </p>
              
              <h2 className="text-4xl font-cursive text-[#d97706] my-4">&amp;</h2>
              
              <h2 className="text-5xl font-cursive mb-1">Dr. Shriya</h2>
              <p className="text-[8px] text-slate-600 uppercase tracking-[0.2em] font-sans font-bold">
                D/o Mrs. Sujata &amp; Mr. Dnyaneshwar Parlawar
              </p>
            </div>

            <div className="grid grid-cols-2 gap-0 w-full border-y border-amber-200 py-8 mb-8">
              <div className="border-r border-amber-200 flex flex-col items-center justify-center px-2">
                <h3 className="text-[9px] font-sans text-[#d97706] font-bold tracking-[0.25em] uppercase mb-2">When</h3>
                <p className="font-serif font-bold text-lg text-[#881337]">5 Dec 2026</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                <h3 className="text-[9px] font-sans text-[#d97706] font-bold tracking-[0.25em] uppercase mb-2">Where</h3>
                <p className="font-serif font-bold text-sm text-[#881337]">Chilikuri Garden,<br/>Adilabad</p>
              </div>
            </div>
            
            <p className="font-sans font-bold text-[#881337] tracking-[0.15em] bg-rose-50 px-6 py-2 rounded-full border border-rose-100 shadow-sm">
              #SHRIKRISHNA
            </p>
          </section>

          {/* PAGE 3: TIMELINE LIST OF EVENTS */}
          <section className="py-12 px-4">
            <div className="text-center mb-12">
              <span className="font-sans bg-[#881337] text-white text-[9px] tracking-[0.25em] uppercase font-bold px-4 py-1.5 mb-4 inline-block shadow-md">
                5 Days of Celebration
              </span>
              <h2 className="text-5xl font-cursive text-[#881337] mb-3 mt-2">The Festivities</h2>
              <div className="w-12 h-0.5 bg-[#d97706] mx-auto"></div>
            </div>
            
            <div className="space-y-12 pl-2">
              {eventsList.map((event, index) => (
                <div key={index} className="flex gap-4 items-stretch relative">
                  
                  <div className="w-[55%] flex flex-col justify-center border-l-2 border-[#fCD34D] pl-3 py-1 relative">
                    <div className="absolute -left-[7px] top-4 w-3 h-3 rounded-full bg-[#fCD34D] border-2 border-white shadow-md"></div>
                    
                    <h3 className={`font-serif font-bold text-2xl mb-1 ${event.textColor}`}>{event.title}</h3>
                    <div className={`font-sans font-bold text-[10px] mb-2 text-slate-600`}>{event.date}</div>
                    
                    <div className="flex flex-col gap-1 text-[9px] font-sans font-medium text-slate-700 mb-2">
                      <p className="flex items-center gap-1"><Clock size={10} className="text-amber-500" /> {event.time}</p>
                      <p className="flex items-center gap-1"><MapPin size={10} className="text-amber-500" /> {event.venue}</p>
                    </div>
                    
                    <p className={`text-[10px] italic font-medium bg-amber-50/50 px-2 py-1.5 rounded border border-amber-100 ${event.textColor}`}>
                      &quot;{event.bottomQuote}&quot;
                    </p>
                    
                    <button className="font-sans mt-3 text-[8px] uppercase font-bold tracking-wider text-rose-600 border border-rose-200 px-3 py-1.5 rounded-full hover:bg-rose-50 w-max shadow-sm">
                      + ADD TO CALENDAR
                    </button>
                  </div>

                  <div 
                    className="w-[45%] flex items-center justify-center cursor-pointer active:scale-95 transition-transform" 
                    onClick={() => openModal(event)}
                  >
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover object-bottom" />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-800/80 py-2 flex items-center justify-center backdrop-blur-sm">
                        <span className="font-sans text-white text-[8px] font-bold uppercase tracking-[0.2em] flex items-center gap-1">
                          RUB TO SEE ✨
                        </span>
                      </div>
                    </div>
                  </div>

                </div>
              ))}
            </div>
          </section>

          {/* PAGE 4: THE COUNTDOWN */}
          <section className="relative w-full py-16 flex flex-col items-center justify-center text-center px-4 bg-gradient-to-t from-amber-50 to-[#FFFDF7]">
            <p className="font-sans text-[#881337] text-[10px] font-bold tracking-[0.2em] uppercase mb-8">
              Counting down to the Muhurtham
            </p>
            
            <CountdownTimer />
            
          </section>

          {/* FOOTER */}
          <section className="pb-12 text-center px-4 bg-amber-50">
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer" className="font-sans inline-block bg-[#881337] text-white px-8 py-3 rounded-full font-bold text-xs shadow-xl active:scale-95 transition-transform">
              Send RSVP
            </a>
          </section>
        </div>

        {/* --- PERFECTED ENLARGE & SCRATCH MODAL --- */}
        <AnimatePresence>
          {activeEvent && (
            <motion.div 
              className="fixed inset-0 z-[600] flex items-center justify-center bg-black/90 p-4 backdrop-blur-md"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative w-full max-w-[360px] aspect-[9/16] bg-white rounded-xl shadow-2xl overflow-hidden font-serif border border-white/10">
                
                <button 
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-[610] bg-white/90 backdrop-blur text-slate-800 p-2 rounded-full shadow-lg hover:bg-white"
                >
                  <X className="w-5 h-5" />
                </button>

                <img 
                  src={activeEvent.image} 
                  alt={activeEvent.title} 
                  className="absolute inset-0 w-full h-full object-cover object-bottom" 
                />
                
                <div className={`absolute inset-x-0 top-12 z-10 flex flex-col ${activeEvent.alignment}`}>
                  
                  <p className={`text-[9px] italic font-semibold mb-1 drop-shadow-sm ${activeEvent.textColor}`}>
                    {activeEvent.topQuote}
                  </p>
                  
                  <h2 className={`font-cursive text-5xl mb-3 drop-shadow-md ${activeEvent.textColor}`}>
                    {activeEvent.title}
                  </h2>
                  
                  <div className={`flex flex-col gap-1 w-full max-w-[200px] ${activeEvent.id === 'reception' ? 'items-end' : 'items-start mx-auto'} mb-2`}>
                    
                    <p className={`flex ${activeEvent.id === 'reception' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-start gap-2 text-[9px] font-sans font-bold ${activeEvent.textColor} drop-shadow-sm w-full`}>
                      <Calendar size={11} className="text-amber-500 drop-shadow shrink-0 mt-[2px]" />
                      <span className="leading-snug">{activeEvent.date}</span>
                    </p>

                    <p className={`flex ${activeEvent.id === 'reception' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-start gap-2 text-[9px] font-sans font-bold ${activeEvent.textColor} drop-shadow-sm w-full`}>
                      <Clock size={11} className="text-amber-500 drop-shadow shrink-0 mt-[2px]" />
                      <span className="leading-snug">Time: {activeEvent.time}</span>
                    </p>

                    <p className={`flex ${activeEvent.id === 'reception' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-start gap-2 text-[9px] font-sans font-bold ${activeEvent.textColor} drop-shadow-sm w-full`}>
                      <Shirt size={11} className="text-amber-500 drop-shadow shrink-0 mt-[2px]" />
                      <span className="leading-snug">Dress: {activeEvent.dress}</span>
                    </p>

                    <p className={`flex ${activeEvent.id === 'reception' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-start gap-2 text-[9px] font-sans font-bold ${activeEvent.textColor} drop-shadow-sm w-full`}>
                      <MapPin size={11} className="text-amber-500 drop-shadow shrink-0 mt-[2px]" />
                      <span className="leading-snug">Venue: {activeEvent.venue}</span>
                    </p>
                    
                  </div>

                  <p className={`text-[9px] italic font-semibold drop-shadow-sm mt-1 ${activeEvent.textColor}`}>
                    &quot;{activeEvent.bottomQuote}&quot;
                  </p>
                  
                </div>

                <div className={`absolute inset-0 z-[550] transition-opacity duration-1000 ${isFullyScratched ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
                  <ScratchModalCanvas 
                    onScratched={() => setIsFullyScratched(true)} 
                    scratchText={activeEvent.scratchText} 
                    scratchColor={activeEvent.scratchColor}
                  />
                </div>
                
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}