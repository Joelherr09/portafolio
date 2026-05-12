import React from 'react';
import { ReactTyped } from "react-typed";
import { FaGithubSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";
import { FaLinkedin, FaEnvelope } from "react-icons/fa";

const Footer = () => {
  return (
    <div className='bg-[#041413] text-white w-full mx-auto md:px-8 lg:px-16 px-4 pt-12 pb-8'>
      <div className='md:w-[600px] mx-auto'>
        
        {/* Nombre con efecto de escritura */}
        <div className='flex justify-center mb-6'>
          <h1 className='text-4xl font-bold text-[#f39d52]'>
            Joel <ReactTyped 
              className='font-bold' 
              strings={['Herrera', 'Dev']} 
              typeSpeed={120} 
              backSpeed={140} 
              loop 
            />
          </h1>
        </div>

        {/* Enlaces de navegación */}
        <div className='flex flex-wrap justify-center gap-x-8 gap-y-2 text-lg mb-8'>
          <a href="#home" className='hover:text-[#f39d52] transition-colors duration-300'>Inicio</a>
          <a href="#about" className='hover:text-[#f39d52] transition-colors duration-300'>Sobre mí</a>
          <a href="#projects" className='hover:text-[#f39d52] transition-colors duration-300'>Proyectos</a>
          <a href="#contact" className='hover:text-[#f39d52] transition-colors duration-300'>Contacto</a>
        </div>

        {/* Redes sociales */}
        <div className='flex w-full justify-center gap-6 mb-8'>
          <a 
            href="https://twitter.com/joelherr09" 
            target="_blank" 
            rel="noreferrer"
            className='hover:scale-105 duration-300 hover:shadow-lg hover:shadow-orange-500/50 rounded-lg'
          >
            <FaSquareXTwitter size={36} />
          </a>
          
          <a 
            href="https://github.com/Joelherr09" 
            target="_blank" 
            rel="noreferrer"
            className='hover:scale-105 duration-300 hover:shadow-lg hover:shadow-orange-500/50 rounded-lg'
          >
            <FaGithubSquare size={36} />
          </a>

          <a 
            href="https://linkedin.com/in/tu-perfil" 
            target="_blank" 
            rel="noreferrer"
            className='hover:scale-105 duration-300 hover:shadow-lg hover:shadow-orange-500/50 rounded-lg'
          >
            <FaLinkedin size={36} />
          </a>

          <a 
            href="mailto:tuemail@ejemplo.com" 
            className='hover:scale-105 duration-300 hover:shadow-lg hover:shadow-orange-500/50 rounded-lg'
          >
            <FaEnvelope size={36} />
          </a>
        </div>

        {/* Línea divisoria */}
        <div className='w-full h-px bg-gradient-to-r from-transparent via-[#f39d52]/30 to-transparent mb-6'></div>

        {/* Copyright */}
        <div className='text-center'>
          <p className='text-lg'>
            © 2026 Joel Dev. Todos los derechos reservados.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Footer;