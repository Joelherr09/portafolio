import React, {useState} from 'react'
import {AiOutlineClose, AiOutlineMenu} from 'react-icons/ai'
import { ReactTyped } from "react-typed";



const Navbar = () => {
    const [nav, setNav] = useState(true)

    const handleNav = () => {
        setNav(!nav)
    }

  return (
    <div className='flex items-center justify-between fixed px-8 h-24 w-full z-50 bg-[#1b1464] mx-auto text-white'>
        <div className='flex'>
            <h1 className='text-3xl font-semibold '>Joel <ReactTyped className=' font-semibold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop /></h1>
        </div>
        <ul className='hidden md:flex'>
            <a href="/#inicio">
                <li className='p-4 hover:scale-105 duration-300 '>Inicio</li>
            </a>
            <a href="/#habilidades">
                <li className='p-4 hover:scale-105 duration-300'>Habilidades</li>
            </a>
            <a href="/#portafolio">
                <li className='p-4 hover:scale-105 duration-300'>Portafolio</li>
            </a>
            
        </ul>


        <div onClick={handleNav} className='block md:hidden'>
            {!nav ? <AiOutlineClose size={20}/> : <AiOutlineMenu size={20} />}
            
        </div>


        <div className={!nav ? 'fixed left-0 top-0 w-[60%] h-full border-r border-r-gray-900 bg-[#1b1464] ease-in-out duration-500' : 'fixed left-[-100%]'}>

            <div className='w-full h-24 flex items-center justify-center'>   
                <h1 className='text-3xl font-semibold text-center'>Joel <ReactTyped className=' font-semibold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop /></h1>
            </div>
                <ul className='p-4 uppercase' >
                    <a href="/#inicio" onClick={handleNav}>
                        <li className='p-4 border-b border-gray-600'>Inicio</li>
                    </a>
                    <a href="/#habilidades" onClick={handleNav}>
                        <li className='p-4 border-b border-gray-600'>Habilidades</li>
                    </a>
                    <a href="/#portafolio" onClick={handleNav}>
                        <li className='p-4'>Portafolio</li>
                    </a>
                </ul>
        </div>
    </div>
  )
}

export default Navbar