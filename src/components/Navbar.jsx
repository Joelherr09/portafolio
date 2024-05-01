import React, {useState} from 'react'
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai'
import { ReactTyped } from "react-typed";

import { FaGithubSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";


const Navbar = () => {
    const [nav, setNav] = useState(true)

    const handleNav = () => {
        setNav(!nav)
    }

  return (
    <div className='flex items-center justify-between fixed px-4 md:px-20 h-24 w-full z-50 bg-[#130f40] mx-auto text-white shadow-lg shadow-blue-700/50'>
        <div className='flex gap-4'>
            <div className='h-full flex gap-2 items-center'>
                <a href="https://twitter.com/joelherr09" target="_blank" rel="noreferrer"><FaSquareXTwitter size={36} className='hover:scale-105 duration-300 hover:shadow-lg hover:shadow-blue-500/50 rounded-lg'/></a>
                <a href="https://github.com/Joelherr09" target="_blank" rel="noreferrer"><FaGithubSquare size={36} className='hover:scale-105 duration-300 hover:shadow-lg hover:shadow-blue-500/50 rounded-lg'/></a>
            </div>
            <div className='flex'>
                <h1 className='text-3xl font-semibold hover:scale-105 duration-300 hover:font-bold'>Joel Herrera</h1>
            </div>
        </div>


        <ul className='hidden md:flex'>
            <a href="/">
                <li className='p-4 text-lg hover:scale-105 duration-300 hover:font-bold'>Inicio</li>
            </a>
            <a href="/#habilidades">
                <li className='p-4 text-lg hover:scale-105 duration-300 hover:font-bold'>Habilidades</li>
            </a>
            <a href="/#portafolio">
                <li className='p-4 text-lg hover:scale-105 duration-300 hover:font-bold'>Portafolio</li>
            </a>
            <a href="/#contacto">
                <li className='p-4 text-lg hover:scale-105 duration-300 hover:font-bold'>Contacto</li>
            </a>
            
        </ul>


        <div onClick={handleNav} className='block md:hidden'>
            {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
            
        </div>


        <div className={!nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#130f40] ease-in-out duration-500' : 'fixed left-[-100%]'}>

            <div className='w-full h-24 flex items-center justify-center'>   
                <h1 className='text-3xl font-semibold text-center'>Joel <ReactTyped className=' font-semibold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop /></h1>
            </div>
                <ul className='p-4 uppercase' >
                    <a href="/" onClick={handleNav}>
                        <li className='p-4 border-b border-gray-600'>Inicio</li>
                    </a>
                    <a href="/#habilidades" onClick={handleNav}>
                        <li className='p-4 border-b border-gray-600'>Habilidades</li>
                    </a>
                    <a href="/#portafolio" onClick={handleNav}>
                        <li className='p-4 border-b border-gray-600'>Portafolio</li>
                    </a>
                    <a href="/#contacto" onClick={handleNav}>
                        <li className='p-4'>Contacto</li>
                    </a>
                </ul>
            <div className='h-full flex gap-2 mx-auto justify-center items-center pb-24'>
                <a href="https://twitter.com/joelherr09" target="_blank" rel="noreferrer"><FaSquareXTwitter size={36} className='hover:scale-105 duration-300 hover:shadow-lg hover:shadow-blue-500/50 rounded-lg'/></a>
                <a href="https://github.com/Joelherr09" target="_blank" rel="noreferrer"><FaGithubSquare size={36} className='hover:scale-105 duration-300 hover:shadow-lg hover:shadow-blue-500/50 rounded-lg'/></a>
            </div>

        </div>
    </div>
  )
}

export default Navbar