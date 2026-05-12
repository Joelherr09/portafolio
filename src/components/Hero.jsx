import React from 'react';
import Foto from '../assets/FotoPerfil1.png';
import { 
  SiNextdotjs, SiTypescript, SiTailwindcss, 
  SiSupabase, SiPostgresql, SiNodedotjs, SiGit 
} from 'react-icons/si';

const Hero = () => {
  const techIcons = [
    { icon: SiNextdotjs, name: 'Next.js' },
    { icon: SiTypescript, name: 'TypeScript' },
    { icon: SiTailwindcss, name: 'Tailwind' },
    { icon: SiSupabase, name: 'Supabase' },
    { icon: SiPostgresql, name: 'PostgreSQL' },
    { icon: SiNodedotjs, name: 'Node.js' },
    { icon: SiGit, name: 'Git' },
  ];

  return (
    <div 
      id="home" 
      className="w-full pt-20 pb-12 min-h-screen flex items-center relative overflow-hidden"
    >
      
      {/* ==================== IMAGEN FONDO MOBILE ==================== */}
      <div className="absolute inset-0 md:hidden pointer-events-none">
        <img
          src={Foto}
          alt="Joel Herrera"
          className="
            absolute
            right-[-60px] 
            top-1/2
            -translate-y-1/2
            w-[340px]
            opacity-70
            object-cover
            z-0
          "
        />

        {/* Gradiente para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020a09]/80 via-[#020a09]/60 to-transparent z-10" />
        
        {/* Fade inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#020a09] to-transparent z-10" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-20">
        
        <div className="grid md:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* ==================== IMAGEN DESKTOP ==================== */}
          <div className="hidden md:flex justify-end order-2">
            <div className="relative">
              <div className="absolute -inset-8 bg-gradient-to-br from-[#f39d52]/20 to-transparent rounded-[4rem] -z-10 blur-3xl" />
              <div className="relative -rotate-3 hover:rotate-0 transition-transform duration-500">
                <img 
                  src={Foto} 
                  alt="Joel Herrera" 
                  className="w-full max-w-[340px] rounded-3xl shadow-2xl border border-white/10" 
                />
              </div>
            </div>
          </div>

          {/* ==================== TEXTO ==================== */}
          <div className="space-y-8 order-1">
            <div>
              <h2 className="text-lg text-blue-300 font-medium">Hola, soy</h2>
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                Joel Herrera<span className="text-[#f39d52]">.</span>
              </h1>
              <div className="mt-3 text-2xl md:text-3xl text-slate-400">
                Fullstack Developer
              </div>
            </div>

            <p className="text-lg text-gray-300 max-w-[260px] md:max-w-lg leading-relaxed">
              Creo aplicaciones web modernas, rápidas y escalables. 
              Especializado en <strong className="text-white">Next.js + Supabase</strong>, 
              apasionado por digitalizar el deporte en Chile.
            </p>

            <div className="flex flex-wrap gap-4">
              <a 
                href="#portafolio"
                className="px-8 py-4 bg-[#f39d52] hover:bg-orange-500 text-black font-semibold rounded-2xl transition-all hover:scale-105"
              >
                Ver Proyectos
              </a>
              <a 
                href="#contacto"
                className="px-8 py-4 border border-white/30 hover:bg-white/10 font-medium rounded-2xl transition-all"
              >
                Hablemos
              </a>
            </div>

            {/* Tecnologías */}
            <div className="pt-4">
              <p className="text-sm text-gray-400 mb-4">Tecnologías principales</p>
              <div className="flex flex-wrap gap-6">
                {techIcons.map((tech, i) => (
                  <div key={i} className="group flex flex-col items-center">
                    <tech.icon className="w-8 h-8 text-gray-400 group-hover:text-white transition-colors" />
                    <span className="text-[10px] text-gray-500 mt-1">{tech.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Hero;