import React from 'react'
import Foto from '../assets/FotoPerfil1.png'
import { ReactTyped } from "react-typed";

import ReactLogo from '../assets/react.png'
import Php from '../assets/php.png'
import Mysql from '../assets/mysql.png'
import Django from '../assets/django.png'

const Hero = () => {
  return (
    <div id='habilidades' className='w-full mx-auto pt-[100px]'>
        <div className='mx-auto text-center py-2 text-white'>
            <h1 className='text-xl text-blue-200'>Hola! Mi nombre es</h1>
            <h1 className='text-4xl font-bold text-[#f39d52]'>Joel <ReactTyped className=' font-bold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop /></h1>
            <p className='text-slate-400'>Fullstack Developer</p>
        </div>

        <div className='md:flex md:w-[80%] w-full justify-center mx-auto md:mx-auto pb-4 '>

            <div className='flex w-[90%] h-full gap-4  justify-center mx-auto md:justify-end md:flex-row-reverse'>
                <img src={Foto} alt="" className='max-h-[400px] opacity-85 drop-shadow-lg rounded-b-xl'/>
                <div className='flex flex-col  bg-[#0c2c27] duration-300 hover:shadow-lg hover:shadow-orange-500/50 drop-shadow-lg gap-4 my-auto h-full items-center p-3 shadow-lg shadow-black'>
                    <img src={ReactLogo} alt="" className='h-[60px] w-[60px]  hover:scale-105 duration-300'/>
                    <img src={Php} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
                    <img src={Mysql} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
                    <img src={Django} alt="" className='h-[60px] w-[60px] hover:scale-105 duration-300'/>
                </div>
            </div>
            <div className='text-white w-[90%] mt-8 h-full mx-auto items-center md:my-auto duration-300 hover:shadow-lg hover:shadow-orange-500/50 bg-[#0c2c27] drop-shadow-lg shadow-lg shadow-black'>
                <h1 className='text-4xl font-bold text-center py-3 text-[#f39d52]'>Habilidades</h1>
                <div className=' w-[90%] mx-auto pb-3'>
                    <p className='text-lg text-center py-2'>Soy desarrollador <strong className='text-[#ffb471]'>Fullstack</strong>, estudiante de <strong className='text-[#ffb471]'>Ingeniería en Informática</strong>. Apasionado por el Desarrollo Web. <br /> En <strong className='text-[#ffb471]'> Front-end</strong> utilizo React, Tailwind. Diseño con Figma, Adobe Photoshop. <br /> En <strong className='text-[#ffb471]'>Back-end</strong> utilizo Php, Django, NodeJS. <br /> En <strong className='text-[#ffb471]'>Bases de Datos</strong> utilizo MySQL, MongoDB, SQLite. He experimentado con BaaS como Appwrite.</p>

                </div>
            </div>

        </div>




    </div>
  )
}

export default Hero