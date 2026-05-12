import React, { useState } from 'react';
import { AiOutlineClose, AiOutlineMenu } from 'react-icons/ai';
import { ReactTyped } from "react-typed";
import { FaGithubSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Navbar = () => {
    const [nav, setNav] = useState(false); // Cambiado a false por defecto

    const handleNav = () => {
        setNav(!nav);
    };

    return (
        <div className='fixed top-6 left-1/2 -translate-x-1/2 w-full max-w-5xl z-50 px-4'>
            {/* Navbar Glass */}
            <div className='flex items-center justify-between 
                            bg-[#041413]/80 backdrop-blur-lg 
                            border border-white/10 
                            rounded-3xl 
                            h-20 px-6 md:px-10 
                            shadow-2xl shadow-black/50'>

                {/* Logo + Redes */}
                <div className='flex items-center gap-5'>
                    <div className='flex gap-3'>
                        <a href="https://twitter.com/joelherr09" target="_blank" rel="noreferrer">
                            <FaSquareXTwitter size={32} className='hover:scale-110 duration-300 text-white hover:shadow-lg hover:shadow-orange-500/50 rounded-xl' />
                        </a>
                        <a href="https://github.com/Joelherr09" target="_blank" rel="noreferrer">
                            <FaGithubSquare size={32} className='hover:scale-110 duration-300 text-white hover:shadow-lg hover:shadow-orange-500/50 rounded-xl' />
                        </a>
                    </div>

                    <a href="/">
                        <h1 className='text-2xl md:text-3xl font-semibold text-[#f39d52] hover:scale-105 duration-300'>
                            Joel Herrera
                        </h1>
                    </a>
                </div>

                {/* Menú Desktop */}
                <ul className='hidden md:flex items-center gap-8 text-[#f39d52]'>
                    <a href="/" className='hover:text-white transition-colors duration-300'>
                        <li className='text-lg'>Inicio</li>
                    </a>
                    <a href="/#habilidades" className='hover:text-white transition-colors duration-300'>
                        <li className='text-lg'>Habilidades</li>
                    </a>
                    <a href="/#portafolio" className='hover:text-white transition-colors duration-300'>
                        <li className='text-lg'>Portafolio</li>
                    </a>
                    <a href="/#contacto" className='hover:text-white transition-colors duration-300'>
                        <li className='text-lg'>Contacto</li>
                    </a>
                </ul>

                {/* Botón menú móvil */}
                <div onClick={handleNav} className='block md:hidden cursor-pointer text-[#f39d52]'>
                    {!nav ? <AiOutlineMenu size={28} /> : <AiOutlineClose size={28} />}
                </div>
            </div>

            {/* ==================== MENÚ DROPDOWN MÓVIL ==================== */}
            <div className={`md:hidden mt-3 overflow-hidden transition-all duration-500 ease-out
                ${nav 
                    ? 'max-h-[420px] opacity-100' 
                    : 'max-h-0 opacity-0'
                }`}>
                
                <div className='bg-[#041413]/95 backdrop-blur-xl border border-white/10 
                                rounded-3xl py-6 px-8 shadow-2xl shadow-black/60'>

                    <div className='flex justify-center mb-6'>
                        <h1 className='text-3xl font-semibold text-[#f39d52]'>
                            Joel <ReactTyped strings={['Herrera']} typeSpeed={120} backSpeed={140} loop />
                        </h1>
                    </div>

                    <ul className='flex flex-col text-center text-lg text-[#f39d52]'>
                        <a href="/" onClick={handleNav} className='py-4 hover:text-white transition-colors border-b border-white/10'>
                            Inicio
                        </a>
                        <a href="/#habilidades" onClick={handleNav} className='py-4 hover:text-white transition-colors border-b border-white/10'>
                            Habilidades
                        </a>
                        <a href="/#portafolio" onClick={handleNav} className='py-4 hover:text-white transition-colors border-b border-white/10'>
                            Portafolio
                        </a>
                        <a href="/#contacto" onClick={handleNav} className='py-4 hover:text-white transition-colors'>
                            Contacto
                        </a>
                    </ul>

                    <div className='flex justify-center gap-8 mt-8'>
                        <a href="https://twitter.com/joelherr09" target="_blank" rel="noreferrer">
                            <FaSquareXTwitter size={38} className='hover:scale-110 duration-300 hover:text-white' />
                        </a>
                        <a href="https://github.com/Joelherr09" target="_blank" rel="noreferrer">
                            <FaGithubSquare size={38} className='hover:scale-110 duration-300 hover:text-white' />
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Navbar;