import React, { useEffect, useState } from 'react';
import { ImArrowUp } from "react-icons/im";
import { FaWhatsapp } from "react-icons/fa";

const FloatingButtons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);

  // Animación de pop para WhatsApp al cargar
  useEffect(() => {
    const timerWhatsApp = setTimeout(() => {
      setShowWhatsApp(true);
    }, 800); // Aparece 800ms después de cargar

    return () => clearTimeout(timerWhatsApp);
  }, []);

  // Control del botón de subir
  useEffect(() => {
    const handleScroll = () => {
      setShowScroll(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsApp = () => {
    window.open('https://wa.me/56921808753?text=Hola%20Joel,%20quiero%20consultar%20por%20tus%20servicios', '_blank');
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 items-end">
      {/* WhatsApp - Animación de aparecer al cargar - ARRIBA */}
      <button
        onClick={openWhatsApp}
        className={`bg-[#25D366] hover:bg-[#20ba5c] w-14 h-14 rounded-2xl 
                   flex items-center justify-center shadow-xl shadow-black/50 
                   transition-all duration-500 hover:scale-110 active:scale-95
                   ${showWhatsApp ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
        aria-label="Contactar por WhatsApp"
      >
        <FaWhatsapp size={28} color="white" />
      </button>

      {/* Botón Subir - Solo aparece al scrollear - ABAJO */}
      <button
        onClick={scrollToTop}
        className={`bg-[#041413]/90 backdrop-blur-lg border border-white/20 
                   hover:border-[#f39d52]/50 w-14 h-14 rounded-2xl 
                   flex items-center justify-center shadow-2xl shadow-black/70
                   hover:scale-110 active:scale-95 transition-all duration-300
                   ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        aria-label="Volver arriba"
      >
        <ImArrowUp size={24} color='#f39d52' />
      </button>
    </div>
  );
};

export default FloatingButtons;