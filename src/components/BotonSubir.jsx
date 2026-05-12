import React, { useEffect } from 'react';
import { ImArrowUp } from "react-icons/im";

const BotonSubir = () => {

  useEffect(() => {
    const handleScroll = () => {
      const boton = document.querySelector('.boton-subir-contenedor');
      if (boton) {
        if (document.documentElement.scrollTop > 300) {
          boton.classList.add('show');
        } else {
          boton.classList.remove('show');
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <div className="boton-subir-contenedor fixed bottom-8 right-8 z-50 transition-all duration-300 opacity-0 translate-y-10">
      <button
        onClick={scrollToTop}
        className='bg-[#041413]/90 backdrop-blur-lg border border-white/20 
                   hover:border-[#f39d52]/50 w-14 h-14 rounded-2xl 
                   flex items-center justify-center shadow-2xl shadow-black/70
                   hover:scale-110 active:scale-95 transition-all duration-300'
        aria-label="Volver arriba"
      >
        <ImArrowUp size={24} color='#f39d52' />
      </button>
    </div>
  );
};

export default BotonSubir;