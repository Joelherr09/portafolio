import React, { useEffect, useState } from 'react';
import { ImArrowUp } from "react-icons/im";
import { FaWhatsapp, FaInstagram } from "react-icons/fa";

const FloatingButtons = () => {
  const [showScroll, setShowScroll] = useState(false);
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [showInstagram, setShowInstagram] = useState(false);

  // Animación de pop para WhatsApp e Instagram al cargar
  useEffect(() => {
    const timerWhatsApp = setTimeout(() => {
      setShowWhatsApp(true);
    }, 800); // Aparece 800ms después de cargar

    const timerInstagram = setTimeout(() => {
      setShowInstagram(true);
    }, 1000); // Aparece 1000ms después de cargar (ligeramente después para efecto escalonado)

    return () => {
      clearTimeout(timerWhatsApp);
      clearTimeout(timerInstagram);
    };
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

  const openInstagram = () => {
    window.open('https://instagram.com/joelcl.dev/', '_blank'); 
  };

  return (
    <>
      {/* Botón Subir - Izquierda, solo aparece al scrollear */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 bg-[#041413]/90 backdrop-blur-lg border border-white/20 
                   hover:border-[#f39d52]/50 w-14 h-14 rounded-2xl 
                   flex items-center justify-center shadow-2xl shadow-black/70
                   hover:scale-110 active:scale-95 transition-all duration-300
                   ${showScroll ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8 pointer-events-none'}`}
        aria-label="Volver arriba"
      >
        <ImArrowUp size={24} color='#f39d52' />
      </button>

      {/* Contenedor de botones de redes sociales - Derecha */}
      <div className="fixed bottom-6 left-6 z-50 flex flex-col gap-3 items-end">
        {/* WhatsApp - Animación de aparecer al cargar */}
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

        {/* Instagram - Animación de aparecer al cargar */}
        <button
          onClick={openInstagram}
          className={`bg-gradient-to-br from-[#f56040] via-[#c13584] to-[#405de6] 
                     hover:brightness-110 w-14 h-14 rounded-2xl 
                     flex items-center justify-center shadow-xl shadow-black/50 
                     transition-all duration-500 hover:scale-110 active:scale-95
                     ${showInstagram ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
          aria-label="Visitar Instagram"
        >
          <FaInstagram size={26} color="white" />
        </button>
      </div>
    </>
  );
};

export default FloatingButtons;