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
    
    // Using a system font that beautifully supports Marathi script
    ctx.font = 'bold 20px sans-serif';
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

// --- ISOLATED COUNTDOWN TIMER (MARATHI) ---
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  const marathiLabels: Record<string, string> = {
    days: "दिवस",
    hours: "तास",
    minutes: "मिनिटे",
    seconds: "सेकंद"
  };

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
          <span className="font-sans text-[9px] font-bold tracking-wider mt-2 text-slate-500">{marathiLabels[unit]}</span>
        </div>
      ))}
    </div>
  );
};

export default function MarathiInvite() {
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
      title: "मेहंदी सोहळा",
      date: "बुधवार, २ डिसेंबर २०२६",
      time: "सकाळी ११:०० वाजता",
      dress: "पेस्टल आणि फ्लोरल",
      venue: "घरी", 
      topQuote: "मेहंदीच्या रंगात, आमच्या नव्या प्रवासाची सुरुवात...",
      bottomQuote: "मेहंदीचा रंग जितका गडद, तितकेच प्रेमही अथांग...",
      image: "/avatars/mehndi.jpeg",
      textColor: "text-[#be123c]", 
      scratchColor: "#10B981", 
      scratchText: "✨ घासून पहा ✨",
      alignment: "items-center text-center px-4 w-full",
      modalTop: "top-[8%]",
      titleSpacing: "mb-3"
    },
    {
      id: "haldi",
      title: "हळदी समारंभ",
      date: "बुधवार, २ डिसेंबर २०२६",
      time: "सायंकाळी ५:०० वाजता",
      dress: "पिवळे आणि पांढरे कपडे",
      venue: "घरी",
      topQuote: "आमच्या आनंदाचा क्षण...",
      bottomQuote: "हळदीचा पिवळा रंग आणि आमच्या सुवर्ण प्रवासाचा आरंभ.",
      image: "/avatars/haldi.jpeg",
      textColor: "text-[#b45309]", 
      scratchColor: "#F59E0B", 
      scratchText: "✨ हळद उलगडून पहा ✨",
      alignment: "items-center text-center px-4 w-full",
      modalTop: "top-[8%]",
      titleSpacing: "mb-3"
    },
    {
      id: "sangeet",
      title: "संगीत रजनी",
      date: "गुरुवार, ३ डिसेंबर २०२६",
      time: "सायंकाळी ७:०० वाजता",
      dress: "इंडो-वेस्टर्न",
      venue: "मौली सेलिब्रेशन हॉल",
      topQuote: "सुर, ताल आणि नृत्याची एक अविस्मरणीय संध्याकाळ...",
      bottomQuote: "संगीत, नृत्य आणि संपूर्ण कुटुंबाचा जल्लोष.",
      image: "/avatars/sangeet.jpeg",
      textColor: "text-[#4c1d95]", 
      scratchColor: "#8B5CF6", 
      scratchText: "✨ ढोल वाजवा ✨",
      alignment: "items-center text-center px-4 w-full",
      modalTop: "top-[6%]",
      titleSpacing: "mb-0"
    },
    {
      id: "wedding",
      title: "शुभ विवाह",
      date: "शनिवार, ५ डिसेंबर २०२६",
      time: "दुपारी १२:२५ वाजता",
      dress: "पारंपारिक पेहराव",
      venue: "चिलिकुरी गार्डन, आदिलाबाद",
      topQuote: "वडिलधाऱ्यांच्या आशीर्वादाने...",
      bottomQuote: "पवित्र विवाह बंधनात — तुमच्या साक्षीने.",
      image: "/avatars/wedding.jpeg",
      textColor: "text-[#be123c]", 
      scratchColor: "#E11D48", 
      scratchText: "✨ घासून पहा ✨",
      alignment: "items-center text-center px-4 w-full",
      modalTop: "top-[6%]",
      titleSpacing: "mb-0"
    },
    {
      id: "reception",
      title: "स्वागत समारंभ",
      date: "रविवार, ६ डिसेंबर २०२६",
      time: "सायंकाळी ७:०० वाजता",
      dress: "फॉर्मल वेअर",
      venue: "राहुल गार्डन, पांढरकवडा",
      topQuote: "प्रेम आणि हास्याचा एक भव्य उत्सव...",
      bottomQuote: "आमच्या सुखी जीवनाच्या प्रवासाची सुरुवात.",
      image: "/avatars/reception.jpeg",
      textColor: "text-[#0f766e]", 
      scratchColor: "#0D9488", 
      scratchText: "✨ घासून पहा ✨",
      alignment: "items-end text-right pr-6 w-full max-w-[200px] ml-auto",
      modalTop: "top-[8%]",
      titleSpacing: "mb-3"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-200 flex items-center justify-center font-sans text-slate-800">
      
      <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Tiro+Devanagari+Marathi:ital@0;1&family=Great+Vibes&family=Playfair+Display:ital,wght@0,400;0,600;0,700;1,400&display=swap" />
      <style dangerouslySetInnerHTML={{ __html: `
        .font-cursive { font-family: 'Great Vibes', cursive; }
        .font-serif { font-family: 'Playfair Display', serif; }
        .font-marathi { font-family: 'Tiro Devanagari Marathi', serif; }
      `}} />

      <div className="relative w-full max-w-[400px] min-h-[100dvh] bg-[#FFFDF7] shadow-2xl overflow-x-hidden font-marathi">
        
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
                <p className="text-[11px] font-sans font-bold tracking-widest text-amber-700 flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> उघडण्यासाठी टॅप करा
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
            
            <div className="absolute inset-x-0 top-[22%] z-10 w-[85%] ml-auto text-right pr-6 flex flex-col items-end">
              
              <p className="text-[10px] font-bold text-[#9a3412] drop-shadow-md">
                सहकुटुंब सहपरिवार
              </p>
              <p className="text-[11px] text-[#9a3412] mt-1 mb-5 font-semibold drop-shadow-md">
                आमच्या आनंदात सहभागी होण्याचे अगत्याचे निमंत्रण
              </p>

              <div className="space-y-1 flex flex-col items-end">
                <div className="text-right flex flex-col items-end">
                  <h1 className="text-4xl whitespace-nowrap font-marathi font-bold text-[#881337] drop-shadow-lg leading-none mb-2">डॉ. क्रिश्नांशू</h1>
                  <p className="text-[9px] text-slate-800 font-bold text-right">
                    श्रीमती कविता आणि<br/>श्री. राजन्ना भंडारवार यांचे सुपुत्र
                  </p>
                </div>
                
                <div className="text-xl text-[#d97706] font-light drop-shadow pr-8 my-1">&amp;</div>
                
                <div className="text-right flex flex-col items-end">
                  <h1 className="text-4xl whitespace-nowrap font-marathi font-bold text-[#881337] drop-shadow-lg leading-none mb-2">डॉ. श्रिया</h1>
                  <p className="text-[9px] text-slate-800 font-bold text-right">
                    श्रीमती सुजाता आणि<br/>श्री. ज्ञानेश्वर पार्लावार यांची सुकन्या
                  </p>
                </div>
              </div>

              <div className="mt-5 pt-3 inline-block border-t border-[#d97706]/60">
                <p className="text-[15px] text-[#4c0519] font-bold drop-shadow-md">शनिवार, ५ डिसेंबर २०२६</p>
                <p className="text-[10px] text-[#4c0519] font-bold drop-shadow-sm">दुपारी १२:२५ | चिलिकुरी गार्डन</p>
              </div>
            </div>

            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center animate-bounce">
              <span className="text-[10px] font-bold text-[#881337] bg-white/80 px-4 py-1.5 rounded-full shadow-sm mb-2 animate-pulse border border-white/50">
                खाली स्क्रोल करा
              </span>
              <div className="w-4 h-4 border-b-[3px] border-r-[3px] border-[#881337] rotate-45 transform -translate-y-1"></div>
            </div>
            
          </section>

          {/* PAGE 2: YOU ARE WARMLY INVITED */}
          <section className="relative w-full py-16 flex flex-col items-center justify-center text-center px-6 bg-gradient-to-b from-[#FFFDF7] to-amber-50">
            <p className="text-amber-700 text-[13px] font-bold mb-10">
              स्नेहपूर्ण निमंत्रण
            </p>
            
            <div className="mb-12 text-[#881337]">
              <h2 className="text-5xl font-marathi font-bold mb-3">डॉ. क्रिश्नांशू</h2>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                श्रीमती कविता आणि<br/>श्री. राजन्ना भंडारवार यांचे सुपुत्र
              </p>
              
              <h2 className="text-4xl font-cursive text-[#d97706] my-6">&amp;</h2>
              
              <h2 className="text-5xl font-marathi font-bold mb-3">डॉ. श्रिया</h2>
              <p className="text-[11px] text-slate-600 font-bold leading-relaxed">
                श्रीमती सुजाता आणि<br/>श्री. ज्ञानेश्वर पार्लावार यांची सुकन्या
              </p>
            </div>

            <div className="grid grid-cols-2 gap-0 w-full border-y border-amber-200 py-8 mb-8">
              <div className="border-r border-amber-200 flex flex-col items-center justify-center px-2">
                <h3 className="text-[11px] text-[#d97706] font-bold mb-2">कधी</h3>
                <p className="text-lg font-bold text-[#881337]">५ डिसेंबर २०२६</p>
              </div>
              <div className="flex flex-col items-center justify-center px-2">
                <h3 className="text-[11px] text-[#d97706] font-bold mb-2">कुठे</h3>
                <p className="text-[12px] font-bold text-[#881337] leading-tight">चिलिकुरी गार्डन,<br/>आदिलाबाद</p>
              </div>
            </div>
            
            <p className="font-sans font-bold text-[#881337] tracking-[0.15em] bg-rose-50 px-6 py-2 rounded-full border border-rose-100 shadow-sm">
              #SHRIKRISHNA
            </p>
          </section>

          {/* PAGE 3: TIMELINE LIST OF EVENTS */}
          <section className="py-12 px-4">
            <div className="text-center mb-12">
              <span className="text-white text-[11px] bg-[#881337] font-bold px-4 py-1.5 mb-4 inline-block shadow-md">
                आनंदाचे ५ दिवस
              </span>
              <h2 className="text-4xl font-marathi font-bold text-[#881337] mb-3 mt-2">विवाह सोहळा</h2>
              <div className="w-12 h-0.5 bg-[#d97706] mx-auto"></div>
            </div>
            
            <div className="space-y-12 pl-2">
              {eventsList.map((event, index) => (
                <div key={index} className="flex gap-4 items-stretch relative">
                  
                  <div className="w-[55%] flex flex-col justify-center border-l-2 border-[#fCD34D] pl-3 py-1 relative">
                    <div className="absolute -left-[7px] top-4 w-3 h-3 rounded-full bg-[#fCD34D] border-2 border-white shadow-md"></div>
                    
                    <h3 className={`text-xl font-bold mb-1 ${event.textColor}`}>{event.title}</h3>
                    <div className={`text-[10px] font-bold mb-2 text-slate-600`}>{event.date}</div>
                    
                    <div className="flex flex-col gap-1 text-[9px] font-semibold text-slate-700 mb-2">
                      <p className="flex items-center gap-1"><Clock size={10} className="text-amber-500" /> वेळ: {event.time}</p>
                      <p className="flex items-center gap-1"><MapPin size={10} className="text-amber-500" /> स्थळ: {event.venue}</p>
                    </div>
                    
                    <p className={`text-[10px] font-semibold bg-amber-50/50 px-2 py-1.5 rounded border border-amber-100 ${event.textColor}`}>
                      "{event.bottomQuote}"
                    </p>
                    
                    <button className="mt-3 text-[9px] font-bold text-rose-600 border border-rose-200 px-3 py-1.5 rounded-full hover:bg-rose-50 w-max shadow-sm">
                      + कॅलेंडरमध्ये जोडा
                    </button>
                  </div>

                  <div 
                    className="w-[45%] flex items-center justify-center cursor-pointer active:scale-95 transition-transform" 
                    onClick={() => openModal(event)}
                  >
                    <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden shadow-lg border border-slate-200 bg-white">
                      <img src={event.image} alt={event.title} className="w-full h-full object-cover object-bottom" />
                      <div className="absolute inset-x-0 bottom-0 bg-slate-800/80 py-2 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white text-[9px] font-bold flex items-center gap-1">
                          ✨ घासून पहा ✨
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
            <p className="text-[#881337] text-[11px] font-bold mb-8">
              शुभ मुहूर्ताची प्रतीक्षा
            </p>
            
            <CountdownTimer />
            
          </section>

          {/* FOOTER */}
          <section className="pb-12 text-center px-4 bg-amber-50">
            <a href="https://wa.me/91XXXXXXXXXX" target="_blank" rel="noreferrer" className="inline-block bg-[#881337] text-white px-8 py-3 rounded-full font-bold text-sm shadow-xl active:scale-95 transition-transform">
              कळवावे (RSVP)
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
              <div className="relative w-full max-w-[360px] aspect-[9/16] bg-white rounded-xl shadow-2xl overflow-hidden font-marathi border border-white/10">
                
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
                
                <div className={`absolute inset-x-0 ${activeEvent.modalTop} z-10 flex flex-col ${activeEvent.alignment}`}>
                  
                  <p className={`text-[11px] font-bold mb-1 drop-shadow-md ${activeEvent.textColor}`}>
                    {activeEvent.topQuote}
                  </p>
                  
                  <h2 className={`text-4xl font-bold ${activeEvent.titleSpacing} drop-shadow-lg ${activeEvent.textColor}`}>
                    {activeEvent.title}
                  </h2>
                  
                  <div className={`flex flex-col gap-1 w-full ${activeEvent.id === 'reception' ? 'items-end max-w-[160px]' : 'items-center max-w-[200px] mx-auto'} mb-2`}>
                    
                    <p className={`flex ${activeEvent.id === 'reception' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-start gap-2 text-[10px] font-bold ${activeEvent.textColor} drop-shadow-md w-full`}>
                      <Calendar size={11} className="text-amber-500 drop-shadow shrink-0 mt-[2px]" />
                      <span className="leading-snug">{activeEvent.date}</span>
                    </p>

                    <p className={`flex ${activeEvent.id === 'reception' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-start gap-2 text-[10px] font-bold ${activeEvent.textColor} drop-shadow-md w-full`}>
                      <Clock size={11} className="text-amber-500 drop-shadow shrink-0 mt-[2px]" />
                      <span className="leading-snug">वेळ: {activeEvent.time}</span>
                    </p>

                    <p className={`flex ${activeEvent.id === 'reception' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-start gap-2 text-[10px] font-bold ${activeEvent.textColor} drop-shadow-md w-full`}>
                      <Shirt size={11} className="text-amber-500 drop-shadow shrink-0 mt-[2px]" />
                      <span className="leading-snug">पेहराव: {activeEvent.dress}</span>
                    </p>

                    <p className={`flex ${activeEvent.id === 'reception' ? 'flex-row-reverse text-right' : 'flex-row text-left'} items-start gap-2 text-[10px] font-bold ${activeEvent.textColor} drop-shadow-md w-full`}>
                      <MapPin size={11} className="text-amber-500 drop-shadow shrink-0 mt-[2px]" />
                      <span className="leading-snug">स्थळ: {activeEvent.venue}</span>
                    </p>
                    
                  </div>

                  <p className={`text-[10px] font-bold drop-shadow-md mt-1 ${activeEvent.textColor}`}>
                    "{activeEvent.bottomQuote}"
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