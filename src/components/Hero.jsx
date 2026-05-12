import React from 'react';
import Foto from '../assets/FotoPerfil1.png';
import { 
  SiNextdotjs,
  SiReact, 
  SiTypescript, 
  SiTailwindcss, 
  SiSupabase, 
  SiPostgresql, 
  SiNodedotjs, 
  SiGit,
  SiMysql,
  SiMongodb,
  SiPython,
} from 'react-icons/si';

const Hero = () => {
  const techIcons = [
    { icon: SiNextdotjs, name: 'Next.js' },
    { icon: SiReact, name: 'React' },
    { icon: SiTypescript, name: 'TypeScript' },
    { icon: SiTailwindcss, name: 'Tailwind' },
    { icon: SiSupabase, name: 'Supabase' },
    { icon: SiPostgresql, name: 'PostgreSQL' },
    { icon: SiNodedotjs, name: 'Node.js' },
    { icon: SiGit, name: 'Git' },
    { icon: SiMysql, name: 'MySQL' },
    { icon: SiMongodb, name: 'MongoDB' },
    { icon: SiPython, name: 'Python' },
    { icon: SiReact, name: 'React Native' },
  ];

  return (
    <div 
      id="home" 
      className="w-full pt-20 pb-12 min-h-screen flex items-center relative overflow-hidden"
    >

      {/* ==================== IMAGEN FONDO MOBILE ==================== */}
      <div className="absolute inset-0 md:hidden pointer-events-none">

        {/* Contenedor de la imagen con máscara de fade-out */}
        <div className="absolute right-[-40px] top-[40%] -translate-y-1/2 w-[290px]">
          {/* Imagen */}
          <img
            src={Foto}
            alt="Joel Herrera"
            className="w-full opacity-65 object-cover relative z-0"
          />
          
          {/* Fade-out en esquina inferior derecha */}
          <div 
            className="absolute inset-0 z-10"
            style={{
              background: 'linear-gradient(135deg, transparent 0%, transparent 50%, rgba(2,10,9,0) 30%, #020a09 100%)'
            }}
          />
        </div>

        {/* Gradiente suave lateral */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#020a09]/90 via-[#020a09]/10 to-transparent z-10" />

        {/* Fade inferior */}
        <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#020a09] to-transparent z-10" />
      </div>

      <div className="max-w-6xl mx-auto px-6 relative z-20 w-full">

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
          <div className="space-y-6 md:space-y-8 order-1 pt-10 md:pt-0">

            <div className="space-y-2">
              <h2 className="text-base md:text-lg text-blue-300 font-medium">
                Hola, soy
              </h2>

              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                Joel Herrera
                <span className="text-[#f39d52]">.</span>
              </h1>

              <div className="text-xl md:text-3xl text-slate-400">
                Fullstack Developer
              </div>
            </div>

            <p className="
              text-[15px] md:text-lg 
              text-gray-300 
              leading-relaxed
              max-w-[130px] md:max-w-lg
            ">
              Creo aplicaciones web modernas, rápidas y escalables.
              Especializado en{' '}
              <strong className="text-white">
                Next.js + Supabase
              </strong>
              , apasionado por digitalizar el deporte en Chile.
            </p>

            {/* Botones en columna para mobile */}
            <div className="flex flex-col md:flex-row gap-3 md:gap-4">

              <a 
                href="#portafolio"
                className="
                  px-6 md:px-8
                  py-3 md:py-4
                  bg-[#f39d52]
                  hover:bg-orange-500
                  text-black
                  font-semibold
                  rounded-2xl
                  transition-all
                  hover:scale-105
                  text-sm md:text-base
                  text-center
                "
              >
                Ver Proyectos
              </a>

              <a 
                href="#contacto"
                className="
                  px-6 md:px-8
                  py-3 md:py-4
                  border border-white/30
                  hover:bg-white/10
                  font-medium
                  rounded-2xl
                  transition-all
                  text-sm md:text-base
                  text-center
                "
              >
                Hablemos
              </a>
            </div>

            {/* Tecnologías */}
            <div className="pt-2 md:pt-4">

              <p className="text-sm text-gray-400 mb-4">
                Tecnologías principales
              </p>

              <div className="flex flex-wrap gap-5 md:gap-6">
                {techIcons.map((tech, i) => (
                  <div 
                    key={i} 
                    className="group flex flex-col items-center"
                  >
                    <tech.icon className="w-7 h-7 md:w-8 md:h-8 text-gray-400 group-hover:text-white transition-colors" />

                    <span className="text-[10px] text-gray-500 mt-1">
                      {tech.name}
                    </span>
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