import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Proyectos from './components/Proyectos'
import Contacto from './components/Contacto'
import BotonSubir from './components/BotonSubir'

const App = () => {
  return (
    <div className='bg-img'>
        <Navbar/>
        <Hero/>
        <Proyectos/>
        <Contacto/>
        <BotonSubir/>
        <Footer/>
    </div>
  )
}

export default App