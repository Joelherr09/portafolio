import React from 'react'
import Foto from '../assets/FotoPerfil1.png'
import { ReactTyped } from "react-typed";

const Hero = () => {
  return (
    <div className='w-full mx-auto pt-[100px]'>
        <div className='mx-auto text-center py-4 text-white'>
            <h1 className='text-lg'>Mi nombre es</h1>
            <h1 className='text-3xl font-semibold '>Joel <ReactTyped className=' font-semibold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop /></h1>
        </div>
        <div>
            <div className='w-full'>
                <img src={Foto} alt="" className='max-h-[400px]'/>
            </div>
            <div>

            </div>
        </div>

    </div>
  )
}

export default Hero