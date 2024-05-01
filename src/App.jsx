import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Proyectos from './components/Proyectos'
import Contacto from './components/Contacto'

const App = () => {
  return (
    <div className='bg-img'>
        <Navbar/>
        <Hero/>
        <Proyectos/>
        <Contacto/>
        <Footer/>
    </div>
  )
}

export default App