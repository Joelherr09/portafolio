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
            <h1 className='text-xl text-blue-200'>Hola! Mi nombre es</h1>
            <h1 className='text-4xl font-bold '>Joel <ReactTyped className=' font-semibold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop /></h1>
            <p className='text-slate-400'>Fullstack Developer</p>
        </div>

        <div className='md:flex md:w-[80%] md:mx-auto pb-4 '>

            <div className='flex w-[90%] mx-auto md:flex-col md:justify-center'>
                <div className='w-full md:justify-center mx-auto md:mb-2'>
                    <img src={Foto} alt="" className='max-h-[400px] drop-shadow-lg rounded-b-xl md:mx-auto'/>
                </div>
                <div className='flex flex-col md:flex-row md:mx-auto bg-slate-700/80 drop-shadow-lg gap-4 my-auto h-full rounded-md items-center p-3 shadow-lg shadow-blue-500/50'>
                    <img src={ReactLogo} alt="" className='h-[60px] w-[60px]  hover:scale-105 duration-300'/>
                    <img src={Php} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
                    <img src={Mysql} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
                    <img src={Django} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
                </div>
            </div>
            <div className='text-white w-[90%] mt-2 h-full mx-auto items-center md:my-auto rounded-md bg-slate-700/80 drop-shadow-lg shadow-lg shadow-blue-500/50'>
                <h1 className='text-4xl font-bold text-center py-3'>Habilidades</h1>
                <div className=' w-[90%] mx-auto'>
                    <p className='text-lg text-center py-2'>Soy desarrollador <strong>Fullstack</strong>, estudiante de Ingeniería en Informática en Inacap. Apasionado por el Desarrollo Web. <br /> En <strong> Front-end</strong> utilizo React, Tailwind. Diseño con Figma, Adobe Photoshop. <br /> En <strong>Back-end</strong> utilizo Php, Django. He experimentado con BaaS como Appwrite.</p>

                </div>
            </div>

        </div>


    </div>
  )
}

export default Hero