import React from 'react'
import { ReactTyped } from "react-typed";
import { FaGithubSquare } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <div className='bg-[#130f40]   text-white w-full mx-auto md:px-8 lg:px-16 px-4'>
        <div className='md:w-[600px] mx-auto'>
            <div className='flex mx-auto'>        
                <h1 className='text-4xl font-bold mx-auto py-4'>Joel <ReactTyped className=' font-bold' strings={['Herrera']} typeSpeed={120} backSpeed={140} loop /></h1>
            </div>
            <div className='flex w-full justify-center gap-4'>
                <FaGithubSquare size={36} className='hover:scale-105 duration-300 hover:shadow-lg  hover:shadow-blue-500/50 rounded-lg'/>
                <FaSquareXTwitter size={36} className='hover:scale-105 duration-300 hover:shadow-lg  hover:shadow-blue-500/50 rounded-lg'/>
            </div>
            <p className='text-lg text-center py-4'>© 2024 Joel Dev</p>
        </div>
    </div>
  )
}

export default Footer