import React from 'react'
import Foto from '../assets/FotoPerfil1.png'
import { ReactTyped } from "react-typed";

import ReactLogo from '../assets/react.png'
import Php from '../assets/php.png'
import Mysql from '../assets/mysql.png'
import Django from '../assets/django.png'

const Hero = () => {
  return (
    <div className='w-full mx-auto pt-[100px]'>
        <div className='mx-auto text-center py-2 text-white'>
            <h1 className='text-xl text-blue-300'>Mi nombre es</h1>
            <h1 className='text-3xl font-semibold '>Joel <ReactTyped className=' font-semibold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop /></h1>
        </div>
        <div className='flex'>
            <div className='w-full'>
                <img src={Foto} alt="" className='max-h-[400px] drop-shadow-lg'/>
            </div>
            <div className='flex flex-col bg-slate-700 drop-shadow-lg gap-4 my-auto h-full rounded-md items-center p-3 mr-6 shadow-lg shadow-blue-500/50'>
                <img src={ReactLogo} alt="" className='h-[60px] w-[60px]  hover:scale-105 duration-300'/>
                <img src={Php} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
                <img src={Mysql} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
                <img src={Django} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
            </div>
        </div>

    </div>
  )
}

export default Hero