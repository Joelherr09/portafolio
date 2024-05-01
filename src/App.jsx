import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'
import Proyectos from './components/Proyectos'

const App = () => {
  return (
    <div className='bg-img'>
        <Navbar/>
        <Hero/>
        <Proyectos/>
        <Footer/>
    </div>
  )
}

export default App