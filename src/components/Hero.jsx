import React from 'react';
import Foto from '../assets/FotoPerfil1.png';
import { ReactTyped } from "react-typed";
import { 
  SiNextdotjs, 
  SiReact, 
  SiTypescript, 
  SiTailwindcss, 
  SiSupabase,
  SiPostgresql,
  SiNodedotjs,
  SiGit
} from 'react-icons/si';

const Hero = () => {
  const techIcons = [
    { icon: SiNextdotjs, name: 'Next.js', color: 'hover:text-white' },
    { icon: SiReact, name: 'React', color: 'hover:text-[#61DAFB]' },
    { icon: SiTypescript, name: 'TypeScript', color: 'hover:text-[#3178C6]' },
    { icon: SiTailwindcss, name: 'Tailwind', color: 'hover:text-[#06B6D4]' },
    { icon: SiSupabase, name: 'Supabase', color: 'hover:text-[#3ECF8E]' },
    { icon: SiPostgresql, name: 'PostgreSQL', color: 'hover:text-[#4169E1]' },
    { icon: SiNodedotjs, name: 'Node.js', color: 'hover:text-[#339933]' },
    { icon: SiGit, name: 'Git', color: 'hover:text-[#F05032]' },
  ];

  return (
    <div id='habilidades' className='w-full mx-auto pt-[100px]'>
      <div className='mx-auto text-center py-2 text-white'>
        <h1 className='text-xl text-blue-200'>Hola! Mi nombre es</h1>
        <h1 className='text-4xl font-bold text-[#f39d52]'>
          Joel <ReactTyped className='font-bold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop />
        </h1>
        <p className='text-slate-400'>Fullstack Developer</p>
      </div>

      <div className='md:flex md:w-[80%] w-full justify-center mx-auto md:mx-auto pb-4'>
        <div className='flex w-[90%] h-full gap-4 justify-center mx-auto md:justify-end md:flex-row-reverse'>
          <img src={Foto} alt="Joel Herrera" className='max-h-[400px] opacity-85 drop-shadow-lg rounded-b-xl' />
          
          {/* Columna de íconos de tecnologías */}
          <div className='grid grid-cols-2 gap-3 bg-[#0c2c27] duration-300 hover:shadow-lg hover:shadow-orange-500/50 drop-shadow-lg p-4 my-auto shadow-lg shadow-black rounded-lg'>
            {techIcons.map((tech, index) => (
              <div 
                key={index}
                className={`group relative flex items-center justify-center p-2 rounded-lg bg-black/20 hover:bg-black/40 transition-all duration-300 cursor-pointer`}
              >
                <tech.icon 
                  className={`w-8 h-8 text-gray-400 ${tech.color} transition-all duration-300 group-hover:scale-110`} 
                />
                <span className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-[10px] text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {tech.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className='text-white w-[90%] mt-8 h-full mx-auto items-center md:my-auto duration-300 hover:shadow-lg hover:shadow-orange-500/50 bg-[#0c2c27] drop-shadow-lg shadow-lg shadow-black rounded-lg'>
          <h1 className='text-4xl font-bold text-center py-3 text-[#f39d52]'>Habilidades</h1>
          <div className='w-[90%] mx-auto pb-3'>
            <p className='text-lg text-center py-2'>
              Soy desarrollador <strong className='text-[#ffb471]'>Fullstack</strong>, 
              creador de <strong className='text-[#ffb471]'>4Volei</strong>. <br />
              <br />
              En <strong className='text-[#ffb471]'>Front-end</strong> utilizo Next.js, React, TypeScript, Tailwind CSS. <br />
              En <strong className='text-[#ffb471]'>Back-end</strong> utilizo Node.js, Supabase, PostgreSQL. <br />
              En <strong className='text-[#ffb471]'>Infraestructura</strong> despliego en Vercel y gestiono con Git. <br />
              <br />
              <span className='text-sm text-gray-400'>
                Actualmente construyendo herramientas para digitalizar el deporte regional chileno.
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;